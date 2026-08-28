import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import { FileCheck, Mail, Phone, MapPin } from "lucide-react";
import { COMPANY_INFO } from "../config/companyInfo";

export default function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-14 sm:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <FileCheck className="w-3.5 h-3.5 text-rose-400" />
            Legal Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Terms and Conditions
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to {COMPANY_INFO.brandName}. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-3">Last Updated: August 2025</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">

        {/* 1. Acceptance of Terms */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            Acceptance of Terms
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </div>

        {/* 2. Company Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            Company Information
          </h2>
          <p className="text-sm text-gray-600 mb-3">This website is operated by:</p>
          <div className="p-4 sm:p-5 rounded-xl bg-gray-50 border border-gray-100 text-sm sm:text-base space-y-2">
            <p className="font-bold text-gray-900">{COMPANY_INFO.legalName}</p>
            <p className="text-gray-700">{COMPANY_INFO.registeredAddress}</p>
            <p className="text-gray-700">GSTIN: {COMPANY_INFO.gstin}</p>
            <p className="text-gray-700">CIN: {COMPANY_INFO.cin}</p>
            <p className="text-gray-700">Website: <a href={COMPANY_INFO.website} className="text-rose-600 font-semibold hover:underline" target="_blank" rel="noopener noreferrer">{COMPANY_INFO.website}</a></p>
            <p className="text-gray-700">Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-rose-600 font-semibold hover:underline">{COMPANY_INFO.email}</a></p>
            <p className="text-gray-700">Phone: <a href={`tel:${COMPANY_INFO.phone}`} className="text-gray-900 font-semibold hover:underline">{COMPANY_INFO.phone}</a></p>
            <p className="text-gray-700">Contact Person: {COMPANY_INFO.contactPerson}</p>
          </div>
        </div>

        {/* 3. Use of Website */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            Use of Website
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
            You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others. Prohibited behavior includes:
          </p>
          <ul className="space-y-2 text-sm sm:text-base text-gray-700 list-disc list-inside leading-relaxed">
            <li>Harassing or causing distress to any person</li>
            <li>Transmitting obscene or offensive content</li>
            <li>Attempting to gain unauthorized access to our website or systems</li>
            <li>Using automated systems or software to extract data from our website</li>
          </ul>
        </div>

        {/* 4. Account Registration */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            Account Registration
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            To make purchases on our website, you may need to create an account. You agree to provide accurate information, maintain security of your password, and notify us of any unauthorized use.
          </p>
        </div>

        {/* 5. Pricing and Payment */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">5</span>
            Pricing and Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            All prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. Prices are subject to change without prior notice. Payment can be made through credit/debit cards, net banking, UPI, wallets, or Cash on Delivery (COD).
          </p>
        </div>

        {/* 6. Shipping and Delivery */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">6</span>
            Shipping and Delivery
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Please refer to our <Link to="/shipping" className="text-rose-600 font-semibold hover:underline">Shipping Information</Link> page for detailed shipping policies.
          </p>
        </div>

        {/* 7. Returns and Refunds */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">7</span>
            Returns and Refunds
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Please refer to our <Link to="/refund-cancellation" className="text-rose-600 font-semibold hover:underline">Refund Policy</Link> for detailed information about returns and refunds.
          </p>
        </div>

        {/* 8. Intellectual Property */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">8</span>
            Intellectual Property
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            All content on this website, including text, graphics, logos, images, and software, is the property of {COMPANY_INFO.legalName} and is protected by Indian and international copyright laws.
          </p>
        </div>

        {/* 9. Governing Law */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">9</span>
            Governing Law
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            These Terms shall be governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
          </p>
        </div>

        {/* 10. Contact Information */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">10</span>
            Contact Information
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6">
            If you have any questions about these Terms, please contact us:
          </p>
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
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 sm:col-span-1">
              <p className="text-gray-400 text-xs font-semibold uppercase mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Address
              </p>
              <p className="text-white leading-relaxed text-xs">
                {COMPANY_INFO.registeredAddress}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 border-t border-gray-700 pt-4 leading-relaxed">
            By using our website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>

      </div>

      <ScrollToTop />
    </div>
  );
}
