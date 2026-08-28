import { Resend } from 'resend';
import Order from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/product.js';
import { COMPANY_INFO } from '../config/companyInfo.js';

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;

const getProductTitle = (product) =>
  product?.title || product?.['SKU Name'] || product?.name || 'Product';

async function populateOrderItems(items) {
  return Promise.all(
    (items || []).map(async (item) => {
      const product = await Product.findById(item.product);
      const productObj = product?.toObject?.() || product;
      const price =
        item.price && item.price > 0
          ? item.price
          : productObj?.price || productObj?.mrp || 0;

      return {
        quantity: item.quantity || 1,
        price,
        size: item.size,
        title: getProductTitle(productObj),
      };
    })
  );
}

function buildInvoiceHtml({ order, items, customerName }) {
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const shipping = order.shippingAddress || {};
  const paymentLabel =
    order.paymentMethod === 'COD'
      ? 'Cash on Delivery'
      : order.paymentMethod === 'PayU'
        ? 'PayU (Online)'
        : order.paymentMethod === 'Razorpay'
          ? 'Razorpay (Online)'
          : 'Online Payment';

  const itemRows = items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;">
            ${item.title}${item.size ? `<br><span style="color:#6b7280;font-size:12px;">Size: ${item.size}</span>` : ''}
          </td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;">${formatINR(item.price)}</td>
          <td style="padding:12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${formatINR(item.price * item.quantity)}</td>
        </tr>`
    )
    .join('');

  const addressLines = [
    shipping.fullName,
    shipping.address,
    shipping.locality,
    [shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', '),
    shipping.mobileNumber ? `Phone: ${shipping.mobileNumber}` : '',
  ]
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 4px;color:#4b5563;">${line}</p>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,sans-serif;color:#111827;">
  <div style="max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:24px;">
      <div style="border-bottom:2px solid #e5e7eb;padding-bottom:20px;margin-bottom:24px;">
        <h1 style="margin:0 0 4px;font-size:24px;">${COMPANY_INFO.brandName}</h1>
        <p style="margin:0 0 8px;color:#4b5563;font-size:14px;">${COMPANY_INFO.legalName}</p>
        <p style="margin:0;color:#6b7280;font-size:12px;">${COMPANY_INFO.registeredAddress}</p>
        <p style="margin:8px 0 0;color:#6b7280;font-size:12px;">GSTIN: ${COMPANY_INFO.gstin}</p>
      </div>

      <p style="margin:0 0 16px;font-size:15px;">Hi ${customerName || 'Customer'},</p>
      <p style="margin:0 0 24px;color:#4b5563;">Thank you for your order! Here is your invoice.</p>

      <table style="width:100%;margin-bottom:24px;font-size:14px;">
        <tr>
          <td style="vertical-align:top;width:50%;padding-right:12px;">
            <p style="margin:0 0 8px;font-weight:700;text-transform:uppercase;font-size:12px;">Order Information</p>
            <p style="margin:0 0 4px;color:#4b5563;">Order #: <strong>${orderNumber}</strong></p>
            <p style="margin:0 0 4px;color:#4b5563;">Date: ${orderDate}</p>
            <p style="margin:0 0 4px;color:#4b5563;">Payment: ${paymentLabel}</p>
            <p style="margin:0;color:#4b5563;">Status: ${order.status || 'confirmed'}</p>
          </td>
          <td style="vertical-align:top;width:50%;padding-left:12px;">
            <p style="margin:0 0 8px;font-weight:700;text-transform:uppercase;font-size:12px;">Shipping Address</p>
            ${addressLines || '<p style="margin:0;color:#4b5563;">Not provided</p>'}
          </td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:14px;">
        <thead>
          <tr style="background:#f9fafb;">
            <th style="padding:12px;text-align:left;border-bottom:2px solid #e5e7eb;">Item</th>
            <th style="padding:12px;text-align:center;border-bottom:2px solid #e5e7eb;">Qty</th>
            <th style="padding:12px;text-align:right;border-bottom:2px solid #e5e7eb;">Price</th>
            <th style="padding:12px;text-align:right;border-bottom:2px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>

      <table style="width:100%;max-width:280px;margin-left:auto;font-size:14px;">
        <tr>
          <td style="padding:4px 0;color:#6b7280;">Subtotal</td>
          <td style="padding:4px 0;text-align:right;">${formatINR(order.amount)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#6b7280;">Shipping</td>
          <td style="padding:4px 0;text-align:right;">Free</td>
        </tr>
        <tr>
          <td style="padding:8px 0 0;font-size:16px;font-weight:700;border-top:1px solid #e5e7eb;">Total</td>
          <td style="padding:8px 0 0;font-size:16px;font-weight:700;text-align:right;border-top:1px solid #e5e7eb;">${formatINR(order.amount)}</td>
        </tr>
      </table>

      <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px;">
        <p style="margin:0 0 8px;">Need help? Contact us at ${COMPANY_INFO.email} or ${COMPANY_INFO.phone}</p>
        <p style="margin:0;">© ${new Date().getFullYear()} ${COMPANY_INFO.legalName}</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Send order invoice email via Resend.
 * @param {string} orderId
 * @param {{ email?: string }} options - optional override email (e.g. PayU callback)
 */
export async function sendOrderInvoiceEmail(orderId, options = {}) {
  const apiKey = process.env.RESEND_API;
  if (!apiKey) {
    console.warn('[invoiceEmail] RESEND_API not configured, skipping invoice email');
    return { skipped: true, reason: 'missing_api_key' };
  }

  const order = await Order.findById(orderId);
  if (!order) {
    console.warn('[invoiceEmail] Order not found:', orderId);
    return { skipped: true, reason: 'order_not_found' };
  }

  if (order.invoiceEmailSentAt) {
    return { skipped: true, reason: 'already_sent' };
  }

  let recipientEmail = options.email?.trim() || '';
  let customerName = options.name?.trim() || '';

  if (order.user) {
    const user = await User.findById(order.user).select('name email');
    if (user) {
      if (!recipientEmail) recipientEmail = user.email || '';
      if (!customerName) customerName = user.name || '';
    }
  }

  if (!customerName && order.shippingAddress?.fullName) {
    customerName = order.shippingAddress.fullName;
  }

  if (!recipientEmail) {
    console.warn('[invoiceEmail] No recipient email for order:', orderId);
    return { skipped: true, reason: 'no_recipient_email' };
  }

  const items = await populateOrderItems(order.items);
  const html = buildInvoiceHtml({ order, items, customerName });
  const orderNumber = order._id.toString().slice(-8).toUpperCase();
  const from =
    process.env.RESEND_FROM || `${COMPANY_INFO.brandName} <onboarding@resend.dev>`;

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from,
    to: recipientEmail,
    subject: `Your BuyNest Invoice — Order #${orderNumber}`,
    html,
  });

  if (error) {
    console.error('[invoiceEmail] Resend error:', error);
    throw new Error(error.message || 'Failed to send invoice email');
  }

  order.invoiceEmailSentAt = new Date();
  await order.save();

  console.log('[invoiceEmail] Sent invoice for order', orderId, 'to', recipientEmail, data?.id);
  return { success: true, id: data?.id };
}
