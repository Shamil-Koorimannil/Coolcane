import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    const images = [];
    const sequence = { frame: 0 };

    // Preload images
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    const render = () => {
      const img = images[sequence.frame];
      if (!img || !img.complete) return;
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height); 
    };

    images[0].onload = render;

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
    </section>
  );
};

export default ProductCarouselHero;
