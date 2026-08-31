import React, { useState, useEffect } from 'react';
import { getProductImage } from '../utils/imagePlaceholder';
import { COMPANY_INFO } from '../config/companyInfo';
import brandLogo from '../assets/buynest.logo.jpeg';
import { api } from '../utils/api';
import { INVOICE_EXPORT_CSS } from '../utils/invoiceExportStyles';

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
  const orderNumber = order._id ? order._id.toString().slice(-8).toUpperCase() : 'N/A';
  const invoiceNumber = invoiceNumberOverride || `INV${orderNumber}`;

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

  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const paymentLabel =
    order.paymentMethod === 'COD' ? 'Cash on Delivery' :
    order.paymentMethod === 'Manual' ? 'Online' :
    order.paymentMethod === 'PayU' ? 'PayU (Online)' :
    order.paymentMethod === 'Razorpay' ? 'Razorpay (Online)' :
    order.paymentMethod === 'Online' ? 'Online' :
    'Online Payment';

  const statusLabel = (order.status || 'Confirmed').replace(/_/g, ' ');
  const placeOfSupply = 'New Delhi';

  const getItemTitle = (item) => {
    const product = item.product || {};
    return item.name || product.title || product['SKU Name'] || product.name || 'Product';
  };

  const customerName = shippingAddress.fullName || user?.name;
  const addressLines = [
    shippingAddress.address,
    shippingAddress.locality,
    [
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.pincode,
    ].filter(Boolean).join(', '),
  ].filter(Boolean);

  const invoiceDetailsRows = [
    ['Invoice No:', invoiceNumber],
    ['Order No:', orderNumber],
    ['Order Status:', statusLabel],
    ['Payment Mode:', paymentLabel],
    ['Place of Supply:', placeOfSupply],
    ['Invoice Date:', formattedDate],
    ['Payment Status:', order.paymentStatus || (order.paymentMethod === 'COD' ? 'Pending' : 'Paid')],
  ];

  const renderItemsTable = (withImages = false) => (
    <table className={forExport ? 'invoice-export-table' : 'w-full border border-gray-300 border-collapse'}>
      <thead>
        <tr className={forExport ? undefined : 'bg-white text-gray-900'}>
          <th className={forExport ? undefined : 'text-left py-1 px-2 text-xs font-semibold border border-gray-300 align-middle leading-tight'}>
            {forExport ? 'Sr No' : '#'}
          </th>
          <th className={forExport ? undefined : 'text-left py-1 px-2 text-xs font-semibold border border-gray-300 align-middle leading-tight'}>
            Item Name
          </th>
          <th className={forExport ? 'center' : 'text-center py-1 px-2 text-xs font-semibold border border-gray-300 align-middle leading-tight'}>
            Qty
          </th>
          <th className={forExport ? 'right' : 'text-right py-1 px-2 text-xs font-semibold border border-gray-300 align-middle leading-tight'}>
            Rate
          </th>
          <th className={forExport ? 'right' : 'text-right py-1 px-2 text-xs font-semibold border border-gray-300 align-middle leading-tight'}>
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {order.items?.map((item, index) => {
          const product = item.product || {};
          const productTitle = getItemTitle(item);
          const productImage = getProductImage(product, 'image1');
          const itemPrice = item.price || product.price || product.mrp || 0;
          const quantity = item.quantity || 1;
          const itemTotal = itemPrice * quantity;

          return (
            <tr key={index} className={forExport ? undefined : 'border-b border-gray-200'}>
              <td className={forExport ? 'center' : 'text-center py-1 px-2 text-xs text-gray-600 border border-gray-200 align-middle leading-tight'}>
                {index + 1}
              </td>
              <td className={forExport ? 'item-name' : 'py-1 px-2 text-xs border border-gray-200 align-middle leading-tight'}>
                {withImages && !forExport ? (
                  <div className="flex items-center gap-2 min-h-[28px]">
                    <img
                      src={productImage}
                      alt={productTitle}
                      className="w-8 h-8 object-cover rounded border border-gray-200 shrink-0"
                      onError={(e) => { e.target.src = getProductImage(null); }}
                    />
                    <div className="flex flex-col justify-center">
                      <p className="font-medium text-gray-900 leading-tight m-0">{productTitle}</p>
                      {item.size && <p className="text-[10px] text-gray-500 m-0 leading-tight">Size: {item.size}</p>}
                    </div>
                  </div>
                ) : (
                  <>
                    {productTitle}
                    {item.size ? ` (Size: ${item.size})` : ''}
                  </>
                )}
              </td>
              <td className={forExport ? 'center' : 'text-center py-1 px-2 text-xs text-gray-600 border border-gray-200 align-middle leading-tight'}>
                {quantity}
              </td>
              <td className={forExport ? 'right' : 'text-right py-1 px-2 text-xs text-gray-600 border border-gray-200 align-middle leading-tight'}>
                {formatINR(itemPrice)}
              </td>
              <td className={forExport ? 'right total-cell' : 'text-right py-1 px-2 text-xs font-semibold text-gray-900 border border-gray-200 align-middle leading-tight'}>
                {formatINR(itemTotal)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  const renderTotals = () => (
    <div className={forExport ? 'invoice-export-totals' : 'flex justify-end mt-2'}>
      <div className={forExport ? 'invoice-export-totals-box' : 'w-72 border border-gray-300'}>
        <div className={forExport ? 'invoice-export-totals-row' : 'flex items-center justify-between text-xs px-2.5 py-1.5 border-b border-gray-200'}>
          <span className={forExport ? undefined : 'text-gray-600'}>Sub Total:</span>
          <span className={forExport ? undefined : 'font-semibold text-gray-900'}>{formatINR(subtotal)}</span>
        </div>
        {gst > 0 && (
          <div className={forExport ? 'invoice-export-totals-row' : 'flex items-center justify-between text-xs px-2.5 py-1.5 border-b border-gray-200'}>
            <span className={forExport ? undefined : 'text-gray-600'}>GST ({gstRate}%):</span>
            <span className={forExport ? undefined : 'font-semibold text-gray-900'}>{formatINR(gst)}</span>
          </div>
        )}
        <div className={forExport ? 'invoice-export-totals-row' : 'flex items-center justify-between text-xs px-2.5 py-1.5 border-b border-gray-200'}>
          <span className={forExport ? undefined : 'text-gray-600'}>Shipping Charges:</span>
          <span className={forExport ? undefined : 'font-semibold text-gray-900'}>
            {shipping > 0 ? formatINR(shipping) : 'Free'}
          </span>
        </div>
        <div className={forExport ? 'invoice-export-totals-grand' : 'flex items-center justify-between text-sm font-bold px-2.5 py-1.5 text-gray-900 border-t border-gray-200'}>
          <span>Total Amount:</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>
    </div>
  );

  const renderBillTo = () => (
    <>
      {customerName && (
        <p className={forExport ? 'name' : 'font-bold text-gray-900 text-sm mb-1'}>{customerName}</p>
      )}
      {user?.email && <p><strong>Email:</strong> {user.email}</p>}
      {shippingAddress.mobileNumber && <p><strong>Phone:</strong> {shippingAddress.mobileNumber}</p>}
      {addressLines.length > 0 && (
        <p><strong>Address:</strong> {addressLines.join(', ')}</p>
      )}
      {shippingAddress.landmark && (
        <p><strong>Landmark:</strong> {shippingAddress.landmark}</p>
      )}
    </>
  );

  if (forExport) {
    return (
      <div className="invoice-export">
        <style>{INVOICE_EXPORT_CSS}</style>

        <div className="invoice-export-sheet">
        <div className="invoice-export-top">
          <img src={logoUrl} alt={COMPANY_INFO.brandName} className="invoice-export-logo" />
          <h2 className="invoice-export-doc-title">INVOICE</h2>
        </div>

        <p className="invoice-export-company">
          {COMPANY_INFO.legalName}<br />
          {COMPANY_INFO.registeredAddress}<br />
          {COMPANY_INFO.email} · GSTIN: {COMPANY_INFO.gstin}
        </p>

        <div className="invoice-export-block">
          <h3 className="invoice-export-block-title">Invoice Details</h3>
          <table className="invoice-export-details-table">
            <tbody>
              {invoiceDetailsRows.map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="invoice-export-block">
          <h3 className="invoice-export-block-title">Bill To</h3>
          <div className="invoice-export-body-text">{renderBillTo()}</div>
        </div>

        <div className="invoice-export-block">
          <h3 className="invoice-export-block-title">Order Details</h3>
          {renderItemsTable()}
        </div>

        {renderTotals()}

        <div className="invoice-export-footer">
          <p>Thank you for your order!</p>
          <p>For any queries, contact us at {COMPANY_INFO.email} or {COMPANY_INFO.phone}</p>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8">
      <div className="text-center mb-4">
        <img
          src={logoUrl}
          alt={COMPANY_INFO.brandName}
          className="h-20 w-auto max-w-[220px] object-contain mx-auto mb-3"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = brandLogo;
          }}
        />
        <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{COMPANY_INFO.legalName}</p>
        <p className="text-xs text-gray-500 mt-1 max-w-lg mx-auto leading-snug">{COMPANY_INFO.registeredAddress}</p>
        <p className="text-xs text-gray-500 mt-1">
          Email: {COMPANY_INFO.email} | GSTIN: {COMPANY_INFO.gstin}
        </p>
      </div>

      <div className="border-y-2 border-gray-900 my-4 py-2.5 flex items-center justify-center">
        <h2 className="text-2xl font-bold tracking-widest text-gray-900 leading-none">INVOICE</h2>
      </div>

      <div className="mb-5 border border-gray-300">
        <h3 className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1.5">Invoice Details</h3>
        <table className="w-full text-xs">
          <tbody>
            {invoiceDetailsRows.map(([label, value]) => (
              <tr key={label} className="border-b border-gray-200 last:border-b-0">
                <td className="w-[38%] px-2 py-1 bg-gray-50 text-gray-600 font-medium align-middle leading-tight">{label}</td>
                <td className="px-2 py-1 font-semibold text-gray-900 align-middle leading-tight">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-5 border border-gray-300">
        <h3 className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1.5">Bill To</h3>
        <div className="px-2.5 py-2 text-xs text-gray-600 space-y-0.5">{renderBillTo()}</div>
      </div>

      <div className="mb-4 border border-gray-300 overflow-x-auto">
        <h3 className="bg-gray-700 text-white text-xs font-bold px-2.5 py-1.5">Order Details</h3>
        {renderItemsTable(true)}
      </div>

      {renderTotals()}

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p className="mb-2">Thank you for your order!</p>
        <p>For any queries, contact us at {COMPANY_INFO.email} or {COMPANY_INFO.phone}</p>
      </div>

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
