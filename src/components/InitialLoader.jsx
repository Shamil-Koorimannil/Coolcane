import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InitialLoader = ({ onComplete }) => {
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const letters = textRef.current.children;
    
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      }
    });

    gsap.set(letters, { yPercent: 100, opacity: 0 });
    gsap.set(bgRef.current, { scaleY: 1, transformOrigin: 'top' });

    // Ensure scrolling is disabled while loader is active
    document.body.style.overflow = 'hidden';

    tl.to(letters, {
      yPercent: 0,
      opacity: 1,
      duration: 1.2,
      stagger: 0.05,
      ease: "expo.out",
      delay: 0.2
    })
    .to(letters, {
      yPercent: -100,
      opacity: 0,
      duration: 1,
      stagger: 0.04,
      ease: "expo.in",
      delay: 0.8
    })
    .to(bgRef.current, {
      scaleY: 0,
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: () => {
        document.body.style.overflow = 'auto';
      }
    }, "-=0.6");
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [onComplete]);

  const text = "COOLCANE".split('');

  return (
    <div ref={bgRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
      <div className="overflow-hidden flex">
        <h1 ref={textRef} className="text-[11vw] md:text-[9vw] lg:text-[8vw] font-syne font-black text-white uppercase leading-none flex">
          {text.map((char, index) => (
            <span key={index} className="inline-block relative">
              {char}
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
};

export default InitialLoader;
