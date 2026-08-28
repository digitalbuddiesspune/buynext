import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { navbarCategories } from '../data/categoryTree';
import { api } from '../utils/api';

const MobileHeader = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [dropdownTop, setDropdownTop] = useState(0);
  const categoryRef = useRef(null);
  const headerRef = useRef(null);
  const navigate = useNavigate();

  const categories = navbarCategories;

  // Calculate dropdown top position
  useEffect(() => {
    const updateDropdownPosition = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setDropdownTop(rect.bottom + 4);
      }
    };
    updateDropdownPosition();
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition);
    return () => {
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking on a link or button inside dropdown
      if (event.target.tagName === 'A' || event.target.closest('a') || event.target.tagName === 'BUTTON' || event.target.closest('button')) {
        // Only close if clicking outside the category container
        const isInsideCategory = categoryRef.current && categoryRef.current.contains(event.target);
        const isInsideDropdown = event.target.closest('[data-dropdown]');
        if (!isInsideCategory && !isInsideDropdown) {
          setActiveCategory(null);
        }
        return;
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        const isInsideDropdown = event.target.closest('[data-dropdown]');
        if (!isInsideDropdown) {
          setActiveCategory(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={headerRef} className="md:hidden w-full border-t border-gray-200 border-b border-gray-200 shadow-sm relative bg-white" style={{ overflow: 'visible' }}>
        {/* Horizontal Scrollable Categories */}
        <div className="relative px-2 sm:px-3 py-1.5" ref={categoryRef} style={{ overflow: 'visible' }}>
          <div className="flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto hide-scrollbar" style={{ overflowY: 'visible', scrollBehavior: 'smooth' }}>
            {categories.map((category) => {
              const isActive = location.pathname === category.path;
              return (
                <div key={category.name} className="relative group shrink-0">
                  <button
                    type="button"
                    className={`flex items-center font-medium text-[11px] sm:text-xs transition-all duration-200 cursor-pointer whitespace-nowrap px-2.5 py-1 rounded-full touch-manipulation ${
                      isActive ? 'bg-gray-900 text-white font-semibold shadow-sm' : 'text-gray-800 bg-gray-100 active:bg-gray-200'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(category.path);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <span className="whitespace-nowrap">{category.name}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  );
};

export default MobileHeader;

