import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import { Address } from '../models/Address.js';
import { Product } from '../models/product.js';
import { User } from '../models/User.js';
import { sendOrderInvoiceEmail } from '../services/invoiceEmail.service.js';

const parseRupeeToNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  const parsed = Number(numeric);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getClient = () => {
  const key_id = process.env.RAZORPAY_KEY_ID || '';
  const key_secret = process.env.RAZORPAY_KEY_SECRET || '';
  if (!key_id || !key_secret) return null;
  return { client: new Razorpay({ key_id, key_secret }), key_id, key_secret };
};

// Helper function to find product in unified collection
async function findProductById(productId) {
  return Product.findById(productId);
}

export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes = {} } = req.body || {};
    const rupees = Number(amount);
    if (!rupees || Number.isNaN(rupees) || rupees <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }
    const ctx = getClient();
    if (!ctx) {
      return res.status(500).json({ error: 'Razorpay keys not configured on server' });
    }

    const options = {
      amount: Math.round(rupees * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes,
    };

    const order = await ctx.client.orders.create(options);
    return res.json({ order, key: ctx.key_id });
  } catch (err) {
    console.error('Razorpay createOrder error:', err?.message || err);
    if (err?.error?.description) console.error('Razorpay API:', err.error.description);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = req.body || {};
    
    const orderId = razorpay_order_id || razorpayOrderId;
    const paymentId = razorpay_payment_id || razorpayPaymentId;
    const signature = razorpay_signature || razorpaySignature;
    
    console.log('[verifyPayment] Received payment data:', {
      has_order_id: !!orderId,
      has_payment_id: !!paymentId,
      has_signature: !!signature,
      body_keys: Object.keys(req.body || {}),
    });
    
    if (!orderId || !paymentId || !signature) {
      console.error('[verifyPayment] Missing required fields. Received:', req.body);
      return res.status(400).json({ error: 'Missing required payment fields (order_id, payment_id, signature)' });
    }
    
    const ctx = getClient();
    if (!ctx) {
      console.error('[verifyPayment] Razorpay keys not configured');
      return res.status(500).json({ error: 'Server secret missing' });
    }

    const payload = `${orderId}|${paymentId}`;
    const expected = crypto.createHmac('sha256', ctx.key_secret).update(payload).digest('hex');

    if (expected !== signature) {
      console.error('[verifyPayment] Invalid signature. Expected:', expected.substring(0, 20) + '...', 'Received:', signature.substring(0, 20) + '...');
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }

    const userId = req.userId;
    if (!userId) {
      console.error('[verifyPayment] No userId found');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    console.log('[verifyPayment] User ID:', userId);
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      console.error('[verifyPayment] Cart is empty for user:', userId);
      return res.status(400).json({ error: 'Cart is empty' });
    }

    console.log('[verifyPayment] Cart items count:', cart.items.length);

    // Populate products from unified collection
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await findProductById(i.product);
        if (!product) {
          console.error('[verifyPayment] Product not found:', i.product);
          throw new Error(`Product ${i.product} not found`);
        }
        
        const base = parseRupeeToNumber(
          product.price ||
          product.mrp ||
          product.MRP ||
          product.get?.('MRP') ||
          product._doc?.['MRP'] ||
          0
        );
        
        return { 
          product: product._id, 
          quantity: i.quantity, 
          price: base,
          size: i.size || undefined
        };
      })
    );
    
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    console.log('[verifyPayment] Order amount:', amount);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch {}

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'paid',
      paymentMethod: 'Razorpay',
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    console.log('[verifyPayment] Order created successfully:', order._id);
    sendOrderInvoiceEmail(order._id).catch((err) =>
      console.error('[verifyPayment] Invoice email failed:', err.message)
    );
    return res.json({ success: true, order });
  } catch (err) {
    console.error('[verifyPayment] Error:', err?.message || err);
    console.error('[verifyPayment] Stack:', err?.stack);
    return res.status(500).json({ error: err.message || 'Verification failed' });
  }
};

export const createCodOrder = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Populate products from unified collection
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await findProductById(i.product);
        if (!product) {
          throw new Error(`Product ${i.product} not found`);
        }
        
        const base = parseRupeeToNumber(
          product.price ||
          product.mrp ||
          product.MRP ||
          product.get?.('MRP') ||
          product._doc?.['MRP'] ||
          0
        );
        
        return { 
          product: product._id, 
          quantity: i.quantity, 
          price: base,
          size: i.size || undefined
        };
      })
    );
    
    const amount = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
      }
    } catch (err) {
      console.error('Error loading address:', err);
    }

    const order = await Order.create({
      user: userId,
      items,
      amount,
      currency: 'INR',
      status: 'created',
      paymentMethod: 'COD',
      shippingAddress,
    });

    cart.items = [];
    await cart.save();

    sendOrderInvoiceEmail(order._id).catch((err) =>
      console.error('[createCodOrder] Invoice email failed:', err.message)
    );
    return res.json({ success: true, order });
  } catch (err) {
    console.error('COD order creation error:', err?.message || err);
    return res.status(500).json({ error: err.message || 'Failed to create COD order' });
  }
};

/**
 * PayU Payment Gateway Integration
 */
export const initiatePayuPayment = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const key = process.env.PAYU_KEY || 'rgt1q1';
    const salt = process.env.PAYU_SALT || 'ZhXv2CWaOELwsdjOb6L486lIlmfHPAbI';
    const payuEnv = process.env.PAYU_ENV || 'production';
    const action = payuEnv === 'test' 
      ? 'https://test.payu.in/_payment' 
      : 'https://secure.payu.in/_payment';

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Populate products from unified collection
    const items = await Promise.all(
      cart.items.map(async (i) => {
        const product = await findProductById(i.product);
        if (!product) {
          throw new Error(`Product ${i.product} not found`);
        }
        
        const base = parseRupeeToNumber(
          product.price ||
          product.mrp ||
          product.MRP ||
          product.get?.('MRP') ||
          product._doc?.['MRP'] ||
          0
        );
        
        return { 
          product: product._id, 
          quantity: i.quantity, 
          price: base,
          size: i.size || undefined
        };
      })
    );
    
    const amountNum = items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const amount = amountNum.toFixed(2);

    // Load user's current address to snapshot into the order
    let shippingAddress = null;
    let userPhone = '';
    let userName = '';
    let userEmail = '';

    try {
      const addr = await Address.findOne({ userId });
      if (addr) {
        const { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType } = addr;
        shippingAddress = { fullName, mobileNumber, pincode, locality, address, city, state, landmark, alternatePhone, addressType };
        userName = fullName || '';
        userPhone = mobileNumber || '';
      }
    } catch (err) {
      console.error('Error loading address:', err);
    }

    try {
      const user = await User.findById(userId);
      if (user) {
        if (!userName) userName = user.name || '';
        if (!userPhone) userPhone = user.phone || user.mobile || '';
        userEmail = user.email || '';
      }
    } catch {}

    if (!userName) userName = 'Customer';
    if (!userPhone) userPhone = '9999999999';
    if (!userEmail) userEmail = 'customer@buynest.shop';

    const txnid = 'BN_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const productinfo = 'BuyNest Order';

    // Create pending order
    const order = await Order.create({
      user: userId,
      items,
      amount: amountNum,
      currency: 'INR',
      status: 'created',
      paymentMethod: 'PayU',
      payuTxnId: txnid,
      shippingAddress,
    });

    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const host = req.get('host');
    const backendUrl = process.env.BACKEND_URL || `${protocol}://${host}`;
    const surl = `${backendUrl}/api/payment/payu/response`;
    const furl = `${backendUrl}/api/payment/payu/response`;
    const curl = `${backendUrl}/api/payment/payu/response`;

    const originHeader = req.get('origin') || req.get('referer');
    let frontendBase = 'https://www.buynestventures.shop';
    if (originHeader) {
      try {
        const u = new URL(originHeader);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
          frontendBase = `${u.protocol}//${u.host}`;
        } else {
          frontendBase = 'https://www.buynestventures.shop';
        }
      } catch {}
    }

    const udf1 = userId.toString();
    const udf2 = order._id.toString();
    const udf3 = frontendBase;
    const udf4 = '';
    const udf5 = '';

    // Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${userName}|${userEmail}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return res.json({
      success: true,
      action,
      params: {
        key,
        txnid,
        amount,
        productinfo,
        firstname: userName,
        email: userEmail,
        phone: userPhone,
        surl,
        furl,
        curl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      },
    });
  } catch (err) {
    console.error('PayU initiate error:', err);
    return res.status(500).json({ error: err.message || 'Failed to initiate PayU payment' });
  }
};

const renderAutoRedirectHtml = (redirectUrl, message = 'Payment Processing') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <title>BuyNest - Payment Status</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #fdf2f8;
      color: #1f2937;
    }
    .card {
      background: #ffffff;
      padding: 32px 40px;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 400px;
      width: 90%;
    }
    .spinner {
      border: 4px solid #fce7f3;
      border-top: 4px solid #ec4899;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    h2 { font-size: 18px; margin: 0 0 8px; color: #111827; }
    p { font-size: 14px; color: #6b7280; margin: 0 0 16px; }
    a { color: #ec4899; text-decoration: none; font-weight: 600; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>${message}</h2>
    <p>Redirecting you to BuyNest, please wait...</p>
    <a href="${redirectUrl}">Click here if not redirected automatically</a>
  </div>
  <script>
    setTimeout(function() {
      window.location.replace("${redirectUrl}");
    }, 100);
  </script>
</body>
</html>
`;

/**
 * Handle PayU Webhook / Redirect Response (surl / furl)
 */
export const handlePayuResponse = async (req, res) => {
  try {
    const data = req.body || {};
    console.log('[handlePayuResponse] Data received:', {
      status: data.status,
      txnid: data.txnid,
      amount: data.amount,
      mihpayid: data.mihpayid,
      udf1: data.udf1,
      udf2: data.udf2,
      error_Message: data.error_Message,
    });

    const key = process.env.PAYU_KEY || 'rgt1q1';
    const salt = process.env.PAYU_SALT || 'ZhXv2CWaOELwsdjOb6L486lIlmfHPAbI';
    let frontendUrl = 'https://www.buynestventures.shop';
    if (data.udf3 && data.udf3.startsWith('http')) {
      try {
        const u = new URL(data.udf3);
        if (u.hostname === 'localhost' || u.hostname === '127.0.0.1') {
          frontendUrl = `${u.protocol}//${u.host}`;
        } else {
          frontendUrl = 'https://www.buynestventures.shop';
        }
      } catch {}
    }

    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      additionalCharges,
      hash,
      mihpayid,
    } = data;

    // Verify Reverse Hash
    let hashString = '';
    if (additionalCharges) {
      hashString = `${additionalCharges}|${salt}|${status}||||||${udf5 || ''}|${udf4 || ''}|${udf3 || ''}|${udf2 || ''}|${udf1 || ''}|${email || ''}|${firstname || ''}|${productinfo || ''}|${amount || ''}|${txnid || ''}|${key}`;
    } else {
      hashString = `${salt}|${status}||||||${udf5 || ''}|${udf4 || ''}|${udf3 || ''}|${udf2 || ''}|${udf1 || ''}|${email || ''}|${firstname || ''}|${productinfo || ''}|${amount || ''}|${txnid || ''}|${key}`;
    }

    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');

    if (status === 'success') {
      const orderId = udf2;
      let order = null;
      if (orderId) {
        order = await Order.findById(orderId);
      }
      if (!order && txnid) {
        order = await Order.findOne({ payuTxnId: txnid });
      }

      if (order) {
        const wasAlreadyPaid = order.status === 'paid';
        order.status = 'paid';
        order.paymentMethod = 'PayU';
        order.payuMihpayid = mihpayid || '';
        order.payuStatus = status;
        await order.save();

        // Clear Cart
        if (order.user) {
          await Cart.updateOne({ user: order.user }, { $set: { items: [] } });
        }

        if (!wasAlreadyPaid) {
          sendOrderInvoiceEmail(order._id, { email, name: firstname }).catch((err) =>
            console.error('[handlePayuResponse] Invoice email failed:', err.message)
          );
        }

        const successUrl = `${frontendUrl}/order-success?method=payu&orderId=${order._id}`;
        res.setHeader('Content-Type', 'text/html');
        return res.send(renderAutoRedirectHtml(successUrl, 'Payment Successful!'));
      }

      const defaultSuccessUrl = `${frontendUrl}/order-success?method=payu`;
      res.setHeader('Content-Type', 'text/html');
      return res.send(renderAutoRedirectHtml(defaultSuccessUrl, 'Payment Successful!'));
    } else {
      const orderId = udf2;
      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: 'failed',
          payuStatus: status || 'failed',
          payuMihpayid: mihpayid || '',
        });
      }

      const errorMsg = encodeURIComponent(data.error_Message || data.unmappedstatus || 'Payment failed or cancelled');
      const failUrl = `${frontendUrl}/address?payment=failed&reason=${errorMsg}`;
      res.setHeader('Content-Type', 'text/html');
      return res.send(renderAutoRedirectHtml(failUrl, 'Payment Incomplete or Failed'));
    }
  } catch (err) {
    console.error('[handlePayuResponse] Error:', err);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const errUrl = `${frontendUrl}/address?payment=failed&reason=InternalServerError`;
    res.setHeader('Content-Type', 'text/html');
    return res.send(renderAutoRedirectHtml(errUrl, 'Payment Processing Error'));
  }
};
