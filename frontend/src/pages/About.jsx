import React from 'react';
import ScrollToTop from '../components/ScrollToTop';
import { Sparkles, Target, Eye, ShieldCheck, HeartHandshake, Lightbulb, CheckCircle2, Building, Mail, Phone, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../config/companyInfo';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            About Us
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to {COMPANY_INFO.brandName}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Based in New Delhi, India, <strong className="text-white font-semibold">{COMPANY_INFO.legalName}</strong> is an e-commerce company dedicated to bringing you a curated range of premium apparel and fashion products.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        
        {/* Intro Highlight Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm">
          <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
            Our mission is to make premium apparel accessible and affordable for everyone. Whether it's everyday wear, seasonal collections, or trending fashion — we ensure variety, value, and quality under one roof.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Vision */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-5">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To become a leading name in the online apparel and fashion retail sector by offering diverse, high-quality clothing that enhances everyday style, while maintaining a strong presence in Delhi and across India.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-5">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              To deliver excellence in product availability, affordability, and service — ensuring every customer finds the right apparel with complete satisfaction.
            </p>
          </div>
        </div>

        {/* What We Stand For */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">What We Stand For</h2>
            <p className="text-gray-500 text-sm sm:text-base mt-2">Core pillars that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Customer-Centric</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                We prioritize customer satisfaction by helping people find the right apparel and fashion products for their needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Quality Assurance</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Every apparel product is carefully sourced from trusted manufacturers and quality brands.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Lightbulb className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Innovation</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Continuously expanding our portfolio with the latest fashion trends and styles.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Trust</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Building long-term relationships through integrity, transparency, and accountability.
              </p>
            </div>
          </div>
        </div>

        {/* Company Information */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-10 shadow-lg">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-700">
            <Building className="w-6 h-6 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-bold">Company Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-sm sm:text-base">
            <div>
              <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-1">Company Name</p>
              <p className="text-white font-semibold text-lg">{COMPANY_INFO.legalName}</p>
              
              <div className="mt-5">
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  Registered Address
                </p>
                <p className="text-gray-200 leading-relaxed">
                  {COMPANY_INFO.registeredAddress}
                </p>
              </div>

              <div className="mt-5 space-y-1">
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider">GSTIN</p>
                <p className="text-gray-200">{COMPANY_INFO.gstin}</p>
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mt-3">CIN</p>
                <p className="text-gray-200">{COMPANY_INFO.cin}</p>
              </div>
            </div>

            <div className="space-y-4 md:border-l md:border-gray-700 md:pl-8">
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-1 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                  Email
                </p>
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-rose-300 hover:text-rose-200 underline font-medium">
                  {COMPANY_INFO.email}
                </a>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                  Mobile
                </p>
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-white hover:text-rose-200 font-medium">
                  {COMPANY_INFO.phone}
                </a>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-1">Contact Person</p>
                <p className="text-white font-medium">{COMPANY_INFO.contactPerson}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold tracking-wider mb-1">Website</p>
                <a href={COMPANY_INFO.website} className="text-rose-300 hover:text-rose-200 underline font-medium" target="_blank" rel="noopener noreferrer">
                  {COMPANY_INFO.website}
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
      <ScrollToTop />
    </div>
  );
};

export default About;