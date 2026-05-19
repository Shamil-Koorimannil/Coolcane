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
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90] bg-bg border border-white/10 rounded-full px-6 py-3 flex items-center space-x-6 w-[90%] max-w-sm md:max-w-md shadow-2xl"
        >
          <p className="text-text-light text-sm font-medium flex-1">
            This website uses cookies.
          </p>
          <button 
            onClick={acceptCookies}
            className="px-6 py-2 bg-accent text-bg font-bold rounded-full text-sm hover:scale-105 transition-transform"
          >
            Okay
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
