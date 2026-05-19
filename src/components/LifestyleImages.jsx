import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const LifestyleImages = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Slight parallax offset between the two images
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={containerRef} className="w-full py-20 bg-bg overflow-hidden px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        <motion.div style={{ y: y1 }} className="relative w-full md:w-1/2 rounded-2xl overflow-hidden aspect-[4/5]">
          <div className="absolute inset-0 bg-bg/20 z-10 mix-blend-multiply" />
          <img 
            src="https://picsum.photos/700/875?random=1" 
            alt="Lifestyle 1" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        <motion.div style={{ y: y2 }} className="relative w-full md:w-1/2 rounded-2xl overflow-hidden aspect-[4/5] mt-10 md:mt-0">
          <div className="absolute inset-0 bg-bg/20 z-10 mix-blend-multiply" />
          <img 
            src="https://picsum.photos/700/875?random=2" 
            alt="Lifestyle 2" 
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleImages;
