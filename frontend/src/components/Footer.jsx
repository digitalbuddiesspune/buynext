import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Truck, Shield, RotateCcw, HeadphonesIcon, MessageCircle, Clock, ChevronRight } from 'lucide-react';
import { api } from '../utils/api';
import brandLogo from '../assets/buynest.logo.jpeg';
import { COMPANY_INFO } from '../config/companyInfo';

const CONTACT_INFO = {
  email: COMPANY_INFO.email,
  phone: COMPANY_INFO.phone,
  address: COMPANY_INFO.registeredAddress,
  companyName: COMPANY_INFO.legalName,
  gstin: COMPANY_INFO.gstin,
  cin: COMPANY_INFO.cin,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerLogo, setFooterLogo] = useState({
    url: brandLogo,
    alt: 'BuyNest',
    width: 'auto',
    height: 'auto',
  });

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const logo = await api.getLogo('footer').catch(() => null);
      if (logo && logo.url) {
        setFooterLogo({ 
          url: logo.url, 
          alt: logo.alt || 'BuyNest',
          width: logo.width || 'auto',
          height: logo.height || 'auto',
        });
      }
    } catch (err) {
      console.error('Failed to load footer logo:', err);
    }
  };

  useEffect(() => {
    const handleLogoUpdate = (event) => {
      if (event.detail.type === 'footer') {
        loadLogo();
      }
    };
    window.addEventListener('logo:updated', handleLogoUpdate);
    return () => window.removeEventListener('logo:updated', handleLogoUpdate);
  }, []);

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All Products', path: '/products' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Special Offers', path: '/offers' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  const categories = [
    { name: 'Bath & Hand Wash', path: '/category/beauty-and-hygiene/bath-and-hand-wash' },
    { name: 'Feminine Hygiene', path: '/category/beauty-and-hygiene/feminine-hygiene' },
    { name: 'Fragrances & Deos', path: '/category/beauty-and-hygiene/fragrances-and-deos' },
    { name: 'Hair Care', path: '/category/beauty-and-hygiene/hair-care' },
    { name: 'Health & Medicine', path: '/category/beauty-and-hygiene/health-and-medicine' },
    { name: 'Makeup', path: '/category/beauty-and-hygiene/makeup' },
    { name: 'Oral Care', path: '/category/beauty-and-hygiene/oral-care' },
    { name: 'Skin Care', path: '/category/beauty-and-hygiene/skin-care' },
  ];

  const trustFeatures = [
    { icon: Truck, title: 'Free Shipping', description: 'On all orders above ₹500' },
    { icon: Shield, title: '100% Authentic', description: 'Genuine sourced products' },
    { icon: RotateCcw, title: 'Easy Returns', description: '7-day hassle-free return' },
    { icon: HeadphonesIcon, title: 'Dedicated Support', description: 'Mon - Sat: 9 AM - 6 PM' },
  ];

  // Extract phone number without +91 for WhatsApp link
  const whatsappNumber = CONTACT_INFO.phone.replace(/[\s+\-]/g, '').replace(/^91/, '');

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4" />,
      url: `https://wa.me/91${whatsappNumber}`,
      bgColor: 'hover:bg-emerald-500 hover:text-white',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-4 h-4" />,
      url: 'https://instagram.com',
      bgColor: 'hover:bg-pink-600 hover:text-white',
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      url: 'https://facebook.com',
      bgColor: 'hover:bg-blue-600 hover:text-white',
    },
  ];

  return (
    <footer className="w-full bg-white text-gray-800 border-t border-gray-200 mt-12">
      {/* Trust Features Strip */}
      <div className="w-full border-b border-gray-100 bg-gray-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {trustFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200/80 shadow-xs">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-tight">{feature.title}</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight mt-0.5 truncate">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand & About (Col span 4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <img 
                src={footerLogo.url || brandLogo}
                alt={footerLogo.alt || CONTACT_INFO.companyName}
                className="h-11 sm:h-12 w-auto max-w-[200px] object-contain"
                onError={(e) => {
                  e.target.src = brandLogo;
                }}
              />
            </Link>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm">
              <strong className="font-semibold text-gray-900">{COMPANY_INFO.legalName}</strong> — your trusted online destination for premium apparel and fashion. We deliver excellence in product availability, affordability, and service across India.
            </p>
            
            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">Connect With Us</p>
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center transition-all duration-200 ${social.bgColor}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links (Col span 2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-1 border-b border-gray-100">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-transform group-hover:translate-x-0.5" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-1 border-b border-gray-100">
              Categories
            </h4>
            <ul className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.path}
                    className="text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-transform group-hover:translate-x-0.5" />
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details (Col span 3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-1 border-b border-gray-100">
              Contact &amp; Support
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${CONTACT_INFO.phone}`} className="text-gray-900 font-semibold hover:text-rose-600 transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                  <p className="text-[11px] text-gray-500">Call / WhatsApp Support</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="text-gray-900 font-semibold hover:text-rose-600 break-all transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                  <p className="text-[11px] text-gray-500">24/7 Email Support</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  {CONTACT_INFO.address}
                </p>
              </div>

              <div className="flex items-start gap-2.5 pt-1 border-t border-gray-100">
                <Clock className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">
                  <strong className="text-gray-900 font-medium">Mon - Sat:</strong> 9:00 AM – 6:00 PM IST
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Policies Bar */}
      <div className="w-full bg-gray-50 border-t border-gray-200 py-3.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-gray-600">
          <Link to="/privacy" className="hover:text-gray-900 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/terms" className="hover:text-gray-900 transition-colors">
            Terms &amp; Conditions
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/shipping" className="hover:text-gray-900 transition-colors">
            Shipping Policy
          </Link>
          <span className="text-gray-300">•</span>
          <Link to="/refund-cancellation" className="hover:text-gray-900 transition-colors">
            Refund &amp; Cancellation Policy
          </Link>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="w-full bg-gray-900 text-gray-400 py-4 px-4 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-center sm:text-left">
          <p>
            © {currentYear} <strong className="text-white font-semibold">{CONTACT_INFO.companyName}</strong>. All Rights Reserved.
          </p>
          <p className="text-gray-500 text-center sm:text-right">
            GSTIN: {CONTACT_INFO.gstin} &nbsp;|&nbsp; CIN: {CONTACT_INFO.cin}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
