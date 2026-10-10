import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const Roadmap = () => {
  const containerRef = useRef(null);

  // Scroll animation for the growing timeline line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center']
  });

  // Smooth out the scroll path drawing
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  // Calculate tip position (percentage top) for the leading vehicle head of the line
  const headTopPercent = useTransform(scrollYProgress, (v) => `${Math.min(Math.max(v * 100, 0), 100)}%`);

  // Transform scroll progress to determine vehicle mode at the head of the line
  const vehicleMode = useTransform(scrollYProgress, (v) => {
    if (v < 0.68) return 'dot';
    if (v < 0.87) return 'car';
    return 'plane';
  });

  const timelineItems = [
    {
      year: '1985',
      location: 'Shimla Coolbar',
      subtitle: 'The Original Legacy',
      desc: 'Where the legacy of pure refreshment began. Serving classical cooling blends and planting the seeds of what would become the Coolcane experience.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    {
      year: '2022',
      location: 'Perintalmanna',
      subtitle: 'The Rebirth & Modern Vision',
      desc: 'The official birth of the modern Coolcane identity. Redefining traditional sugarcane juice by introducing strict hygiene, elegant presentation, and natural flavor innovation.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      year: '2024',
      location: 'Calicut beach',
      subtitle: 'Coastline Coolness',
      desc: 'Expanding our footprint to Kozhikode’s iconic beach. Pairing coastal ocean breezes with refreshing, freshly live-crushed sugarcane blends.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-.5A2.5 2.5 0 0113 3.5V2" />
        </svg>
      )
    },
    {
      year: '2024',
      location: 'Perintalmanna (Foodcourt)',
      subtitle: 'Fast-Paced Freshness',
      desc: 'Taking our signature live crushed sugarcane experience to bustling food courts. Delivering rapid, energetic, and clean refreshments for shoppers on the go.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2z" />
        </svg>
      )
    },
    {
      year: '2024',
      location: 'Ashokapuram',
      subtitle: 'Urban Expansion',
      desc: 'Inaugurating a sleek, modern outlet inside Ashokapuram, Kozhikode. Catering directly to students, families, and everyday active routines.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      year: '2025',
      location: 'Malappuram',
      subtitle: 'The Heart of Malabar',
      desc: 'Bringing our pure, revitalizing sugarcane menu to Kizhakkethala, Malappuram. Establishing a vibrant hangout spot built for local youth and busy shoppers.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      year: '2025',
      location: 'Payyambalam Beach',
      subtitle: 'Coastal Kannur Vibe',
      desc: 'Taking our natural refreshment shoreward to Payyambalam Beach, Kannur. Elevating shoreline relaxation with pure, live extracted hydration.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    {
      year: '2025',
      location: 'Thrissur',
      subtitle: 'Cultural Capital Freshness',
      desc: 'Unveiling our high-standard live sugarcane juice bar in Thrissur. Infusing the cultural capital with modern hygiene and vibrant flavor combinations.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      year: '2025',
      location: 'Pattambi',
      subtitle: 'Brand New Horizons',
      desc: 'Expanding our network further into Pattambi. Keeping our promise to deliver live crushed sugarcane juice with premium taste and absolute purity.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      year: '2026',
      location: 'Thrissur, Westfort',
      subtitle: 'Second Outlet in Thrissur',
      desc: 'Expanding our reach with a second landmark outlet at Westfort, Thrissur. Bringing pure, live-crushed sugarcane juice to even more enthusiasts in the cultural capital.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      year: '2026',
      location: 'Bangalore, Madiwala',
      subtitle: 'Interstate Highway Expansion',
      desc: 'Hitting the highway! Crossing state borders to introduce our signature live crushed sugarcane experience to Bangalore at Madiwala.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2.438-4.063A2 2 0 017.152 4h9.696a2 2 0 011.714.937L21 9M3 9v7a1 1 0 001 1h1m16-8v7a1 1 0 01-1 1h-1M3 9h18" />
        </svg>
      )
    },
    {
      year: '2026',
      location: 'Ajman, UAE',
      subtitle: 'Ajman Outlet',
      desc: 'Taking flight across the ocean! Establishing our first international outlet in Ajman, UAE, taking the Coolcane pure refreshment experience global.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-.5A2.5 2.5 0 0113 3.5V2" />
        </svg>
      )
    }
  ];

  return (
    <section id="roadmap" ref={containerRef} className="py-32 bg-bg text-text-light px-4 relative overflow-hidden">
      {/* Background Visuals */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[450px] h-[450px] bg-star/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            className="text-accent font-bold tracking-widest uppercase mb-3 text-sm"
          >
            Our Journey & Expansion
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-syne font-black tracking-tight uppercase"
          >
            How it <span className="text-accent">Began.</span> & Where We’re <span className="text-star">Going.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-light/75 mt-6 leading-relaxed font-sans"
          >
            From a single local cool bar to Kerala's favorite modern sugarcane brand, driving into Bangalore and taking flight to Ajman, UAE.
          </motion.p>
        </div>

        {/* Timeline Flow */}
        <div className="relative">
          
          {/* Base Background Track Line */}
          <div className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1.5 bg-white/10 rounded-full" />
          
          {/* Animated Dynamic Active Scroll Line */}
          <motion.div
            style={{ scaleY }}
            className="absolute left-6 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1.5 bg-gradient-to-b from-accent via-accent via-amber-400 to-sky-400 rounded-full origin-top"
          />

          {/* Dynamic Vehicle Head at the Point of the Line on Scroll */}
          <motion.div
            style={{ top: headTopPercent }}
            className="absolute left-6 md:left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-75"
          >
            <HeadOfLineVehicle vehicleMode={vehicleMode} />
          </motion.div>

          {/* Timeline Items Grid */}
          <div className="space-y-16 md:space-y-24">
            {timelineItems.map((item, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row relative items-start md:items-center justify-between w-full"
                >
                  {/* Timeline Dot Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-120px' }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="w-6 h-6 rounded-full bg-accent border-4 border-bg flex items-center justify-center relative cursor-pointer"
                    >
                      <span className="absolute -inset-2 bg-accent/20 rounded-full animate-ping pointer-events-none" />
                    </motion.div>
                  </div>

                  {/* Left Column (Desktop) */}
                  <div className="w-full md:w-[45%] pl-16 md:pl-0">
                    {isEven ? (
                      <TimelineCard item={item} isEven={isEven} index={idx} />
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>

                  {/* Right Column (Desktop) */}
                  <div className="w-full md:w-[45%] pl-16 md:pl-0">
                    {!isEven ? (
                      <TimelineCard item={item} isEven={isEven} index={idx} />
                    ) : (
                      <div className="hidden md:block" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

// Component rendered right at the leading point/tip of the line on scroll
const HeadOfLineVehicle = ({ vehicleMode }) => {
  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      className="flex items-center justify-center"
    >
      <HeadVehicleContent vehicleMode={vehicleMode} />
    </motion.div>
  );
};

const HeadVehicleContent = ({ vehicleMode }) => {
  // Use React motion / reactive renderer for vehicle head mode
  // 'dot' -> standard glowing orb
  // 'car' -> car driving down
  // 'plane' -> flight soaring down
  const [currentMode, setCurrentMode] = React.useState('dot');

  React.useEffect(() => {
    const unsubscribe = vehicleMode.on('change', (latest) => {
      setCurrentMode(latest);
    });
    return () => unsubscribe();
  }, [vehicleMode]);

  if (currentMode === 'car') {
    return (
      <div className="relative flex items-center justify-center">
        {/* Road headlight glow effect */}
        <div className="absolute -bottom-6 w-12 h-16 bg-gradient-to-b from-amber-300/40 to-transparent blur-md rounded-full pointer-events-none" />
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 border-2 border-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.9)] flex items-center justify-center text-slate-950 text-xl font-bold animate-bounce">
          🚗
        </div>
      </div>
    );
  }

  if (currentMode === 'plane') {
    return (
      <div className="relative flex items-center justify-center">
        {/* Jet contrail / cloud trail effect behind plane */}
        <div className="absolute -top-8 w-1 h-12 bg-gradient-to-t from-sky-300 to-transparent blur-[1px] animate-pulse" />
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 border-2 border-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.95)] flex items-center justify-center text-white text-2xl font-bold rotate-90 animate-pulse">
          ✈️
        </div>
      </div>
    );
  }

  // Standard glowing green dot head for initial timeline
  return (
    <div className="w-6 h-6 rounded-full bg-accent border-2 border-white shadow-[0_0_15px_#8DC63F] flex items-center justify-center relative">
      <span className="absolute -inset-2 bg-accent/30 rounded-full animate-ping pointer-events-none" />
    </div>
  );
};

// Extracted Subcomponent for Timeline Card maintaining consistent glassmorphic styling
const TimelineCard = ({ item, isEven, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ type: 'spring', duration: 0.8, bounce: 0.15, delay: 0.05 }}
      style={{ perspective: 1200 }}
    >
      <motion.div
        whileHover={{
          scale: 1.03,
          rotateY: isEven ? 8 : -8,
          rotateX: 4,
          z: 30,
          boxShadow: '0 25px 50px -12px rgba(141, 198, 63, 0.15)'
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col gap-5 text-left relative overflow-hidden group cursor-pointer"
      >
        {/* Soft corner glow asset inside card */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-colors duration-300 pointer-events-none" />

        {/* Optional Tag badge */}
        {item.tag && (
          <div className="self-start">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/30">
              {item.tag}
            </span>
          </div>
        )}

        {/* Card Header (Year & Icon) */}
        <div className="flex items-center justify-between gap-4">
          <span className="font-syne font-black text-accent text-4xl md:text-5xl tracking-tight leading-none">
            {item.year}
          </span>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-text-dark transition-all duration-300">
            {item.icon}
          </div>
        </div>

        {/* Location & Details */}
        <div>
          <h3 className="font-syne font-black text-xl md:text-2xl text-text-light group-hover:text-accent transition-colors">
            {item.location}
          </h3>
          <p className="text-xs uppercase font-bold tracking-widest text-star mt-1">
            {item.subtitle}
          </p>
          <p className="text-text-light/70 text-sm md:text-base leading-relaxed mt-4 font-sans">
            {item.desc}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Roadmap;

