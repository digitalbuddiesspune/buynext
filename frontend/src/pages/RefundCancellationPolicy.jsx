import React, { useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { RotateCcw, CheckCircle, Clock, Ban, Mail, Phone, AlertCircle, ShieldCheck, FileText } from "lucide-react";
import { COMPANY_INFO } from "../config/companyInfo";

export default function RefundCancellationPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-14 sm:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            Refund Policy
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Return &amp; Refund Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At {COMPANY_INFO.brandName}, we want you to be completely satisfied with your purchase. If you are not happy with your order, we offer a hassle-free return and refund process.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">

        {/* Return Eligibility */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Return Eligibility</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
            You can return products <strong className="text-gray-900">within 7 days of delivery</strong>, provided the following conditions are met:
          </p>
          <ul className="space-y-2.5 text-sm sm:text-base text-gray-600 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>The product is unused, unopened, and in its original condition.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>Original packaging is intact with all tags, labels, and accessories.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>Original invoice or proof of purchase is provided.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
              <span>The product is not damaged, defective, or tampered with.</span>
            </li>
            <li className="flex items-start gap-2.5 text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <span>Personal care items and consumables cannot be returned for hygiene reasons (unless defective).</span>
            </li>
          </ul>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Return Process</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">To initiate a return:</p>
          <ol className="space-y-3 text-sm sm:text-base text-gray-700 list-decimal list-inside leading-relaxed mb-6">
            <li>Log in to your account and go to <strong>"My Orders"</strong>.</li>
            <li>Select the order you want to return.</li>
            <li>Click on <strong>"Return"</strong> and select the reason for return.</li>
            <li>Our team will review your request and send you a <strong>Return Authorization (RA) number</strong>.</li>
            <li>Pack the product securely in its original packaging.</li>
            <li>Include the original invoice and RA number.</li>
          </ol>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-700">
            <strong>Alternative:</strong> You can also directly email us at <a href={`mailto:${COMPANY_INFO.email}`} className="text-rose-600 hover:underline font-semibold">{COMPANY_INFO.email}</a> or call <a href={`tel:${COMPANY_INFO.phone}`} className="text-gray-900 font-semibold hover:underline">{COMPANY_INFO.phone}</a>.
          </div>
        </div>

        {/* Refund Process & Cancellation Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Refund Process */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Refund Process</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Once we receive and inspect your returned product, refunds will be credited within <strong className="text-gray-900">5-7 business days</strong> after receiving the returned item to your original payment method.
            </p>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Cancellation Policy</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 leading-relaxed mb-3">
              <li>
                <strong className="text-gray-900">Before Shipment:</strong> Full refund will be credited within 24-48 hours.
              </li>
              <li>
                <strong className="text-gray-900">After Shipment:</strong> You can still cancel, but return shipping charges may apply.
              </li>
            </ul>
            <p className="text-xs sm:text-sm text-gray-500">
              To cancel, contact us at <a href={`mailto:${COMPANY_INFO.email}`} className="text-rose-600 font-semibold hover:underline">{COMPANY_INFO.email}</a>.
            </p>
          </div>
        </div>

        {/* Contact for Returns & Refunds */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact for Returns &amp; Refunds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" /> Email
              </p>
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-white hover:text-rose-300 break-all font-medium">
                {COMPANY_INFO.email}
              </a>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" /> Phone
              </p>
              <a href={`tel:${COMPANY_INFO.phone}`} className="text-white hover:text-rose-300 font-medium">
                {COMPANY_INFO.phone}
              </a>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-400" /> Business Hours
              </p>
              <p className="text-white font-medium">
                Mon to Sat: 9:00 AM – 6:00 PM IST
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 border-t border-gray-700 pt-4 leading-relaxed">
            <strong>Note:</strong> This refund policy is subject to change without prior notice. By making a purchase on our website, you agree to the terms of this refund policy.
          </p>
        </div>

      </div>

      <ScrollToTop />
    </div>
  );
}
