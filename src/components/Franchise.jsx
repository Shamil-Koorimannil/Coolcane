import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Franchise = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for text
      if (textRef.current) {
        gsap.fromTo(textRef.current.children,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            }
          }
        );
      }

      // Card scale-up animation
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { scale: 0.8, opacity: 0, y: 50 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
            }
          }
        );
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleNavigateEnquiry = () => {
    navigate('/franchise-enquiry');
  };

  return (
    <section id="franchise" ref={containerRef} className="py-24 px-4 bg-bg-light relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">

        {/* Left Side: Text */}
        <div ref={textRef} className="flex-1 space-y-6">
          <h2 className="text-sm uppercase tracking-[0.2em] font-sans text-bg font-bold">
            Join the Family
          </h2>
          <h3 className="text-4xl md:text-6xl font-syne font-black text-bg leading-tight">
            Start Your Own Coolcane Journey.
          </h3>
          <p className="text-lg md:text-xl font-sans text-bg/80 max-w-lg">
            We are looking for passionate partners to expand the true taste of pure sugarcane juice across the country. Get our unique bottle designs, cold-press machineries, and full operational support.
          </p>
          <div className="pt-4">
            <button
              onClick={handleNavigateEnquiry}
              className="px-8 py-4 bg-bg text-text-light font-syne font-bold rounded-full hover:bg-accent hover:text-bg transition-colors duration-300 shadow-lg cursor-pointer flex items-center gap-3 group"
            >
              <span>Explore Franchise Opportunities</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side: Franchise Program Summary Card */}
        <div ref={cardRef} className="flex-1 w-full max-w-md relative min-h-[420px]">
          <div className="bg-bg text-text-light rounded-3xl p-8 shadow-2xl overflow-hidden group flex flex-col justify-between border border-white/10 h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div>
              <span className="inline-block text-xs font-syne font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/30 mb-4">
                Franchise Program
              </span>
              <h4 className="text-3xl font-syne font-black mb-6 text-text-light">
                Partner With Coolcane
              </h4>

              <div className="space-y-4 my-6">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-slate-950">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="font-sans text-text-light/90 text-base">Minimum Investment: <strong className="text-accent font-bold">₹10 Lakhs</strong></p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-slate-950">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="font-sans text-text-light/90 text-base">High ROI within 6 to 8 months</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center text-slate-950">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <p className="font-sans text-text-light/90 text-base">Complete machinery, setup & marketing support</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={handleNavigateEnquiry}
                className="w-full py-4 bg-accent text-slate-950 hover:bg-white transition-colors duration-300 font-syne font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
              >
                <span>Explore Franchise Opportunities</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Franchise;
