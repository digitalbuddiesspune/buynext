import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruck, FaAward, FaShieldAlt, FaUndo } from 'react-icons/fa';

import bathAndHandwashImg from '../assets/bath and handwash.png';
import feminineHygieneImg from '../assets/Feminine Hygiene.png';
import fragrancesDeosImg from '../assets/Fragrances & Deos.png';
import haircareImg from '../assets/haircare.png';
import healthAndMedicineImg from '../assets/Health and.png';
import makeupImg from '../assets/makeup.png';
import oralCareImg from '../assets/oral care.png';
import skinCareImg from '../assets/skin care.png';

import offerZone1Img from '../assets/offerzone1.png';
import offerZone2Img from '../assets/offerzone2.png';
import offerZone3Img from '../assets/offerzone3.png';
import offerZone4Img from '../assets/offerzone4.png';

const DoorMartSections = () => {
  const navigate = useNavigate();

  // Click Handler Function
  const handleCategoryClick = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Shop by Category Section
  const MainCategories = () => {
    const categories = [
      { 
        name: 'Bath & Hand Wash', 
        icon: '🧼', 
        image: bathAndHandwashImg, 
        path: '/category/beauty-and-hygiene/bath-and-hand-wash' 
      },
      { 
        name: 'Feminine Hygiene', 
        icon: '🌺', 
        image: feminineHygieneImg, 
        path: '/category/beauty-and-hygiene/feminine-hygiene' 
      },
      { 
        name: 'Fragrances & Deos', 
        icon: '🌸', 
        image: fragrancesDeosImg, 
        path: '/category/beauty-and-hygiene/fragrances-and-deos' 
      },
      { 
        name: 'Hair Care', 
        icon: '💇‍♀️', 
        image: haircareImg, 
        path: '/category/beauty-and-hygiene/hair-care' 
      },
      {
        name: 'Health & Medicine',
        icon: '💊',
        image: healthAndMedicineImg,
        path: '/category/beauty-and-hygiene/health-and-medicine'
      },
      { 
        name: 'Makeup', 
        icon: '💄', 
        image: makeupImg, 
        path: '/category/beauty-and-hygiene/makeup' 
      },
      {
        name: 'Oral Care',
        icon: '🪥',
        image: oralCareImg,
        path: '/category/beauty-and-hygiene/oral-care'
      },
      { 
        name: 'Skin Care', 
        icon: '✨', 
        image: skinCareImg, 
        path: '/category/beauty-and-hygiene/skin-care' 
      }
    ];

    return (
      <section 
        className="pt-6 pb-5 sm:pt-8 sm:pb-5 md:pt-10 md:pb-5 lg:pt-12 lg:pb-7 px-2 sm:px-4 md:px-6 lg:px-8 w-full"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full">
          <div className="mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1 border border-red-200 bg-white">
                  <span className="relative w-2.5 h-2.5 inline-block rounded-full bg-red-500">
                    <span className="absolute inset-0 rounded-full bg-red-500 opacity-25 animate-ping" />
                  </span>
                  <span className="text-xs font-bold tracking-wide text-red-600">DISCOVER</span>
                </div>

                <h2
                  className="mt-2 text-2xl md:text-xl lg:text-4xl font-extrabold text-black leading-tight"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: '1px',
                  }}
                >
                  Shop by <span className="text-red-600">Category</span>
                </h2>

                <p className="mt-1 text-xs sm:text-sm md:text-base tracking-wider font-semibold text-gray-600 pb-3">
                  CURATED PICKS FOR YOUR STYLE
                </p>
              </div>

              
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 px-2 sm:px-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category.path)}
              >
                <div className="relative aspect-square bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:border-gray-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                  <div className="absolute inset-0 bg-gray-50">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x300/1F2937/FFFFFF?text=Category';
                      }}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-center mt-3 text-xs sm:text-sm md:text-base font-semibold text-gray-900 group-hover:text-[#02050B] transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };


  // Offer Zone Section
  const FeaturedSection = () => {
    const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
    const offers = [
      {
        id: 1,
        image: offerZone1Img,
        path: '/category/beauty-and-hygiene'
      },
      {
        id: 2,
        image: offerZone2Img,
        path: '/category/beauty-and-hygiene/skin-care'
      },
      {
        id: 3,
        image: offerZone3Img,
        path: '/category/beauty-and-hygiene/makeup'
      },
      {
        id: 4,
        image: offerZone4Img,
        path: '/category/beauty-and-hygiene'
      }
    ];

    useEffect(() => {
      const intervalId = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % offers.length);
      }, 3000);
      return () => clearInterval(intervalId);
    }, [offers.length]);

    return (
      <section
        className="pt-4 pb-6 sm:pt-4 sm:pb-7 md:pt-5 md:pb-8 lg:pt-6 lg:pb-10 px-2 sm:px-4 md:px-6 lg:px-8 w-full"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full">
          <div className="text-center mb-2 sm:mb-3 md:mb-4 px-2 sm:px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-0 sm:mb-1 uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '2px',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              OFFER ZONE
            </h2>
          </div>
          {/* Mobile: auto circular carousel */}
          <div className="sm:hidden px-2">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentOfferIndex * 100}%)` }}
              >
                {offers.map((offer) => (
                  <div
                    key={offer.id}
                    onClick={() => handleCategoryClick(offer.path)}
                    className="relative w-full flex-shrink-0 overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                    <img
                      src={offer.image}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/600/1F2937/FFFFFF?text=Offer';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              {offers.map((offer, idx) => (
                <button
                  key={offer.id}
                  type="button"
                  onClick={() => setCurrentOfferIndex(idx)}
                  aria-label={`Go to offer ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    currentOfferIndex === idx ? 'w-6 bg-[#5c9404]' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tablet/Desktop: grid */}
          <div className="hidden sm:grid grid-cols-2 gap-4 md:gap-5 lg:gap-6 px-2 sm:px-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => handleCategoryClick(offer.path)}
                className="relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] group cursor-pointer"
              >
                <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full"></div>
                <img
                  src={offer.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-[1.03]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600/1F2937/FFFFFF?text=Offer';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Premium Collection Section
  const PremiumCollection = () => {
    const productData = [
      {
        image: 'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774521094/0dbfe300-b764-4e49-a966-fcf5a9df5b7b.png',
        name: 'Skin Care',
        path: '/category/beauty-and-hygiene/skin-care',
        description: 'Moisturizers, cleansers, serums and daily skin essentials.',
        cta: 'Shop Skin Care',
        bgTint: 'bg-rose-50'
      },
      {
        image: 'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774528869/a8c0009f-b9a6-483a-aa83-16cdcc6d1e01.png',
        name: 'Makeup',
        path: '/category/beauty-and-hygiene/makeup',
        description: 'Lips, eyes, face, brushes and makeup kits.',
        cta: 'Shop Makeup',
        bgTint: 'bg-cyan-50'
      },
      {
        image: 'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774433102/9abba838-a920-4a7d-a0ff-47ec24bbbc9e.png',
        name: 'Hair Care',
        path: '/category/beauty-and-hygiene/hair-care',
        description: 'Shampoos, conditioners, hair oils and styling.',
        cta: 'Shop Hair Care',
        bgTint: 'bg-emerald-50'
      },
      {
        image: 'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774433220/8323916c-168e-4dec-9d82-3d8546f016c1.png',
        name: 'Fragrances & Deos',
        path: '/category/beauty-and-hygiene/fragrances-and-deos',
        description: 'Body sprays, mists, deodorants and perfumes.',
        cta: 'Shop Fragrances',
        bgTint: 'bg-amber-50'
      }
    ];

    return (
      <section 
        className="py-6 sm:py-8 md:py-10 lg:py-12 px-2 sm:px-3 md:px-4 lg:px-5 w-full" 
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full">
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-2 sm:px-4">
            <h2 
              className="text-[1.6rem] sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center mb-2 sm:mb-3 text-black overflow-hidden uppercase leading-none" 
              style={{ 
                fontFamily: "'Bebas Neue', sans-serif", 
                letterSpacing: '2px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)' 
              }}
            >
              <span className="inline-block">PREMIUM COLLECTION</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 md:gap-6 w-full px-1 sm:px-2 md:px-3">
            {productData.map((product, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(product.path)}
                className={`group relative overflow-hidden rounded-xl ${product.bgTint} transition-all duration-300 w-full cursor-pointer border border-gray-200 shadow-sm`}
              >
                <div className="relative w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x500/1F2937/FFFFFF?text=Product+Image';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white bg-[#5c9404] shadow">
                      Top Category
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                      {product.name}
                    </h3>
                  </div>
                </div>
                <div className={`px-3 py-3 sm:px-4 sm:py-4 ${product.bgTint}`}>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed min-h-[34px] sm:min-h-[40px]">
                    {product.description}
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-[12px] sm:text-sm font-semibold text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800 active:scale-[0.98] transition-all duration-200 shadow-md group-hover:shadow-lg"
                    >
                      {product.cta}
                      <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5">{''}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Banner Section
  const BannerSection = () => {
    return (
      <section 
        className="py-8 sm:py-10 md:py-12 lg:py-16 px-2 sm:px-4 md:px-6 lg:px-8 w-full" 
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4">
            <h2 
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-2 sm:mb-3 uppercase" 
              style={{ 
                fontFamily: "'Bebas Neue', sans-serif", 
                letterSpacing: '2px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)' 
              }}
            >
              SHOP BY CATEGORY
            </h2>
          </div>

          <div className="w-full px-2 sm:px-4">
            {/* Mobile Banner */}
            <div 
              onClick={() => handleCategoryClick('/category/kids-accessories')}
              className="relative overflow-hidden rounded-2xl shadow-xl md:hidden cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="w-full">
                <img
                  src="https://res.cloudinary.com/dzd47mpdo/image/upload/v1774591555/banner-fmcg-2_sidqv8.jpg"
                  alt="Special Collection Banner"
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/600x800/FEF8DD/000000?text=Banner';
                  }}
                />
              </div>
            </div>
            {/* Desktop Banner */}
            <div 
              onClick={() => handleCategoryClick('/category/kids-accessories')}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl hidden md:block cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01]"
            >
              <div className="w-full">
              <img 
                  src="https://res.cloudinary.com/dzd47mpdo/image/upload/v1774591555/banner-fmcg-2_sidqv8.jpg"
                  alt="Special Collection Banner"
                className="w-full h-auto object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1200x400/FEF8DD/000000?text=Banner';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Why Choose Us Section
  const WhyChooseUs = () => {
    const features = [
      {
        id: 1,
        icon: FaTruck,
        title: 'Fast Delivery',
        description: 'Quick and reliable shipping across India with secure packaging',
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600'
      },
      {
        id: 2,
        icon: FaAward,
        title: 'Premium Quality',
        description: 'Authentic products with superior craftsmanship and attention to detail',
        color: 'yellow',
        gradient: 'from-yellow-500 to-yellow-600'
      },
      {
        id: 3,
        icon: FaShieldAlt,
        title: 'Safe & Certified',
        description: 'All products meet safety standards and are certified for kids',
        color: 'green',
        gradient: 'from-green-500 to-green-600'
      },
      {
        id: 4,
        icon: FaUndo,
        title: 'Easy Returns',
        description: 'Hassle-free return policy within 7 days with full refund guarantee',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600'
      }
    ];

    const colorMap = {
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500'
    };

    return (
      <section 
        className="pt-4 pb-12 sm:pt-6 sm:pb-16 md:pt-8 md:pb-20 lg:pt-10 lg:pb-24 px-2 sm:px-4 md:px-6 lg:px-8 w-full" 
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div className="w-full">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 px-2 sm:px-4">
            <h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-3 sm:mb-4 uppercase" 
              style={{ 
                fontFamily: "'Bebas Neue', sans-serif", 
                letterSpacing: '2px', 
                textShadow: '0 2px 4px rgba(0,0,0,0.1)' 
              }}
            >
              WHY CHOOSE US
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              Experience the best in premium kids and baby products with unmatched quality and service
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className={`absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 ${colorMap[feature.color]} rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                  <div className="relative z-10">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${feature.gradient} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 md:mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-lg sm:text-xl md:text-2xl text-white" />
                </div>
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 text-center leading-tight">{feature.title}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-center leading-snug sm:leading-relaxed">{feature.description}</p>
                </div>
              </div>
              );
            })}
          </div>
          </div>
      </section>
    );
  };

  // Promotional Banners Section
  const PromotionalBanners = () => {
    return (
      <section className="py-10 sm:py-12 md:py-16 px-2 sm:px-4 md:px-6 lg:px-8 w-full bg-white">
        <div className="w-full">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 px-2 sm:px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black mb-2 sm:mb-3 uppercase"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                letterSpacing: '2px',
                textShadow: '0 2px 4px rgba(0,0,0,0.08)',
              }}
            >
              CLIENT REVIEWS
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Real feedback from our happy customers across India.
            </p>
          </div>

          {/* Mobile Only Banner */}
          <div className="mb-4 md:hidden px-2">
            <div
              onClick={() => handleCategoryClick('/category/toys')}
              className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzd47mpdo/image/upload/v1774591242/ca2e5e7b-927f-4410-ab84-d1cce994652f.png"
                  alt="Special Offers Mobile Banner"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x500/E6D9F2/000000?text=Banner';
                  }}
                />
              </div>
            </div>
          </div>

          {/* Desktop Two Banners - Hidden on Mobile */}
          <div className="hidden md:grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-2 sm:px-4">
            <div
              onClick={() => handleCategoryClick('/category/toys')}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] group cursor-pointer"
            >
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[2/1] bg-gray-100 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzd47mpdo/image/upload/v1774591277/94dae241-59e4-4948-8687-7e72c26a102f.png"
                  alt="Special Offers Desktop Banner 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1200x500/E6D9F2/000000?text=Banner';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <div
              onClick={() => handleCategoryClick('/category/toys')}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] group cursor-pointer"
            >
              <div className="w-full aspect-[4/3] sm:aspect-[3/2] md:aspect-[2/1] bg-gray-100 overflow-hidden">
                <img
                  src="https://res.cloudinary.com/dzd47mpdo/image/upload/v1774591242/ca2e5e7b-927f-4410-ab84-d1cce994652f.png"
                  alt="Special Offers Desktop Banner 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/1200x500/E6D9F2/000000?text=Banner';
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF' }}>
      <MainCategories />
      <FeaturedSection />
      <PremiumCollection />
      <WhyChooseUs />
    </div>
  );
};

export default DoorMartSections;
