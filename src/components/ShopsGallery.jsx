import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ashokapuramImg from '../assets/Shops/Ashokapuram.png';
import calicutBeachImg from '../assets/Shops/Calicut beach.png';
import malappuramImg from '../assets/Shops/Malappuram.png';
import payyambalamImg from '../assets/Shops/Payyambalam kannur.png';
import perinthalmannaImg from '../assets/Shops/Perinthalmanna.png';

const shops = [
  {
    id: 'perinthalmanna',
    city: 'Perinthalmanna',
    name: 'Bypass Road Outlet',
    address: 'Near Bismi Hypermart, Ooty-Calicut Bypass Road, Kerala 679322',
    link: 'https://share.google/9n64I35JbqKwwgg7f',
    image: perinthalmannaImg,
    tagline: 'Our signature bypass destination for travelers and locals alike.'
  },
  {
    id: 'ashokapuram',
    city: 'Kozhikode',
    name: 'Ashokapuram Outlet',
    address: 'Ashokapuram, Kozhikode, Kerala 673001',
    link: 'https://share.google/4bXH2gbr0Pes5CXbm',
    image: ashokapuramImg,
    tagline: 'A modern, vibrant corner in Kozhikode serving fresh cane juice daily.'
  },
  {
    id: 'calicut-beach',
    city: 'Kozhikode',
    name: 'Calicut Beach Outlet',
    address: 'Calicut Beach, Kozhikode, Kerala 673032',
    link: 'https://share.google/F7uPuFEWIhvBIAAvR',
    image: calicutBeachImg,
    tagline: 'Vibe by the sea with our freshly crushed, cooling sugarcane refreshments.'
  },
  {
    id: 'malappuram',
    city: 'Malappuram',
    name: 'Kizhakkethala Outlet',
    address: 'Kizhakkethala, Malappuram, Kerala 676503',
    image: malappuramImg,
    link: 'https://share.google/1ntRvRHc5XVtlGaRt',
    tagline: 'Your quick energy stop right in the heart of Malappuram.'
  },
  {
    id: 'payyambalam',
    city: 'Kannur',
    name: 'Payyambalam Outlet',
    address: 'Payyambalam Beach Road, Kannur, Kerala 670001',
    link: 'https://maps.app.goo.gl/kX7m7X3t2F8Yd5m47',
    image: payyambalamImg,
    tagline: 'Enjoy Kannur\'s scenic shorelines with a cup of pure natural energy.'
  }
];

const ShopsGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % shops.length);
    }, 6000); // Auto change every 6 seconds

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const activeShop = shops[activeIndex];

  return (
    <section id="shops" className="py-24 bg-bg text-text-light px-4 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-accent/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-star/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-accent font-bold tracking-widest uppercase mb-3 text-sm"
            >
              Step Inside
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-syne font-black tracking-tight uppercase"
            >
              Experience our <br /><span className="text-accent">Outlets.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-light/70 max-w-md leading-relaxed"
          >
            We've elevated the sugarcane experience. Visit our clean, modern, and youth-focused setups across Kerala.
          </motion.p>
        </div>

        {/* Main Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left: Active Shop Image */}
          <div className="lg:col-span-7 relative h-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeShop.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0 w-full h-full"
              >
                <img
                  src={activeShop.image}
                  alt={activeShop.name}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent opacity-80" />
              </motion.div>
            </AnimatePresence>

            {/* Quick status badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-accent text-text-dark font-bold px-4 py-2 rounded-full shadow-lg text-xs uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-text-dark opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-text-dark"></span>
              </span>
              Live Store
            </div>
          </div>

          {/* Right: Active Shop Details */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-bg-light text-text-dark rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-xl">
            {/* Soft decorative background asset */}
            <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-accent/20 rounded-full blur-[50px] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeShop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col h-full justify-between gap-8 relative z-10"
              >
                <div>
                  <span className="text-xs font-bold text-accent bg-bg px-3.5 py-1.5 rounded-full text-white uppercase tracking-wider inline-block mb-6">
                    {activeShop.city}
                  </span>
                  <h3 className="text-3xl md:text-4xl font-syne font-black text-text-dark mb-4 leading-tight">
                    {activeShop.name}
                  </h3>
                  <p className="text-lg text-text-dark/80 italic mb-6 leading-relaxed">
                    "{activeShop.tagline}"
                  </p>
                  
                  <div className="space-y-4 border-t border-text-dark/10 pt-6">
                    <div className="flex items-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg mt-1 flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <p className="text-text-dark/75 leading-relaxed text-base">
                        {activeShop.address}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-bg flex-shrink-0" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <p className="text-text-dark/75 font-semibold text-base">
                        Open Daily: 10:00 AM - 11:30 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href={activeShop.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsAutoPlay(false)}
                    className="inline-flex items-center justify-between w-full sm:w-auto sm:gap-8 bg-bg text-bg-light px-8 py-5 rounded-2xl font-bold hover:bg-accent hover:text-text-dark transition-all duration-300 shadow-lg hover:shadow-accent/20 group text-lg"
                  >
                    <span>Get Directions</span>
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center transform group-hover:translate-x-1 transition-transform duration-300 ml-4">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </div>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Outlets selector (thumbnails) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {shops.map((shop, index) => {
            const isActive = index === activeIndex;
            return (
              <motion.button
                key={shop.id}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAutoPlay(false);
                }}
                className={`relative h-28 md:h-32 rounded-2xl overflow-hidden text-left transition-all duration-300 border-2 ${
                  isActive ? 'border-accent shadow-lg shadow-accent/20 scale-[1.02]' : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                }`}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${isActive ? 'from-bg/95 via-bg/75' : 'from-black/90 via-black/40'} transition-all`} />
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-accent mb-0.5">
                    {shop.city}
                  </span>
                  <span className="text-xs font-bold leading-tight line-clamp-1">
                    {shop.name.replace(' Outlet', '')}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopsGallery;
