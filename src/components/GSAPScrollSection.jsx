import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GSAPScrollSection = () => {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        let panels = gsap.utils.toArray(".panel");
        gsap.to(panels, {
          xPercent: -100 * (panels.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            snap: 1 / (panels.length - 1),
            start: "top top",
            end: () => "+=" + scrollContainerRef.current.offsetWidth
          }
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="overflow-hidden bg-bg text-text-light md:h-screen">
      <div ref={scrollContainerRef} className="flex flex-col md:flex-row md:h-screen w-full md:w-[300vw]">

        {/* Panel 1 */}
        <div className="panel w-full md:w-screen h-screen flex flex-col items-center justify-center p-8 relative flex-shrink-0">
          <h2 className="text-5xl md:text-8xl font-syne font-bold text-center mb-4 text-accent uppercase leading-none">Fresh Juice,<br />No Nonsense.</h2>
          <p className="text-xl md:text-2xl font-sans text-center max-w-2xl opacity-80 mt-4 leading-relaxed">
            Coolcane reimagines the everyday drink by bringing structure, cleanliness, and creativity. We transform a basic refreshment into exciting live crushed sugarcane juice blends.
          </p>
          {/* abstract graphic representing cane */}
          <div className="absolute -z-10 opacity-20 transform -rotate-12 scale-150">
            <div className="w-96 h-[800px] bg-accent/30 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Panel 2 */}
        <div className="panel w-full md:w-screen h-screen flex flex-col items-center justify-center p-8 relative flex-shrink-0">
          <h2 className="text-5xl md:text-8xl font-syne font-bold text-center mb-4 text-bg-light uppercase leading-none">Drink Clean.<br />Feel Cool.</h2>
          <p className="text-xl md:text-2xl font-sans text-center max-w-2xl text-bg-light/80 mt-4 leading-relaxed">
            To deliver a clean, refreshing, and consistent live crushed sugarcane juice experience by combining natural ingredients, innovative flavors, and high hygiene standards.
          </p>
          <div className="absolute -z-10 opacity-20 transform rotate-12 scale-110 translate-y-20">
            <div className="w-80 h-[800px] bg-bg-light/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Panel 3 */}
        <div className="panel w-full md:w-screen h-screen flex flex-col items-center justify-center p-8 relative flex-shrink-0">
          <h2 className="text-5xl md:text-8xl font-syne font-bold text-center mb-4 text-star uppercase leading-none">Live Crushed<br />Live Refreshment</h2>
          <p className="text-xl md:text-2xl font-sans text-center max-w-2xl opacity-80 mt-4 mb-8 leading-relaxed">
            Live crushed sugarcane juice is freshly extracted on the spot to deliver pure taste, instant energy, and a truly authentic refreshment experience.
          </p>

        </div>

      </div>
    </section>
  );
};

export default GSAPScrollSection;
