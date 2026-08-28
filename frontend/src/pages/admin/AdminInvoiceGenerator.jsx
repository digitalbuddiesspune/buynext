import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FiUser,
  FiSearch,
  FiPlus,
  FiTrash2,
  FiFileText,
  FiShoppingCart,
  FiMapPin,
  FiMail,
  FiPhone,
  FiRefreshCw,
  FiPrinter,
  FiDownload,
  FiCalendar,
} from 'react-icons/fi';
import { api } from '../../utils/api';
import Invoice from '../../components/Invoice';
import ScrollToTop from '../../components/ScrollToTop';
import { categoryTree } from '../../data/categoryTree';
import { downloadInvoicePdf } from '../../utils/downloadInvoicePdf';
import {
  buildAdminInvoicePayload,
  GST_RATE,
  FREE_SHIPPING_THRESHOLD,
  DEFAULT_SHIPPING_CHARGE,
} from '../../utils/buildAdminInvoice';

const parsePrice = (product) => {
  const parsedMrp = Number(String(product?.MRP || '').replace(/[^0-9.]/g, '')) || 0;
  const mrp = product?.price ?? product?.mrp ?? parsedMrp;
  const discount = Number(product?.discountPercent || 0);
  if (product?.price && product.price > 0) return product.price;
  if (mrp > 0 && discount > 0) return Math.round(mrp * (1 - discount / 100));
  return mrp;
};

const getProductTitle = (p) => p?.title || p?.['SKU Name'] || p?.name || 'Product';

const todayDateInputValue = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const AdminInvoiceGenerator = () => {
  const [addresses, setAddresses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const [lineItems, setLineItems] = useState([]);
  const [shippingOverride, setShippingOverride] = useState(null);
  const [includeGst, setIncludeGst] = useState(true);
  const [invoiceDate, setInvoiceDate] = useState(todayDateInputValue);
  const [invoiceData, setInvoiceData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [exportKey, setExportKey] = useState(0);
  const [exportAction, setExportAction] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [addrData, productData] = await Promise.all([
          api.admin.listAddresses(),
          api.admin.listProducts(),
        ]);
        setAddresses(Array.isArray(addrData) ? addrData : []);
        setProducts(Array.isArray(productData) ? productData : []);
      } catch (e) {
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const customers = useMemo(() => {
    const map = new Map();
    addresses.forEach((addr) => {
      const user = addr.userId;
      const uid = user?._id || user?.id || user;
      if (!uid) return;
      const key = String(uid);
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: user?.name || addr.fullName || 'Customer',
          email: user?.email || '',
          phone: addr.mobileNumber || addr.phoneNumber || '',
          address: addr,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      (a.name || '').localeCompare(b.name || '')
    );
  }, [addresses]);

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }, [customers, customerSearch]);

  const subcategories = useMemo(() => {
    const main = categoryTree.find((c) => c.name === mainCategory);
    return main?.subcategories || [];
  }, [mainCategory]);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (mainCategory) {
      list = list.filter((p) => {
        const cat = (p.category || p.taxonomy?.mainCategory || '').toLowerCase();
        return cat.includes(mainCategory.toLowerCase()) || mainCategory.toLowerCase().includes(cat);
      });
    }
    if (subCategory) {
      list = list.filter((p) => {
        const sub = (p.subcategory || p.taxonomy?.subCategory || p.category || '').toLowerCase();
        return sub.includes(subCategory.toLowerCase()) || subCategory.toLowerCase().includes(sub);
      });
    }
    const q = productSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => getProductTitle(p).toLowerCase().includes(q));
    }
    return list.slice(0, 50);
  }, [products, mainCategory, subCategory, productSearch]);

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [lineItems]
  );

  const gst = includeGst ? Math.round(subtotal * (GST_RATE / 100)) : 0;
  const autoShipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_CHARGE;
  const shipping = shippingOverride !== null ? Number(shippingOverride) : autoShipping;
  const total = subtotal + gst + shipping;

  const addedProductIds = useMemo(
    () => new Set(lineItems.map((i) => String(i.productId))),
    [lineItems]
  );

  const addProduct = (product) => {
    if (addedProductIds.has(String(product._id))) return;

    const price = parsePrice(product);
    setLineItems((items) => [
      ...items,
      {
        productId: product._id,
        product,
        quantity: 1,
        price,
      },
    ]);
  };

  const updateQuantity = (productId, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setLineItems((items) =>
      items.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );
  };

  const removeLineItem = (productId) => {
    setLineItems((items) => items.filter((i) => i.productId !== productId));
  };

  const getInvoicePayload = () =>
    buildAdminInvoicePayload({
      selectedCustomer,
      lineItems,
      subtotal,
      gst,
      shipping,
      total,
      invoiceDate,
    });

  const queueExport = (action, payload) => {
    setInvoiceData(payload);
    setExportAction(action);
    setExportKey((k) => k + 1);
  };

  const handlePrint = () => {
    const result = getInvoicePayload();
    if (result.error) {
      alert(result.error);
      return;
    }
    queueExport('print', result.payload);
  };

  const handleDownload = () => {
    const result = getInvoicePayload();
    if (result.error) {
      alert(result.error);
      return;
    }
    queueExport('download', result.payload);
  };

  useEffect(() => {
    if (!exportAction || !invoiceData || exportKey === 0) return;

    let cancelled = false;

    const run = async () => {
      await new Promise((r) => setTimeout(r, 1000));
      if (cancelled || !invoiceRef.current) return;

      if (exportAction === 'print') {
        window.print();
        return;
      }

      if (exportAction === 'download') {
        setDownloading(true);
        try {
          await downloadInvoicePdf(
            invoiceRef.current,
            `Invoice-${invoiceData.invoiceNumber}.pdf`
          );
        } catch (err) {
          console.error('[Invoice PDF]', err);
          alert(`Failed to download PDF: ${err.message || 'Unknown error'}`);
        } finally {
          if (!cancelled) setDownloading(false);
        }
      }
    };

    run().finally(() => {
      if (!cancelled) setExportAction(null);
    });

    return () => {
      cancelled = true;
    };
  }, [exportKey, exportAction, invoiceData]);

  const canSubmit = selectedCustomer && lineItems.length > 0;

  const resetForm = () => {
    setSelectedCustomer(null);
    setCustomerSearch('');
    setLineItems([]);
    setMainCategory('');
    setSubCategory('');
    setProductSearch('');
    setShippingOverride(null);
    setInvoiceDate(todayDateInputValue());
  };

  const formatINR = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiFileText className="text-pink-600" />
            Invoice Generator
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Select customer, add products, and generate a printable invoice
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold text-sm"
        >
          <FiRefreshCw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
          {/* Customer */}
          <section className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FiUser className="w-5 h-5" />
                1. Select Customer
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-sm"
                />
              </div>

              <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-xl divide-y">
                {filteredCustomers.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">No customers found</p>
                ) : (
                  filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCustomer(c)}
                      className={`w-full text-left p-3 hover:bg-pink-50 transition-colors ${
                        selectedCustomer?.id === c.id ? 'bg-pink-50 border-l-4 border-pink-600' : ''
                      }`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.email || 'No email'}</p>
                      <p className="text-xs text-gray-500">{c.phone || 'No phone'}</p>
                    </button>
                  ))
                )}
              </div>

              {selectedCustomer && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm space-y-2">
                  <p className="font-bold text-gray-900">Customer Details</p>
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiUser className="w-4 h-4 text-pink-600 shrink-0" />
                    {selectedCustomer.name}
                  </p>
                  {selectedCustomer.email && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <FiMail className="w-4 h-4 text-pink-600 shrink-0" />
                      {selectedCustomer.email}
                    </p>
                  )}
                  {selectedCustomer.phone && (
                    <p className="flex items-center gap-2 text-gray-700">
                      <FiPhone className="w-4 h-4 text-pink-600 shrink-0" />
                      {selectedCustomer.phone}
                    </p>
                  )}
                  {selectedCustomer.address && (
                    <div className="pt-2 border-t border-gray-200">
                      <p className="flex items-start gap-2 text-gray-700">
                        <FiMapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                        <span>
                          {[
                            selectedCustomer.address.address || selectedCustomer.address.addressLine1,
                            selectedCustomer.address.locality,
                            selectedCustomer.address.city,
                            selectedCustomer.address.state,
                            selectedCustomer.address.pincode,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Products */}
          <section className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FiShoppingCart className="w-5 h-5" />
                2. Add Products
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={mainCategory}
                  onChange={(e) => {
                    setMainCategory(e.target.value);
                    setSubCategory('');
                  }}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:outline-none"
                >
                  <option value="">All categories</option>
                  {categoryTree.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  disabled={!mainCategory}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-pink-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="">All subcategories</option>
                  {subcategories.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none text-sm"
                />
              </div>

              <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-xl divide-y">
                {filteredProducts.length === 0 ? (
                  <p className="p-4 text-sm text-gray-500 text-center">No products found</p>
                ) : (
                  filteredProducts.map((p) => {
                    const isAdded = addedProductIds.has(String(p._id));
                    return (
                    <div
                      key={p._id}
                      className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {getProductTitle(p)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatINR(parsePrice(p))}
                          {p.subcategory || p.category ? ` · ${p.subcategory || p.category}` : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => addProduct(p)}
                        disabled={isAdded}
                        className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          isAdded
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        <FiPlus className="w-3.5 h-3.5" />
                        {isAdded ? 'Added' : 'Add'}
                      </button>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>

          {/* Line items & totals */}
          <section className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
              <h3 className="font-bold flex items-center gap-2">
                <FiFileText className="w-5 h-5" />
                3. Invoice Summary
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {lineItems.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {lineItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getProductTitle(item.product)}
                        </p>
                        <p className="text-xs text-gray-500">{formatINR(item.price)} each</p>
                      </div>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, e.target.value)}
                        className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center"
                      />
                      <p className="text-sm font-semibold w-20 text-right">
                        {formatINR(item.price * item.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.productId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 shrink-0 flex items-center gap-1.5">
                    <FiCalendar className="w-4 h-4 text-pink-600" />
                    Invoice date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-pink-500 focus:outline-none"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={includeGst}
                    onChange={(e) => setIncludeGst(e.target.checked)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  Include GST ({GST_RATE}%)
                </label>
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-700 shrink-0">Shipping (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={shippingOverride !== null ? shippingOverride : autoShipping}
                    onChange={(e) => setShippingOverride(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  />
                  <span className="text-xs text-gray-500">
                    Free above {formatINR(FREE_SHIPPING_THRESHOLD)}
                  </span>
                </div>
              </div>

              <div className="bg-gray-900 text-white rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {includeGst && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">GST ({GST_RATE}%)</span>
                    <span>{formatINR(gst)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-300">Shipping</span>
                  <span>{shipping > 0 ? formatINR(shipping) : 'Free'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-700 text-base font-bold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  disabled={!canSubmit}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiPrinter className="w-5 h-5" />
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canSubmit || downloading}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FiDownload className="w-5 h-5" />
                  {downloading ? 'Downloading…' : 'Download PDF'}
                </button>
              </div>
              <p className="text-xs text-center text-gray-500">
                Print or download directly from this page
              </p>
            </div>
          </section>
      </div>

      {/* Off-screen invoice for print & PDF download */}
      {invoiceData && (
        <div
          id="admin-invoice-print-root"
          ref={invoiceRef}
          className="admin-invoice-print-root bg-white"
        >
          <Invoice
            order={invoiceData.order}
            user={invoiceData.user}
            totals={invoiceData.totals}
            invoiceNumber={invoiceData.invoiceNumber}
            forExport
          />
        </div>
      )}

      <style>{`
        .admin-invoice-print-root {
          position: fixed;
          top: 0;
          left: 0;
          width: 794px;
          opacity: 0;
          z-index: -1;
          pointer-events: none;
          overflow: hidden;
        }
        @media print {
          body * {
            visibility: hidden !important;
          }
          #admin-invoice-print-root,
          #admin-invoice-print-root * {
            visibility: visible !important;
          }
          #admin-invoice-print-root {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            opacity: 1 !important;
            z-index: 99999 !important;
            pointer-events: auto !important;
          }
        }
      `}</style>

      <ScrollToTop />
    </div>
  );
};

export default AdminInvoiceGenerator;
