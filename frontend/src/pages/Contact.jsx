import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { Mail, Phone, MapPin, Clock, MessageSquare, Building2 } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We'd love to hear from you! Get in touch with us through any of the following channels:
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Company Title Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-rose-50 text-rose-600 mb-3">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            BARRINGER PHARMA PRIVATE LIMITED
          </h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Distributor and retailer of cosmetics, beauty, and personal care products.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-10">
          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-sm text-gray-500 mb-4">For inquiries, orders, and customer support:</p>
            </div>
            <a
              href="mailto:pharmabarringer@gmail.com"
              className="inline-flex items-center text-base sm:text-lg font-semibold text-rose-600 hover:text-rose-700 break-all transition-colors"
            >
              pharmabarringer@gmail.com
            </a>
          </div>

          {/* Phone / WhatsApp Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Phone / WhatsApp</h3>
              <p className="text-sm text-gray-500 mb-4">Call or message us directly for assistance:</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:8745015901"
                className="inline-flex items-center text-base sm:text-lg font-semibold text-gray-900 hover:text-rose-600 transition-colors"
              >
                8745015901
              </a>
              <a
                href="https://wa.me/918745015901"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-full transition-colors inline-flex items-center gap-1 shadow-sm"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong className="text-gray-900 font-semibold block mb-1">BARRINGER PHARMA PRIVATE LIMITED</strong>
              Office No 110, Vishal Tower<br />
              District Centre, Janakpuri<br />
              New Delhi, Delhi - 110058<br />
              India
            </p>
          </div>

          {/* Business Hours Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Business Hours</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">Monday to Saturday:</p>
              <p className="text-base font-semibold text-rose-600">9:00 AM – 6:00 PM IST</p>
              <p className="text-xs text-gray-500 pt-2">Sunday: Closed</p>
            </div>
          </div>
        </div>

      </div>
      <ScrollToTop />
    </div>
  );
};

export default Contact;
