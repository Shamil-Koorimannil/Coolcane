import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mana-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    setIsVisible(false);
    localStorage.setItem('mana-cookie-consent', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[90] bg-bg/95 backdrop-blur-md border border-white/10 rounded-full pl-5 pr-3 py-2 flex items-center gap-4 w-fit max-w-[calc(100%-2rem)] sm:max-w-sm md:max-w-md shadow-2xl"
        >
          <p className="text-text-light text-xs font-semibold leading-none flex-1 truncate">
            We use cookies.
          </p>
          <button 
            onClick={acceptCookies}
            className="px-4 py-1.5 bg-accent text-bg font-bold rounded-full text-xs hover:scale-105 transition-transform flex-shrink-0"
          >
            Okay
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
