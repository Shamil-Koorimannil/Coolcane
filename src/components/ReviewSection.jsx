import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Suvarna Shiva",
    text: "I absolutely loved the sugarcane-shaped juice box.. Fun!! Hehe. We also tried the mango mix, and it was super tasty. I’ll definitely be having a lot more of that in the future!",
    image: "", // Add profile image URL here
  },
  {
    id: 2,
    name: "Kenz Mohammed",
    text: "They have interesting verities of sugarcane juice. Tried ginger and lemon and both were simple and good. A quick thirst quencher!",
    image: "",
  },
  {
    id: 3,
    name: "Rinshid Rinu",
    text: "A nice shop near the beach side. They are providing a variety of sugar cane juices and popcorns. Their branding and their bottles attracts more people. Recommended - Plain and lemonade sugarcane juices.",
    image: "",
  },
  {
    id: 4,
    name: "Mohamed Akarath",
    text: "Excellent juice n service Enjoyed",
    image: "",
  }
];

const ReviewSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextReview = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === reviews.length - 1 ? 0 : prevIndex + 1));
  };

  const prevReview = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? reviews.length - 1 : prevIndex - 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextReview();
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (direction) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.95,
        transition: {
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.4 },
          scale: { duration: 0.4 }
        }
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <section id="reviews" className="relative w-full py-32 bg-[var(--color-bg-light)] text-[var(--color-text-dark)] overflow-hidden flex flex-col items-center justify-center min-h-[80vh]">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
        <h2 className="text-[20vw] font-black leading-none whitespace-nowrap text-[var(--color-text-dark)] uppercase tracking-tighter mix-blend-multiply opacity-10">
          Reviews
        </h2>
      </div>

      <div className="container mx-auto px-6 relative z-10 w-full max-w-5xl">
        <div className="flex flex-col items-center mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex gap-2 mb-6"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-[var(--color-accent)] text-[var(--color-accent)] drop-shadow-md" />
            ))}
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium tracking-widest uppercase text-[var(--color-accent)] mb-2"
          >
            Google Maps Reviews
          </motion.p>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black tracking-tight font-['Syne']"
          >
            What They Say
          </motion.h3>
        </div>

        <div className="relative h-[400px] md:h-[300px] w-full flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);

                if (swipe < -swipeConfidenceThreshold) {
                  nextReview();
                } else if (swipe > swipeConfidenceThreshold) {
                  prevReview();
                }
              }}
              className="absolute w-full flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing"
            >
              <Quote className="w-16 h-16 md:w-24 md:h-24 text-[var(--color-accent)] opacity-20 absolute -top-8 md:-top-12 -left-4 md:left-10 rotate-180" />
              
              <h4 className="text-2xl md:text-4xl lg:text-5xl font-['Syne'] leading-tight md:leading-snug font-medium mb-8 max-w-4xl">
                "{reviews[currentIndex].text}"
              </h4>
              
              <div className="flex items-center gap-4">
                {reviews[currentIndex].image ? (
                  <img 
                    src={reviews[currentIndex].image} 
                    alt={reviews[currentIndex].name} 
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-12 h-12 rounded-full bg-[var(--color-text-dark)] flex items-center justify-center text-[var(--color-bg-light)] text-xl font-bold font-['Syne']"
                  style={{ display: reviews[currentIndex].image ? 'none' : 'flex' }}
                >
                  {reviews[currentIndex].name.charAt(0)}
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-lg md:text-xl font-bold">{reviews[currentIndex].name}</span>
                  <span className="text-sm opacity-60">Local Guide</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center items-center gap-8 mt-12">
          <button 
            onClick={prevReview}
            className="w-14 h-14 rounded-full border border-[var(--color-text-dark)] flex items-center justify-center hover:bg-[var(--color-text-dark)] hover:text-[var(--color-bg-light)] transition-all duration-300 group"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="flex gap-3">
            {reviews.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentIndex 
                    ? 'bg-[var(--color-accent)] w-8' 
                    : 'bg-[var(--color-text-dark)] opacity-20 hover:opacity-50'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={nextReview}
            className="w-14 h-14 rounded-full border border-[var(--color-text-dark)] flex items-center justify-center hover:bg-[var(--color-text-dark)] hover:text-[var(--color-bg-light)] transition-all duration-300 group"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;
