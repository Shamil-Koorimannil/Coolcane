import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      title: "Freshness First",
      desc: "Everything starts with live crushed sugarcane juice. Sourced and served to feel naturally clean and refreshing."
    },
    {
      title: "Hygiene Always",
      desc: "Cleanliness is not optional. We maintain strict hygiene so you can enjoy your fresh drink with absolute trust."
    },
    {
      title: "Flavor with Fun",
      desc: "We don't just serve packed juice — we create experiences with live crushed sugarcane juice. Classic cane to bold mixes."
    },
    {
      title: "Cool & Youthful",
      desc: "Built for today's generation. Coolcane is vibrant, social, and full of life — a place to hang out and vibe."
    }
  ];

  return (
    <section className="relative w-full py-32 bg-bg px-4 overflow-hidden text-text-light">
      
      {/* Background Bubbles */}
      <motion.div
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 right-[10%] w-24 h-24 rounded-full bg-bubble blur-md pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 50, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-10 left-[5%] w-40 h-40 rounded-full bg-bubble blur-lg pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-20">
          <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             className="text-5xl md:text-7xl font-syne font-bold mb-4 uppercase"
          >
            Why Coolcane Works
          </motion.h2>
          <motion.p 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ delay: 0.1 }}
             className="text-xl md:text-2xl text-text-light/80"
          >
            Transforming a traditional street-side drink into a clean, consistent experience.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col"
            >
              {/* Feature Icon abstract representation */}
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-center text-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 className="text-2xl font-syne font-bold mb-4">{feature.title}</h3>
              <p className="text-text-light/80 leading-relaxed text-sm md:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
