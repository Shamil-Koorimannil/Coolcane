import React from 'react';
import { motion } from 'framer-motion';

const SubscriptionCTA = () => {
  return (
    <section className="py-24 bg-bg px-4 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-start">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl lg:text-7xl font-syne font-bold text-text-light leading-tight mb-10"
          >
            Sign up for automatic delivery*<br/>and save 10%.
          </motion.h2>
          
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-bg-light text-bg font-bold py-4 px-10 rounded-full hover:bg-accent transition-colors text-lg"
          >
            Subscribe
          </motion.button>
        </div>

        {/* Decorative Flower */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 flex justify-center md:justify-end"
        >
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[80%] max-w-[400px]">
             {/* Center circle */}
             <circle cx="200" cy="200" r="40" fill="var(--color-bg-light)" />
             {/* Petals */}
             <path d="M200 160 C150 50 250 50 200 160" fill="var(--color-accent)"/>
             <path d="M200 240 C150 350 250 350 200 240" fill="var(--color-accent)"/>
             <path d="M160 200 C50 150 50 250 160 200" fill="var(--color-accent)"/>
             <path d="M240 200 C350 150 350 250 240 200" fill="var(--color-accent)"/>
             
             <path d="M170 170 C80 80 120 40 170 170" fill="var(--color-accent)" opacity="0.8"/>
             <path d="M230 230 C320 320 280 360 230 230" fill="var(--color-accent)" opacity="0.8"/>
          </svg>
        </motion.div>
      </div>

      {/* Large background text spanning */}
      <div className="w-full overflow-hidden mt-20 relative z-10 whitespace-nowrap">
        <motion.h3 
          initial={{ x: "100%" }}
          whileInView={{ x: "-100%" }}
          viewport={{ once: false, margin: "-50px" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="text-[10vw] md:text-[120px] font-syne font-bold italic text-text-light/10 uppercase"
        >
          We have what you need
        </motion.h3>
      </div>

      <div className="max-w-7xl mx-auto mt-10 relative z-10">
        <p className="text-text-light/60 text-sm md:text-base">
          * We don't deliver in space yet, but who knows...
        </p>
      </div>
    </section>
  );
};

export default SubscriptionCTA;
