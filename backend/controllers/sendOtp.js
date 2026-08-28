import crypto from 'crypto';
import axios from 'axios';

// In-memory OTP store (phone -> { hashedOTP, expiry, plainOtp })
const otpStore = new Map();

/**
 * Generate a secure 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP using SHA-256
 */
function hashOTP(otp) {
  return crypto.createHash('sha256').update(String(otp)).digest('hex');
}

/**
 * Send OTP via MSG91 (with Fast2SMS fallback)
 */
export async function sendOtp(req, res) {
  try {
    const phone = req.body.phone || req.body.mobile;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      });
    }

    // Validate phone format (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number. Must be 10 digits starting with 6-9',
      });
    }

    // Generate OTP & Store
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    otpStore.set(phone, {
      hashedOTP,
      expiry,
    });

    const msg91AuthKey = process.env.MSG91_AUTH_KEY;
    const msg91TemplateId = process.env.MSG91_TEMPLATE_ID;
    const msg91SenderId = process.env.MSG91_SENDER_ID;
    const msg91BaseUrl = process.env.MSG91_BASE_URL || 'https://control.msg91.com/api/v5';
    const useSender = process.env.MSG91_USE_SENDER === 'true';

    // 1. Primary: Send via MSG91
    if (msg91AuthKey && msg91TemplateId) {
      try {
        let msg91Url = `${msg91BaseUrl}/otp?template_id=${encodeURIComponent(msg91TemplateId)}&mobile=91${phone}&authkey=${encodeURIComponent(msg91AuthKey)}&otp=${otp}`;
        if (useSender && msg91SenderId) {
          msg91Url += `&sender=${encodeURIComponent(msg91SenderId)}`;
        }

        if (process.env.MSG91_DEBUG === 'true') {
          console.log(`[MSG91] Sending OTP to 91${phone} using Template ${msg91TemplateId}...`);
        }

        const msg91Response = await axios.post(
          msg91Url,
          {
            otp: String(otp),
            OTP: String(otp),
            company: 'BuyNest',
          },
          {
            headers: {
              authkey: msg91AuthKey,
              'Content-Type': 'application/json',
            },
            timeout: 10000,
          }
        );

        if (process.env.MSG91_DEBUG === 'true') {
          console.log('[MSG91] Response:', msg91Response.data);
        }

        if (msg91Response.data && (msg91Response.data.type === 'success' || msg91Response.data.request_id)) {
          return res.json({
            success: true,
            message: 'OTP sent successfully via MSG91',
            requestId: msg91Response.data.request_id,
          });
        } else {
          throw new Error(msg91Response.data?.message || 'MSG91 returned non-success status');
        }
      } catch (msg91Err) {
        console.error('[MSG91 Error]', msg91Err.response?.data || msg91Err.message);
        // Fallback to Fast2SMS if available
      }
    }

    // 2. Fallback: Fast2SMS
    const fast2smsApiKey = process.env.FAST2SMS_API_KEY;
    if (fast2smsApiKey) {
      try {
        const params = new URLSearchParams();
        params.append('route', 'q');
        params.append('message', `Welcome to BuyNest! Your one-time password (OTP) is ${otp}. Please keep it confidential.`);
        params.append('numbers', phone);

        const smsResponse = await axios.post(
          'https://www.fast2sms.com/dev/bulkV2',
          params.toString(),
          {
            headers: {
              authorization: fast2smsApiKey,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 10000,
          }
        );

        if (smsResponse.data.return === true) {
          return res.json({
            success: true,
            message: 'OTP sent successfully',
          });
        }
      } catch (fast2smsErr) {
        console.error('[Fast2SMS Error]', fast2smsErr.response?.data || fast2smsErr.message);
      }
    }

    // If both SMS providers fail
    otpStore.delete(phone);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please check SMS gateway configuration.',
    });

  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while sending OTP',
    });
  }
}

export { otpStore, hashOTP };
