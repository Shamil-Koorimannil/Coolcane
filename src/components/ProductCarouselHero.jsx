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

    const frameCount = isMobile ? 609 : 287;
    
    const currentFrame = index => {
      if (!isMobile) {
        return `/video-sequence/freepik_a-cinematic-highend-comme_2823566962%20(1)_${1000 + index}.webp`;
      } else {
        if (index <= 303) {
          return `/cane-to-lemon-mob/cane to lemon - mob${String(index).padStart(3, '0')}.webp`;
        } else {
          // 304 to 608 maps to 0 to 304 in melon index
          const melonIndex = index - 304;
          return `/lemon-to-melon-mob/Lemon to melon - mob${String(melonIndex).padStart(3, '0')}.webp`;
        }
      }
    };

    // Set a reasonable landing frame count to load fast, then stream the rest
    const landingFrameCount = isMobile 
      ? Math.min(80, frameCount) 
      : Math.min(100, frameCount);

    const images = new Array(frameCount);
    const sequence = { frame: 0 };
    const preloadingTracker = {};

    const render = () => {
      const img = images[sequence.frame];
      if (!img || !img.complete) {
        // Fallback: search for the closest loaded frame to prevent black flicker/jerkiness
        let closestImg = null;
        let minDiff = Infinity;
        for (let i = 0; i < frameCount; i++) {
          if (images[i] && images[i].complete) {
            const diff = Math.abs(i - sequence.frame);
            if (diff < minDiff) {
              minDiff = diff;
              closestImg = images[i];
            }
          }
        }
        if (closestImg) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(closestImg, 0, 0, canvas.width, canvas.height);
        }
        return;
      }
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height); 
    };

    const preloadFrame = (i) => {
      if (preloadingTracker[i]) return;
      preloadingTracker[i] = 'loading';
      
      const img = new Image();
      img.onload = () => {
        preloadingTracker[i] = 'loaded';
        images[i] = img;
        if (Math.round(sequence.frame) === i) {
          render();
        }
      };
      img.onerror = () => {
        preloadingTracker[i] = 'error';
        console.error(`[Preload] Failed to load dynamic frame: ${i} (src: ${currentFrame(i)})`);
      };
      img.src = currentFrame(i);
    };

    let currentBackgroundIndex = landingFrameCount;
    let backgroundStarted = false;

    const startSequentialBackgroundLoading = () => {
      if (backgroundStarted) return;
      backgroundStarted = true;
      
      const loadNext = () => {
        if (currentBackgroundIndex >= frameCount) {
          console.log("[Preload] Sequential background loading complete!");
          return;
        }
        const i = currentBackgroundIndex;
        currentBackgroundIndex++;
        
        if (preloadingTracker[i]) {
          setTimeout(loadNext, 5);
          return;
        }
        
        preloadingTracker[i] = 'loading';
        const img = new Image();
        img.onload = () => {
          preloadingTracker[i] = 'loaded';
          images[i] = img;
          loadNext();
        };
        img.onerror = () => {
          preloadingTracker[i] = 'error';
          console.error(`[Preload] Failed to load background frame: ${i} (src: ${currentFrame(i)})`);
          loadNext();
        };
        img.src = currentFrame(i);
      };
      
      loadNext();
    };

    let loadedLandingCount = 0;
    const onLandingImageLoadOrError = (index, success) => {
      preloadingTracker[index] = success ? 'loaded' : 'error';
      loadedLandingCount++;
      const progressPercent = Math.min(Math.round((loadedLandingCount / landingFrameCount) * 100), 100);
      
      window.heroFramesProgress = progressPercent;
      window.dispatchEvent(new CustomEvent('hero-frames-progress', { detail: progressPercent }));
      
      if (index === 0 && success) {
        render();
      }

      if (progressPercent === 100) {
        console.log("[Loader] Initial landing frames 100% loaded. Starting progressive preloading.");
        // Preload immediate next 40 frames first for buffer
        const endRange = Math.min(frameCount - 1, landingFrameCount + 40);
        for (let i = landingFrameCount; i <= endRange; i++) {
          preloadFrame(i);
        }
        // Start background sequential stream
        startSequentialBackgroundLoading();
      }
    };

    // Preload landing images first
    console.log(`[Preload] Preloading ${landingFrameCount} landing frames out of ${frameCount}...`);
    for (let i = 0; i < landingFrameCount; i++) {
      preloadingTracker[i] = 'loading';
      const img = new Image();
      img.onload = () => onLandingImageLoadOrError(i, true);
      img.onerror = () => {
        console.error(`[Preload] Failed to load landing frame: ${i} (src: ${currentFrame(i)})`);
        onLandingImageLoadOrError(i, false);
      };
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
        onUpdate: (self) => {
          const currentFrameVal = Math.round(sequence.frame);
          const velocity = Math.abs(self.getVelocity());
          
          // Dynamically load more frames based on speed/velocity
          const lookAhead = Math.max(40, Math.min(150, Math.round(velocity * 0.08)));
          const direction = self.direction; // 1 = forward, -1 = backward
          
          if (direction >= 0) {
            const start = currentFrameVal;
            const end = Math.min(frameCount - 1, currentFrameVal + lookAhead);
            for (let i = start; i <= end; i++) {
              preloadFrame(i);
            }
          } else {
            const start = Math.max(0, currentFrameVal - lookAhead);
            const end = currentFrameVal;
            for (let i = start; i <= end; i++) {
              preloadFrame(i);
            }
          }
        }
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
