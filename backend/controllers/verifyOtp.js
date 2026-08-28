import jwt from 'jsonwebtoken';
import axios from 'axios';
import { otpStore, hashOTP } from './sendOtp.js';
import User from '../models/User.js';

// In-memory verified phone numbers awaiting name/email (phone -> expiry)
const verifiedPhonesStore = new Map();

/**
 * Verify OTP and authenticate/register user
 */
export async function verifyOtp(req, res) {
  try {
    const phone = req.body.phone || req.body.mobile;
    const otp = req.body.otp;
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    let isVerified = false;
    const jwtSecret = process.env.JWT_SECRET || 'secret';

    // 1. Check signed verificationToken from step 2
    if (req.body.verificationToken) {
      try {
        const decoded = jwt.verify(req.body.verificationToken, jwtSecret);
        if (decoded.phone === phone && decoded.purpose === 'otp_registration') {
          isVerified = true;
        }
      } catch (tokenErr) {
        console.warn('[verifyOtp] Verification token invalid/expired:', tokenErr.message);
      }
    }

    // 2. Check in-memory map
    if (!isVerified) {
      const verifiedTimestamp = verifiedPhonesStore.get(phone);
      if (verifiedTimestamp && Date.now() < verifiedTimestamp) {
        isVerified = true;
      }
    }

    // 3. Otherwise, verify the provided OTP
    if (!isVerified) {
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: 'OTP is required',
        });
      }

      if (!/^\d{6}$/.test(otp)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid OTP format. Must be 6 digits',
        });
      }

      // Check local OTP store
      const storedData = otpStore.get(phone);
      if (storedData) {
        if (Date.now() > storedData.expiry) {
          otpStore.delete(phone);
          return res.status(400).json({
            success: false,
            message: 'OTP has expired. Please request a new OTP',
          });
        }

        const hashedInputOTP = hashOTP(otp);
        if (hashedInputOTP === storedData.hashedOTP) {
          isVerified = true;
          otpStore.delete(phone);
        }
      }

      // Secondary: MSG91 Verify API fallback
      if (!isVerified) {
        const msg91AuthKey = process.env.MSG91_AUTH_KEY;
        const msg91BaseUrl = process.env.MSG91_BASE_URL || 'https://control.msg91.com/api/v5';
        if (msg91AuthKey) {
          try {
            const verifyUrl = `${msg91BaseUrl}/otp/verify?otp=${otp}&mobile=91${phone}&authkey=${encodeURIComponent(msg91AuthKey)}`;
            const msg91VerifyRes = await axios.get(verifyUrl, { timeout: 8000 });
            if (msg91VerifyRes.data?.type === 'success' || msg91VerifyRes.data?.message?.toLowerCase().includes('success')) {
              isVerified = true;
            }
          } catch (msg91VerifyErr) {
            console.warn('[MSG91 Verify Error]', msg91VerifyErr.response?.data || msg91VerifyErr.message);
          }
        }
      }
    }

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check the code and try again.',
      });
    }

    // Check if user already exists by phone or email
    let user = await User.findOne({ phone });
    let existingByEmail = email ? await User.findOne({ email }) : null;

    // If account with email exists and is different from phone user document
    if (existingByEmail) {
      if (user && String(user._id) !== String(existingByEmail._id)) {
        // Remove temporary placeholder OTP document if it exists
        if (!user.passwordHash && !user.googleId) {
          try { await User.deleteOne({ _id: user._id }); } catch {}
        }
      }
      user = existingByEmail;
    }

    // If new user (or existing user without custom name) and name was NOT provided yet -> ask for Name & Email
    const isNew = !user || !user.name || user.name.startsWith('User ');
    if (isNew && !name) {
      // Mark phone as verified for 15 minutes and issue a signed verificationToken
      verifiedPhonesStore.set(phone, Date.now() + 15 * 60 * 1000);
      const verificationToken = jwt.sign({ phone, purpose: 'otp_registration' }, jwtSecret, { expiresIn: '15m' });

      return res.json({
        success: true,
        isNewUser: true,
        phone,
        verificationToken,
        message: 'OTP verified successfully! Please enter your name and email to complete registration.',
      });
    }

    // User is submitting profile or is an existing user with profile
    verifiedPhonesStore.delete(phone);

    try {
      if (!user) {
        // Create new user with submitted name and email
        user = await User.create({
          name: name || `User ${phone.slice(-4)}`,
          email: email || undefined,
          phone,
          provider: 'otp',
        });
        console.log('New user registered via OTP:', { id: String(user._id), name: user.name, phone: user.phone });
      } else {
        // Update existing user
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        await user.save();
      }
    } catch (saveErr) {
      console.warn('[verifyOtp] Save error, attempting recovery:', saveErr.message);
      if (saveErr.code === 11000) {
        user = await User.findOne({ $or: [{ phone }, ...(email ? [{ email }] : [])] });
        if (user) {
          if (name) user.name = name;
          if (phone && !user.phone) user.phone = phone;
          try { await user.save(); } catch {}
        }
      } else {
        throw saveErr;
      }
    }

    if (!user) {
      throw new Error('Failed to create or retrieve user profile');
    }

    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
    }

    const token = jwt.sign(
      {
        id: String(user._id),
        phone: user.phone,
        email: user.email,
        isAdmin: !!user.isAdmin,
        type: 'otp_login',
      },
      jwtSecret,
      {
        expiresIn: '7d',
      }
    );

    const isProd = process.env.NODE_ENV === 'production' || (process.env.BACKEND_URL || '').startsWith('https://');
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      isNewUser: false,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: !!user.isAdmin,
      },
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during verification',
    });
  }
}
