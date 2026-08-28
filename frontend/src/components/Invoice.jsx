import React, { useState, useEffect } from 'react';
import { getProductImage } from '../utils/imagePlaceholder';
import { COMPANY_INFO } from '../config/companyInfo';
import brandLogo from '../assets/buynest.logo.jpeg';
import { api } from '../utils/api';

const Invoice = ({ order, user, onPrint, totals: totalsOverride, invoiceNumber: invoiceNumberOverride, forExport = false }) => {
  const [logoUrl, setLogoUrl] = useState(brandLogo);

  useEffect(() => {
    if (forExport) return;
    api.getLogo('footer')
      .then((logo) => {
        if (logo?.url) setLogoUrl(logo.url);
      })
      .catch(() => {});
  }, [forExport]);

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No order data available</p>
      </div>
    );
  }

  const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;
  const orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
  const orderNumber = invoiceNumberOverride
    || (order._id ? order._id.toString().slice(-8).toUpperCase() : 'N/A');
  
  // Calculate totals
  const lineSubtotal = order.items?.reduce((sum, item) => {
    const itemPrice = item.price || item.product?.price || 0;
    const quantity = item.quantity || 1;
    return sum + (itemPrice * quantity);
  }, 0) || 0;

  const subtotal = totalsOverride?.subtotal ?? lineSubtotal ?? order.amount ?? 0;
  const gst = totalsOverride?.gst ?? 0;
  const shipping = totalsOverride?.shipping ?? 0;
  const total = totalsOverride?.total ?? order.amount ?? (subtotal + gst + shipping);
  const gstRate = totalsOverride?.gstRate ?? 18;
  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start gap-6">
          <div className="flex items-start gap-4 min-w-0">
            <img
              src={logoUrl}
              alt={COMPANY_INFO.brandName}
              className="h-16 w-auto max-w-[120px] object-contain shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = brandLogo;
              }}
            />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{COMPANY_INFO.brandName}</h1>
              <p className="text-gray-600 font-medium text-sm sm:text-base">{COMPANY_INFO.legalName}</p>
              <p className="text-sm text-gray-500 mt-1 max-w-sm">{COMPANY_INFO.registeredAddress}</p>
              <p className="text-sm text-gray-500 mt-1">GSTIN: {COMPANY_INFO.gstin}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600 space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
            <p><span className="font-medium text-gray-900">Order #:</span> {orderNumber}</p>
            <p>
              <span className="font-medium text-gray-900">Date:</span>{' '}
              {orderDate.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p>
              <span className="font-medium text-gray-900">Payment:</span>{' '}
              {order.paymentMethod === 'COD' ? 'Cash on Delivery' :
              order.paymentMethod === 'PayU' ? 'PayU (Online)' :
              order.paymentMethod === 'Manual' ? 'Manual Invoice' :
              order.paymentMethod === 'Razorpay' ? 'Razorpay (Online)' :
              'Online Payment'}
            </p>
            <p>
              <span className="font-medium text-gray-900">Status:</span>{' '}
              <span className="capitalize">{order.status || 'Confirmed'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Customer & Shipping — same row */}
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase">
            Customer Information
          </h3>
          <div className="space-y-1 text-sm text-gray-600 pt-1">
            {(shippingAddress.fullName || user?.name) && (
              <p className="font-medium text-gray-900">{shippingAddress.fullName || user?.name}</p>
            )}
            {user?.email && (
              <p><span className="font-medium">Email:</span> {user.email}</p>
            )}
            {shippingAddress.mobileNumber && (
              <p><span className="font-medium">Phone:</span> {shippingAddress.mobileNumber}</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase">
            Shipping Address
          </h3>
          <div className="text-sm text-gray-600 pt-1 space-y-0.5">
            {shippingAddress.address && <p>{shippingAddress.address}</p>}
            {shippingAddress.locality && <p>{shippingAddress.locality}</p>}
            <p>
              {[shippingAddress.city, shippingAddress.state].filter(Boolean).join(', ')}
              {shippingAddress.pincode ? ` - ${shippingAddress.pincode}` : ''}
            </p>
            {shippingAddress.landmark && (
              <p><span className="font-medium">Landmark:</span> {shippingAddress.landmark}</p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase">Order Items</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Item</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Quantity</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Price</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => {
                const product = item.product || {};
                const productTitle = product.title || product['SKU Name'] || product.name || 'Product';
                const productImage = getProductImage(product, 'image1');
                const itemPrice = item.price || product.price || product.mrp || 0;
                const quantity = item.quantity || 1;
                const itemTotal = itemPrice * quantity;

                return (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {!forExport && (
                          <img
                            src={productImage}
                            alt={productTitle}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                            onError={(e) => { e.target.src = getProductImage(null); }}
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{productTitle}</p>
                          {item.size && (
                            <p className="text-xs text-gray-500">Size: {item.size}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-gray-600">{quantity}</td>
                    <td className="text-right py-4 px-4 text-gray-600">{formatINR(itemPrice)}</td>
                    <td className="text-right py-4 px-4 font-semibold text-gray-900">{formatINR(itemTotal)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="border-t-2 border-gray-200 pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">{formatINR(subtotal)}</span>
            </div>
            {gst > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST ({gstRate}%):</span>
                <span className="text-gray-900">{formatINR(gst)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping:</span>
              <span className="text-gray-900">{shipping > 0 ? formatINR(shipping) : 'Free'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Total:</span>
              <span className="text-gray-900">{formatINR(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p className="mb-2">Thank you for your order!</p>
        <p>For any queries, contact us at {COMPANY_INFO.email} or {COMPANY_INFO.phone}</p>
      </div>

      {/* Print Button */}
      {onPrint && (
        <div className="mt-6 text-center">
          <button
            onClick={onPrint}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Print Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;


