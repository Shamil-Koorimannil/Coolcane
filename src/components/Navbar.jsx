import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/Coolcane logo.svg';
const Menu = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const X = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const Facebook = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;

const Instagram = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const PlusIcon = ({ size, className }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

const flavours = [
  { name: 'Grapefruit', color: '#f79f8e' },
  { name: 'Blackberry & Hibiscus', color: '#c387ad' },
  { name: 'Tropical', color: '#f7c059' },
  { name: 'Melon & Mint', color: '#97d299' },
  { name: 'Discovery Box', color: '#e4dfd8' }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOverLightSection, setIsOverLightSection] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;
      const heroPinDuration = isMobile ? 1500 : 3000;
      // Wait until we scroll past the hero pin AND the height of the hero section itself
      if (window.scrollY >= heroPinDuration + window.innerHeight - 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = document.querySelectorAll('section');
      let currentSection = null;

      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Check if section is currently under the navbar
        if (rect.top <= 80 && rect.bottom >= 20) {
          currentSection = section;
        }
      });

      if (currentSection && (currentSection.classList.contains('bg-bg-light') || currentSection.classList.contains('bg-[var(--color-bg-light)]'))) {
        setIsOverLightSection(true);
      } else {
        setIsOverLightSection(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const textColorClass = isOverLightSection ? 'text-[#143601]' : 'text-text-light';
  const iconColorClass = isOverLightSection ? 'text-[#143601]' : 'text-text-light';

  const mobileBgClass = isOverLightSection ? 'bg-bg-light/95 border-black/10' : 'bg-bg/95 border-white/10';
  const mobileTextColorClass = isOverLightSection ? 'text-[#143601]' : 'text-text-light';
  const mobileIconColorClass = isOverLightSection ? 'text-[#143601]' : 'text-text-light';


  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-300 ${isScrolled
            ? (isOverLightSection ? 'bg-bg-light/90 backdrop-blur-md' : 'bg-bg/90 backdrop-blur-md')
            : 'bg-transparent'
          }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 text-text-light cursor-pointer">
            <img src={logo} alt="Coolcane Logo" className="h-10 sm:h-12 lg:h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" onClick={(e) => handleScrollTo(e, 'about')} className={`${textColorClass} hover:text-text-dark transition-colors font-medium text-sm`}>About</a>

            <a href="#flavours" onClick={(e) => handleScrollTo(e, 'flavours')} className={`${textColorClass} hover:text-text-dark transition-colors font-medium text-sm`}>Flavours</a>

            <a href="#shops" onClick={(e) => handleScrollTo(e, 'shops')} className={`${textColorClass} hover:text-text-dark transition-colors font-medium text-sm`}>Shops</a>
            <a href="#reviews" onClick={(e) => handleScrollTo(e, 'reviews')} className={`${textColorClass} hover:text-text-dark transition-colors font-medium text-sm`}>Reviews</a>
            <a href="#franchise" onClick={(e) => handleScrollTo(e, 'franchise')} className={`${textColorClass} hover:text-text-dark transition-colors font-medium text-sm`}>Franchise</a>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-3">
              <a href="https://www.facebook.com/p/Coolcane-61573889301998/" target="_blank" rel="noopener noreferrer" className={`${iconColorClass} hover:text-text-dark transition-colors`}><Facebook size={18} /></a>
              <a href="https://www.instagram.com/coolcane_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className={`${iconColorClass} hover:text-text-dark transition-colors`}><Instagram size={18} /></a>
            </div>
          </div>

          {/* Mobile FAB is positioned globally */}
        </div>
      </div>

      </nav>

      {/* Mobile FAB Navigation */}
      <div className="md:hidden fixed bottom-6 right-6 z-[101]">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              style={{ originX: 1, originY: 1 }}
              className={`absolute bottom-20 right-0 mb-4 ${mobileBgClass} backdrop-blur-xl border rounded-3xl p-6 shadow-2xl flex flex-col space-y-6 min-w-[220px] transition-all duration-300`}
            >
              <a href="#about" className={`text-2xl font-syne ${mobileTextColorClass} font-bold hover:text-accent transition-colors`} onClick={(e) => handleScrollTo(e, 'about')}>About</a>
              <a href="#flavours" className={`text-2xl font-syne ${mobileTextColorClass} font-bold hover:text-accent transition-colors`} onClick={(e) => handleScrollTo(e, 'flavours')}>Flavours</a>
              <a href="#shops" className={`text-2xl font-syne ${mobileTextColorClass} font-bold hover:text-accent transition-colors`} onClick={(e) => handleScrollTo(e, 'shops')}>Shops</a>
              <a href="#reviews" className={`text-2xl font-syne ${mobileTextColorClass} font-bold hover:text-accent transition-colors`} onClick={(e) => handleScrollTo(e, 'reviews')}>Reviews</a>
              <a href="#franchise" className={`text-2xl font-syne ${mobileTextColorClass} font-bold hover:text-accent transition-colors`} onClick={(e) => handleScrollTo(e, 'franchise')}>Franchise</a>

              <div className={`pt-6 border-t ${isOverLightSection ? 'border-black/10' : 'border-white/10'} flex space-x-6 justify-between transition-colors duration-300`}>
                <a href="https://www.facebook.com/p/Coolcane-61573889301998/" target="_blank" rel="noopener noreferrer" className={`${mobileIconColorClass} hover:text-accent transition-colors`}><Facebook size={22} /></a>
                <a href="https://www.instagram.com/coolcane_india?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className={`${mobileIconColorClass} hover:text-accent transition-colors`}><Instagram size={22} /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-16 h-16 bg-accent text-bg rounded-full flex items-center justify-center shadow-xl transform transition-transform active:scale-95 hover:scale-105"
        >
          <motion.div
            animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <PlusIcon size={32} />
          </motion.div>
        </button>
      </div>
    </>
  );
};

export default Navbar;
