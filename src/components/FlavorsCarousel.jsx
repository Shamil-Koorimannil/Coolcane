import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const FlavorsCarousel = () => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  const flavors = [
    { name: 'Grapefruit', color: '#f79f8e' },
    { name: 'Blackberry & Hibiscus', color: '#c387ad' },
    { name: 'Tropical', color: '#f7c059' },
    { name: 'Melon & Mint', color: '#97d299' },
  ];

  return (
    <section className="py-32 bg-bg px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex justify-between items-end mb-16">
        <div className="relative">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-syne font-bold text-text-light relative z-10"
          >
            Flavors
          </motion.h2>
          {/* Decorative Stars */}
          <svg className="absolute -top-10 -left-10 text-star w-12 h-12 z-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0L22.4 17.6L40 20L22.4 22.4L20 40L17.6 22.4L0 20L17.6 17.6L20 0Z" fill="currentColor"/>
          </svg>
          <svg className="absolute -bottom-10 -right-10 text-star w-8 h-8 z-0" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0L22.4 17.6L40 20L22.4 22.4L20 40L17.6 22.4L0 20L17.6 17.6L20 0Z" fill="currentColor"/>
          </svg>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-light mt-6 max-w-md"
          >
            Fresh, fruity, sparkling, beautiful colours, awaken your taste buds.
          </motion.p>
        </div>

        <div className="hidden md:flex space-x-4">
          <button onClick={scrollLeft} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-text-light hover:bg-white/10 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button onClick={scrollRight} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-text-light hover:bg-white/10 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div 
        ref={carouselRef}
        className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 max-w-[100vw]"
      >
        <div className="flex px-4 md:px-[max(2rem,calc((100vw-80rem)/2))] gap-8">
          {flavors.map((fl, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ delay: i * 0.1 }}
              className="flex-shrink-0 w-[80vw] md:w-[400px] snap-center flex flex-col items-center"
            >
              <div 
                className="w-full aspect-[3/4] rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                style={{ backgroundColor: fl.color }}
              >
                {/* Simulated Product Can */}
                <div className="w-[120px] h-[240px] bg-white/20 rounded-md backdrop-blur-sm border border-white/30 shadow-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-4">
                  <span className="font-syne font-bold text-bg-light transform -rotate-90 text-2xl tracking-widest uppercase opacity-80">MANA</span>
                </div>
              </div>
              <h3 className="mt-8 text-3xl font-syne font-bold text-text-light text-center">{fl.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlavorsCarousel;
