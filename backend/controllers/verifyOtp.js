import jwt from 'jsonwebtoken';
import axios from 'axios';
import { otpStore, hashOTP } from './sendOtp.js';
import User from '../models/User.js';

/**
 * Verify OTP and authenticate user
 */
export async function verifyOtp(req, res) {
  try {
    const phone = req.body.phone || req.body.mobile;
    const otp = req.body.otp;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required',
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP format. Must be 6 digits',
      });
    }

    let isVerified = false;

    // 1. Check local OTP store first
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

    // 2. Secondary: MSG91 Verify API fallback
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

    if (!isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check the code and try again.',
      });
    }

    // Find or create user by phone number
    let user = await User.findOne({ phone });
    
    if (!user) {
      user = await User.create({
        name: `User ${phone.slice(-4)}`,
        phone,
        provider: 'otp',
      });
      console.log('New user created via OTP:', { id: String(user._id), phone: user.phone });
    } else {
      if (!user.phone) {
        user.phone = phone;
      }
      if (user.provider !== 'otp') {
        user.provider = 'otp';
      }
      await user.save();
    }

    const jwtSecret = process.env.JWT_SECRET;
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
