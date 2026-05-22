import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

const InitialLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const bgRef = useRef(null);
  const containerRef = useRef(null);
  
  const phrases = ["Harvesting fresh cane", "Crushing for purity", "Infusing flavors", "Ready to serve"];
  const [phrase, setPhrase] = useState(phrases[0]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let fallbackInterval = null;

    const startFallbackProgress = () => {
      let currentProgress = 0;
      fallbackInterval = setInterval(() => {
        const increment = currentProgress > 85 ? Math.random() * 1.5 : Math.random() * 5 + 1;
        currentProgress = Math.min(currentProgress + increment, 99);
        setProgress(Math.floor(currentProgress));
      }, 70);
    };

    const timeout = setTimeout(() => {
      if (window.heroFramesProgress === undefined) {
        startFallbackProgress();
      }
    }, 1500);

    const handleProgress = (e) => {
      clearTimeout(timeout);
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      setProgress(e.detail);
    };

    window.addEventListener('hero-frames-progress', handleProgress);

    if (window.heroFramesProgress !== undefined) {
      clearTimeout(timeout);
      setProgress(window.heroFramesProgress);
    }

    return () => {
      clearTimeout(timeout);
      if (fallbackInterval) {
        clearInterval(fallbackInterval);
      }
      window.removeEventListener('hero-frames-progress', handleProgress);
    };
  }, []);

  useEffect(() => {
    if (progress > 25 && progress <= 50) setPhrase(phrases[1]);
    else if (progress > 50 && progress <= 80) setPhrase(phrases[2]);
    else if (progress > 80 && progress < 100) setPhrase(phrases[3]);

    if (progress === 100) {
      setPhrase(phrases[3]);
      // Master exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = 'auto';
          onComplete();
        }
      });
      
      tl.to(containerRef.current, {
        opacity: 0,
        y: -40,
        duration: 0.6,
        ease: "power3.inOut"
      })
      .to(bgRef.current, {
        yPercent: -100,
        duration: 1.2,
        ease: "expo.inOut"
      }, "-=0.2");
    }
  }, [progress, onComplete]);

  return (
    <div ref={bgRef} className="fixed top-0 left-0 w-full h-full z-[9999] bg-bg flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div ref={containerRef} className="relative z-10 flex flex-col items-center w-full max-w-sm px-8">
        
        <h1 className="text-7xl md:text-8xl font-syne font-black text-text-light mb-2 tracking-tighter tabular-nums flex items-baseline">
          {progress}
          <span className="text-accent text-3xl md:text-4xl ml-1">%</span>
        </h1>
        
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden my-6 relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-accent shadow-[0_0_10px_rgba(141,198,63,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.2 }}
          />
        </div>
        
        <div className="h-6 flex items-center justify-center overflow-hidden w-full relative">
          <AnimatePresence mode="wait">
            <motion.p 
              key={phrase}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-text-light/70 text-center absolute"
            >
              {phrase}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;
