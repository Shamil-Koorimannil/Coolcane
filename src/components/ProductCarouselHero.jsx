import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const ProductCarouselHero = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResizeCheck = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResizeCheck);
    return () => window.removeEventListener('resize', handleResizeCheck);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    
    // Initial size setup
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = isMobile ? 609 : 366;
    
    const currentFrame = index => {
      if (!isMobile) {
        return `/video-sequence/freepik_a-cinematic-highend-comme_2823566962%20(1)_${1000 + index}.jpg`;
      } else {
        if (index <= 303) {
          return `/cane-to-lemon-mob/cane to lemon - mob${String(index).padStart(3, '0')}.jpg`;
        } else {
          // 304 to 608 maps to 0 to 304 in melon index
          const melonIndex = index - 304;
          return `/lemon-to-melon-mob/Lemon to melon - mob${String(melonIndex).padStart(3, '0')}.jpg`;
        }
      }
    };

    // Calculate how many frames are visible on the first screen percentage
    const scrollRange = isMobile ? 1500 : 3000;
    const firstScreenPercentage = Math.min(window.innerHeight / scrollRange, 1.0);
    
    // On mobile, the sequence snaps to [0, 0.5, 1], so the first screen sequence is 50% of the frames (304 frames)
    // On desktop, we dynamically calculate based on viewport height, clamped between 25% and 40%
    const landingFrameCount = Math.min(
      isMobile 
        ? 304 
        : Math.max(
            Math.ceil(frameCount * firstScreenPercentage),
            Math.ceil(frameCount * 0.25)
          ),
      frameCount
    );

    const images = new Array(frameCount);
    const sequence = { frame: 0 };

    const render = () => {
      const img = images[sequence.frame];
      if (!img || !img.complete) return;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height); 
    };

    let loadedLandingCount = 0;
    let backgroundStarted = false;

    const startBackgroundLoading = () => {
      if (backgroundStarted) return;
      backgroundStarted = true;
      
      for (let i = landingFrameCount; i < frameCount; i++) {
        if (images[i]) continue;
        const img = new Image();
        img.src = currentFrame(i);
        images[i] = img;
      }
    };

    const onLandingImageLoadOrError = (index) => {
      loadedLandingCount++;
      const progressPercent = Math.min(Math.round((loadedLandingCount / landingFrameCount) * 100), 100);
      
      window.heroFramesProgress = progressPercent;
      window.dispatchEvent(new CustomEvent('hero-frames-progress', { detail: progressPercent }));
      
      if (index === 0) {
        render();
      }

      if (progressPercent === 100) {
        startBackgroundLoading();
      }
    };

    // Preload landing images first
    for (let i = 0; i < landingFrameCount; i++) {
      const img = new Image();
      img.onload = () => onLandingImageLoadOrError(i);
      img.onerror = () => onLandingImageLoadOrError(i);
      img.src = currentFrame(i);
      images[i] = img;
    }

    const ctx = gsap.context(() => {
      const scrollConfig = {
        trigger: containerRef.current,
        start: "top top",
        end: isMobile ? "+=1500" : "+=3000",
        scrub: 0.5,
        pin: true,
      };

      if (isMobile) {
        scrollConfig.snap = {
          snapTo: [0, 0.5, 1],
          duration: { min: 0.3, max: 0.8 },
          delay: 0.05,
          ease: "power1.inOut"
        };
      }

      gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: scrollConfig,
        onUpdate: render,
      });

      // Fade out scroll indicator on scroll
      gsap.to(".scroll-indicator", {
        opacity: 0,
        y: 25,
        pointerEvents: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "top+=150 top",
          scrub: true,
        }
      });
    }, containerRef);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full object-cover"></canvas>

      {/* Scroll Down Indicator */}
      <div 
        className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3 select-none pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.25em] font-syne font-black text-white/60 uppercase">
          Scroll Down
        </span>
        <div className="w-[26px] h-[42px] border-2 border-white/30 rounded-full flex justify-center pt-2.5 backdrop-blur-[2px]">
          <motion.div 
            animate={{
              y: [0, 14, 0],
              opacity: [1, 0.3, 1]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselHero;
