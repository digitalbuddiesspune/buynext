import { GST_RATE } from './invoiceConstants';

export { GST_RATE, FREE_SHIPPING_THRESHOLD, DEFAULT_SHIPPING_CHARGE } from './invoiceConstants';

export function buildAdminInvoicePayload({
  customer,
  shippingAddress,
  lineItems,
  subtotal,
  gst,
  shipping,
  total,
  invoiceDate,
}) {
  if (!customer?.fullName?.trim()) {
    return { error: 'Please enter customer name' };
  }
  if (!lineItems?.length) {
    return { error: 'Please add at least one product' };
  }

  const normalizedAddress = {
    fullName: customer.fullName.trim(),
    mobileNumber: customer.phone?.trim() || '',
    pincode: shippingAddress.pincode?.trim() || '',
    locality: shippingAddress.locality?.trim() || '',
    address: shippingAddress.address?.trim() || '',
    city: shippingAddress.city?.trim() || '',
    state: shippingAddress.state?.trim() || '',
    landmark: shippingAddress.landmark?.trim() || '',
  };

  const invoiceId = `INV${Date.now().toString().slice(-8)}`;
  const createdAt = invoiceDate
    ? new Date(`${invoiceDate}T12:00:00`).toISOString()
    : new Date().toISOString();

  const orderPayload = {
    _id: invoiceId,
    createdAt,
    paymentMethod: 'Online',
    paymentStatus: 'Paid',
    status: 'confirmed',
    amount: total,
    items: lineItems.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
    shippingAddress: normalizedAddress,
  };

  return {
    payload: {
      order: orderPayload,
      user: {
        name: customer.fullName.trim(),
        email: customer.email?.trim() || '',
      },
      invoiceNumber: invoiceId,
      totals: {
        subtotal,
        gst,
        gstRate: GST_RATE,
        shipping,
        total,
      },
    },
  };
}
