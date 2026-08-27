import React from 'react';
import Collections from '../components/Collections';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import DoorMartSections from '../components/TickNTrackSections';
import ScrollToTop from '../components/ScrollToTop';
import heroBanner1 from '../assets/hero banner 1.png';
import heroBanner3 from '../assets/herobanner3.png';
import heroBanner4 from '../assets/herobanner4.png';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: heroBanner1,
            alt: 'BuyNest - Beauty & Hygiene Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/dzd47mpdo/image/upload/v1774422272/Untitled_1920_x_600_px_16_qkdbcw.png',
            alt: 'Festive Season Offer - BuyNest',
          },
          {
            desktop: heroBanner3,
            alt: 'Festive Season Offer - BuyNest',
          },
          {
            desktop: heroBanner4,
            alt: 'Festive Season Offer - BuyNest',
          },
        ]}
        mobileSrc={heroBanner1}
      />

      {/* DoorMart Sections */}
      <DoorMartSections />

      {/* Featured Collections */}

       
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default Home;
