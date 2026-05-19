import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Franchise = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    investment: ''
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal animation for text
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

      // Card scale-up animation
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

    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // REPLACE THIS URL WITH YOUR ACTUAL GOOGLE APPS SCRIPT URL
    const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 
    
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      
      // We use no-cors for simple Google Apps Script submissions from frontend
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: data,
        mode: 'no-cors' 
      });
      
      setStatus('success');
      setTimeout(() => {
        setShowForm(false);
        setStatus('idle');
        setFormData({ name: '', phone: '', location: '', investment: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form', error);
      setStatus('error');
    }
  };

  return (
    <section id="franchise" ref={containerRef} className="py-24 px-4 bg-bg-light relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>

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
               onClick={() => setShowForm(true)}
               className="px-8 py-4 bg-bg text-text-light font-syne font-bold rounded-full hover:bg-accent hover:text-bg transition-colors duration-300"
             >
               Inquire Now
             </button>
          </div>
        </div>

        {/* Right Side: Franchise Card / Form */}
        <div ref={cardRef} className="flex-1 w-full max-w-md relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div 
                key="card"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-bg text-text-light rounded-3xl p-8 shadow-2xl overflow-hidden group"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <h4 className="text-3xl font-syne font-bold mb-2">Franchise Program</h4>
                 <div className="space-y-4 my-8">
                   <div className="flex items-start space-x-3">
                     <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <p className="font-sans opacity-90">Low initial investment</p>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <p className="font-sans opacity-90">High ROI within 6 to 8 months</p>
                   </div>
                   <div className="flex items-start space-x-3">
                     <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                     </div>
                     <p className="font-sans opacity-90">Complete setup & marketing support</p>
                   </div>
                 </div>
                 
                 <a href="#" className="inline-flex items-center space-x-2 text-accent hover:text-white transition-colors font-syne font-bold relative z-10">
                   <span>Download Brochure</span>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </a>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white border border-black/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-2xl font-syne font-bold text-bg">Franchise Enquiry</h4>
                  <button onClick={() => setShowForm(false)} className="text-bg/50 hover:text-bg transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
                
                {status === 'success' ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h5 className="text-xl font-bold font-syne text-bg">Request Sent!</h5>
                    <p className="text-bg/70 text-sm">Our team will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full px-4 py-3 bg-bg-light border border-black/10 rounded-xl focus:outline-none focus:border-accent text-bg font-sans" />
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-4 py-3 bg-bg-light border border-black/10 rounded-xl focus:outline-none focus:border-accent text-bg font-sans" />
                    <input required type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Preferred City/Location" className="w-full px-4 py-3 bg-bg-light border border-black/10 rounded-xl focus:outline-none focus:border-accent text-bg font-sans" />
                    
                    <select required name="investment" value={formData.investment} onChange={handleInputChange} className="w-full px-4 py-3 bg-bg-light border border-black/10 rounded-xl focus:outline-none focus:border-accent text-bg font-sans appearance-none">
                      <option value="" disabled>Investment Range</option>
                      <option value="10L-15L">₹10 Lakhs - ₹15 Lakhs</option>
                      <option value="15L-25L">₹15 Lakhs - ₹25 Lakhs</option>
                      <option value="25L+">₹25 Lakhs +</option>
                    </select>

                    <button 
                      type="submit" 
                      disabled={status === 'loading'}
                      className="mt-auto w-full py-4 bg-accent text-bg font-syne font-bold rounded-xl hover:bg-bg hover:text-white transition-colors duration-300 disabled:opacity-50 flex justify-center items-center h-[56px]"
                    >
                      {status === 'loading' ? (
                        <div className="w-6 h-6 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        "Submit Enquiry"
                      )}
                    </button>
                    {status === 'error' && <p className="text-red-500 text-xs text-center">Something went wrong. Please try again.</p>}
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default Franchise;
