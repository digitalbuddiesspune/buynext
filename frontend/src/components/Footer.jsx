import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Truck, Shield, RotateCcw, HeadphonesIcon, MessageCircle } from 'lucide-react';
import { api } from '../utils/api';
import brandLogo from '../assets/buynest.logo.jpeg';

/** Static footer contact — not loaded from admin API */
const CONTACT_INFO = {
  email: 'support@doormart.com',
  phone: '+91 98765 43210',
  address: 'DoorMart Headquarters, 123 Playful Lane, Mumbai, India 400001',
  companyName: 'DoorMart',
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
    // Listen for logo updates
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
    { name: 'Shop', path: '/products' },
    { name: 'New Arrivals', path: '/new-arrivals' },
    { name: 'Offers', path: '/offers' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Beauty & Hygiene', path: '/category/beauty-and-hygiene' },
    { name: 'Beverages', path: '/category/beverages' },
    { name: 'Cleaning & Household', path: '/category/cleaning-and-household' },
    { name: 'Snacks & Branded Foods', path: '/category/snacks-and-branded-foods' },
  ];

  const trustFeatures = [
    { icon: Truck, title: 'Free Shipping', description: 'On orders above ₹999' },
    { icon: Shield, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: RotateCcw, title: 'Easy Returns', description: '7-day return policy' },
    { icon: HeadphonesIcon, title: '24/7 Support', description: 'Dedicated customer care' },
  ];

  // Extract phone number without +91 for WhatsApp link
  const whatsappNumber = CONTACT_INFO.phone.replace(/[\s+\-]/g, '').replace(/^91/, '');

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'https://instagram.com/doormart',
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: 'https://facebook.com/doormart',
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
      url: `https://wa.me/${whatsappNumber}`,
    },
  ];

  return (
    <>
      <style>{`
      .footer-link {
          color: #111827;
          transition: color 0.3s ease;
        }
        .footer-link:hover {
          color: #000000;
        }
      `}</style>
      <footer className="w-full bg-white text-black">
      {/* Trust Strip */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3 lg:gap-4">
          {trustFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2 bg-white rounded-lg p-1.5 sm:p-2 border border-gray-200">
                <div className="flex-shrink-0 w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gray-100">
                  <IconComponent className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <h6 className="font-semibold text-[11px] sm:text-xs md:text-sm leading-tight text-black">{feature.title}</h6>
                  <p className="text-[9.5px] sm:text-[11px] md:text-xs text-gray-700 leading-tight mt-0.5">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6 py-4 sm:py-5 md:py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-3 sm:mb-4">
              <img 
                src={footerLogo.url || brandLogo}
                alt={footerLogo.alt || CONTACT_INFO.companyName}
                style={{
                  ...(footerLogo.width !== 'auto' && { width: footerLogo.width }),
                  ...(footerLogo.height !== 'auto' && { height: footerLogo.height }),
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                className={footerLogo.width === 'auto' && footerLogo.height === 'auto' 
                  ? "h-36 sm:h-44 w-auto object-contain mb-4" 
                  : "object-contain mb-4"}
                onError={(e) => {
                  e.target.src = brandLogo;
                }}
              />
              <p className="text-sm sm:text-base leading-relaxed max-w-md text-gray-700">
                Your trusted destination for premium kids & baby products. 
                We bring you the finest collection of clothing, accessories, and toys for your little ones.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-gray-700">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-black" />
                <span className="text-sm sm:text-base break-words">{CONTACT_INFO.phone}</span>
              </div>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-gray-700">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-black" />
                <span className="text-sm sm:text-base break-all">{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-gray-700">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0 text-black" />
                <span className="text-sm sm:text-base break-words">{CONTACT_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-black">Quick Links</h5>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="footer-link opacity-90 hover:opacity-100 active:opacity-100 transition-all duration-300 flex items-center gap-2 group text-sm sm:text-base touch-manipulation"
                  >
                    <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 bg-black"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg text-black">Categories</h5>
            <ul className="space-y-2 sm:space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.path}
                    className="footer-link opacity-90 hover:opacity-100 active:opacity-100 transition-all duration-300 flex items-center gap-2 group text-sm sm:text-base touch-manipulation"
                  >
                    <span className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0 bg-black"></span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Policy Links Section */}
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 bg-white border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
          <Link 
            to="/privacy" 
            className="text-sm sm:text-base text-black hover:text-gray-700 transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link 
            to="/terms" 
            className="text-sm sm:text-base text-black hover:text-gray-700 transition-colors duration-200"
          >
            Terms & Conditions
          </Link>
          <span className="text-gray-400">•</span>
          <Link 
            to="/shipping" 
            className="text-sm sm:text-base text-black hover:text-gray-700 transition-colors duration-200"
          >
            Shipping Policy
          </Link>
          <span className="text-gray-400">•</span>
          <Link 
            to="/refund-cancellation" 
            className="text-sm sm:text-base text-black hover:text-gray-700 transition-colors duration-200"
          >
            Refund/Cancellation Policy
          </Link>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="border-t border-gray-200">
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 xl:px-4 2xl:px-6 py-2 sm:py-3 md:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-black text-center sm:text-left">
              © {currentYear} {CONTACT_INFO.companyName}. All Rights Reserved
            </div>
            <div className="flex gap-3 sm:gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 touch-manipulation"
                  style={{ backgroundColor: '#F3F4F6', color: '#000000' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.backgroundColor = '#E5E7EB';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onTouchEnd={(e) => {
                    setTimeout(() => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.color = '#000000';
                    }, 150);
                  }}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
