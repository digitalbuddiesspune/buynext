import React, { useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Truck, PackageCheck, Clock, ShieldAlert, Mail, Phone, CheckCircle, AlertTriangle } from "lucide-react";

export default function ShippingPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-14 sm:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <Truck className="w-3.5 h-3.5 text-rose-400" />
            Shipping Information
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Shipping Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At Barringer Pharma, we understand the importance of timely delivery. We have partnered with reliable logistics providers to ensure your cosmetics and beauty products reach you safely and on time.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">

        {/* Free Shipping Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Free Shipping</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base">
            We offer <strong className="text-gray-900">FREE SHIPPING on all orders above ₹500</strong>. For orders below ₹500, a nominal shipping charge may apply based on your location and order weight.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Free shipping is available to all major cities and towns across India. For remote locations, additional charges may apply, which will be clearly displayed during checkout.
          </p>
        </div>

        {/* Delivery Timeline */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Delivery Timeline</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Standard Delivery</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">3-7 business days for most locations</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Express Delivery</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">1-3 business days (select locations, additional charges apply)</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Metro Cities</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">2-5 business days (Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune)</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Tier 2 & 3 Cities</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">5-7 business days</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 sm:col-span-2">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Remote Areas</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">7-10 business days (subject to courier service availability)</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Note:</strong> Delivery timelines are estimates and may vary due to factors beyond our control such as weather conditions, natural disasters, or courier service delays.</span>
          </div>
        </div>

        {/* Shipping Methods & Order Processing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Shipping Methods */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Shipping Methods</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">We use trusted courier partners including:</p>
            <ul className="space-y-2 text-sm text-gray-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Blue Dart
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> DTDC
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Delhivery
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> India Post
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> Other regional courier services
              </li>
            </ul>
          </div>

          {/* Order Processing */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                <PackageCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Order Processing</h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></span>
                <span>Orders placed before 2:00 PM on business days are processed the same day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></span>
                <span>Orders placed after 2:00 PM are processed on the next business day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></span>
                <span>Orders placed on weekends or holidays are processed on the next business day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-2 shrink-0"></span>
                <span>Once processed, orders are dispatched within 24-48 hours.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Damaged or Lost Shipments */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Damaged or Lost Shipments</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
            In the rare event that your order is damaged during transit or lost:
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-gray-600 leading-relaxed list-disc list-inside mb-4">
            <li>Please contact us immediately at <a href="mailto:pharmabarringer@gmail.com" className="text-rose-600 hover:underline font-semibold">pharmabarringer@gmail.com</a> or call <a href="tel:8745015901" className="text-gray-900 font-semibold hover:underline">8745015901</a>.</li>
            <li>Provide your order number and photos of the damaged package (if applicable).</li>
            <li>We will investigate and resolve the issue promptly.</li>
            <li>You may be eligible for a replacement or full refund as per our refund policy.</li>
          </ul>
        </div>

        {/* Contact for Shipping Queries */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Contact for Shipping Queries</h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6">
            For any shipping-related queries or concerns, please contact us:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" /> Email
              </p>
              <a href="mailto:pharmabarringer@gmail.com" className="text-white hover:text-rose-300 break-all font-medium">
                pharmabarringer@gmail.com
              </a>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-rose-400" /> Phone
              </p>
              <a href="tel:8745015901" className="text-white hover:text-rose-300 font-medium">
                8745015901
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
        </div>

      </div>

      <ScrollToTop />
    </div>
  );
}
