import React, { useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import { Shield, Mail, Phone, MapPin } from "lucide-react";
import { COMPANY_INFO } from "../config/companyInfo";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-14 sm:py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <Shield className="w-3.5 h-3.5 text-rose-400" />
            Privacy Protection
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            At <strong className="text-white font-semibold">{COMPANY_INFO.legalName}</strong> ("we," "us," or "our"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-3">Last Updated: August 2025</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">

        {/* Consent Note */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            By using our website, you consent to the data practices described in this policy. If you do not agree with the practices described in this policy, please do not use our website.
          </p>
        </div>

        {/* 1. Information We Collect */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            Information We Collect
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            We collect information that you provide directly to us and information that is automatically collected when you use our website.
          </p>

          <div className="pt-2 space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">1.1 Information You Provide</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">We collect information that you provide when you:</p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Create an Account:</strong> Name, email address, phone number, password</li>
                <li><strong className="text-gray-900">Make a Purchase:</strong> Billing address, shipping address, payment information, order details</li>
                <li><strong className="text-gray-900">Contact Us:</strong> Name, email address, phone number, message content</li>
                <li><strong className="text-gray-900">Subscribe to Newsletter:</strong> Email address</li>
                <li><strong className="text-gray-900">Participate in Surveys or Promotions:</strong> Information you choose to provide</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-2">1.2 Automatically Collected Information</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2">When you visit our website, we automatically collect certain information:</p>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 list-disc list-inside">
                <li><strong className="text-gray-900">Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong className="text-gray-900">Usage Information:</strong> Pages visited, time spent on pages, click patterns, search queries</li>
                <li><strong className="text-gray-900">Location Information:</strong> General location based on IP address</li>
                <li><strong className="text-gray-900">Cookies and Tracking Technologies:</strong> We use cookies and similar technologies to enhance your experience</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. How We Use Your Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            How We Use Your Information
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3">We use the information we collect for various purposes:</p>
          <ul className="space-y-2 text-xs sm:text-sm text-gray-700 list-disc list-inside leading-relaxed">
            <li><strong className="text-gray-900">Order Processing:</strong> To process and fulfill your orders, send order confirmations, and provide customer support</li>
            <li><strong className="text-gray-900">Account Management:</strong> To create and manage your account, authenticate your identity</li>
            <li><strong className="text-gray-900">Communication:</strong> To send you updates about your orders, respond to your inquiries, and send marketing communications (with your consent)</li>
            <li><strong className="text-gray-900">Improvement of Services:</strong> To analyze website usage, improve our products and services, and enhance user experience</li>
            <li><strong className="text-gray-900">Security:</strong> To detect, prevent, and address fraud, security issues, and other harmful activities</li>
            <li><strong className="text-gray-900">Legal Compliance:</strong> To comply with legal obligations and enforce our terms and conditions</li>
            <li><strong className="text-gray-900">Personalization:</strong> To personalize your shopping experience and show you relevant products</li>
          </ul>
        </div>

        {/* 3. Information Sharing and Disclosure */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            Information Sharing and Disclosure
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            We do not sell your personal information. We may share your information in the following circumstances:
          </p>
          <div className="space-y-3 pt-2 text-xs sm:text-sm text-gray-700">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-gray-900 mb-1">3.1 Service Providers</p>
              <p className="text-gray-600 mb-2">We may share information with third-party service providers who perform services on our behalf:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Payment processors for transaction processing</li>
                <li>Shipping and logistics companies for order delivery</li>
                <li>Email service providers for sending communications</li>
                <li>Analytics providers for website analysis</li>
                <li>Customer support service providers</li>
              </ul>
              <p className="text-xs text-gray-500 mt-2">These service providers are contractually obligated to protect your information and use it only for the purposes we specify.</p>
            </div>
            <p><strong className="text-gray-900">3.2 Legal Requirements:</strong> We may disclose your information if required by law or in response to valid requests by public authorities.</p>
            <p><strong className="text-gray-900">3.3 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
            <p><strong className="text-gray-900">3.4 With Your Consent:</strong> We may share your information with third parties when you explicitly consent to such sharing.</p>
          </div>
        </div>

        {/* 4. Cookies and Tracking Technologies */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">4</span>
            Cookies and Tracking Technologies
          </h2>
          <p className="text-sm text-gray-600 mb-2">We use cookies and similar tracking technologies to:</p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 mb-3">
            <li>Remember your preferences and settings</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and advertisements</li>
            <li>Improve website functionality and user experience</li>
          </ul>
          <p className="text-xs sm:text-sm text-gray-500">
            You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
          </p>
        </div>

        {/* 5. Data Security */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">5</span>
            Data Security
          </h2>
          <p className="text-sm text-gray-600 mb-2">We implement appropriate technical and organizational security measures to protect your personal information:</p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 mb-3">
            <li>SSL encryption for data transmission</li>
            <li>Secure servers and databases</li>
            <li>Access controls and authentication</li>
            <li>Regular security assessments and updates</li>
            <li>Employee training on data protection</li>
          </ul>
          <p className="text-xs text-gray-500">
            However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
          </p>
        </div>

        {/* 6. Data Retention */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">6</span>
            Data Retention
          </h2>
          <p className="text-sm text-gray-600 mb-2">We retain your personal information for as long as necessary to:</p>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 mb-3">
            <li>Fulfill the purposes for which it was collected</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes and enforce agreements</li>
            <li>Maintain business records as required by law</li>
          </ul>
          <p className="text-xs text-gray-500">
            When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </div>

        {/* 7. Your Rights and Choices */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">7</span>
            Your Rights and Choices
          </h2>
          <p className="text-sm text-gray-600 mb-2">You have certain rights regarding your personal information:</p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4">
            <li><strong className="text-gray-900">Access:</strong> You can request access to your personal information</li>
            <li><strong className="text-gray-900">Correction:</strong> You can update or correct your information through your account settings</li>
            <li><strong className="text-gray-900">Deletion:</strong> You can request deletion of your account and personal information</li>
            <li><strong className="text-gray-900">Opt-Out:</strong> You can opt-out of marketing communications by clicking unsubscribe links or contacting us</li>
            <li><strong className="text-gray-900">Data Portability:</strong> You can request a copy of your data in a portable format</li>
            <li><strong className="text-gray-900">Withdraw Consent:</strong> You can withdraw consent for data processing where applicable</li>
          </ul>
          <p className="text-xs sm:text-sm text-gray-600">
            To exercise these rights, please contact us at <a href={`mailto:${COMPANY_INFO.email}`} className="text-rose-600 font-semibold hover:underline">{COMPANY_INFO.email}</a>.
          </p>
        </div>

        {/* 8 to 11 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* 8. Children's Privacy */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">8</span>
              Children's Privacy
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our website is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately, and we will delete such information.
            </p>
          </div>

          {/* 9. Third-Party Links */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">9</span>
              Third-Party Links
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </div>

          {/* 10. Changes to This Privacy Policy */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">10</span>
              Changes to This Policy
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy, sending an email notification, or updating the date. Continued use constitutes acceptance.
            </p>
          </div>

          {/* 11. International Data Transfers */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-bold shrink-0">11</span>
              International Transfers
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than India. We ensure that appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </div>
        </div>

        {/* 12. Contact Us */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-white/20 text-white flex items-center justify-center text-xs font-bold shrink-0">12</span>
            Contact Us
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6">
            If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
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
            By using our website, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein. If you do not agree with this Privacy Policy, please do not use our website or services.
          </p>
        </div>

      </div>

      <ScrollToTop />
    </div>
  );
}
