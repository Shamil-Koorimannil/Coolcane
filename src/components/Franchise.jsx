import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const formatCustomDate = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const strHours = String(hours).padStart(2, '0');

  return `${day}/${month}/${year}, ${strHours}:${minutes}:${seconds} ${ampm}`;
};

const Franchise = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);

  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [formData, setFormData] = useState({
    name: '',
    countryCode: '+91',
    phone: '',
    location: '',
    agreedToInvestment: false
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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep === 1 && !formData.name.trim()) return;
    if (currentStep === 2 && !formData.phone.trim()) return;
    if (currentStep === 3 && !formData.location.trim()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    setShowForm(false);
    setCurrentStep(1);
    setStatus('idle');
    setFormData({ name: '', countryCode: '+91', phone: '', location: '', agreedToInvestment: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedToInvestment) return;

    setStatus('loading');

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrqv5SGVW4D4zM6YfpbZvSSCjtKTFEALQFUDlu1QbDJsSIC89-Qj_S0kNt5g7Zmk19wQ/exec';

    try {
      const fullPhone = `${formData.countryCode} ${formData.phone.trim()}`;
      const data = new FormData();
      data.append('SubmittedAt', formatCustomDate());
      data.append('Name', formData.name);
      data.append('Phone', fullPhone);
      data.append('Location', formData.location);
      data.append('Minimum Investment Acknowledged', 'Yes (₹10 Lakhs)');

      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: data
      });

      setStatus('success');
      setTimeout(() => {
        resetForm();
      }, 4000);
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
              onClick={() => { setShowForm(true); setCurrentStep(1); }}
              className="px-8 py-4 bg-bg text-text-light font-syne font-bold rounded-full hover:bg-accent hover:text-bg transition-colors duration-300 shadow-lg"
            >
              Inquire Now
            </button>
          </div>
        </div>

        {/* Right Side: Franchise Card / Interactive Q&A Flow */}
        <div ref={cardRef} className="flex-1 w-full max-w-md relative min-h-[480px]">
          <AnimatePresence mode="wait">
            {!showForm ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, rotateY: -90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: 90 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-bg text-text-light rounded-3xl p-8 shadow-2xl overflow-hidden group flex flex-col justify-between"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div>
                  <h4 className="text-3xl font-syne font-bold mb-2">Franchise Program</h4>
                  <div className="space-y-4 my-8">
                    <div className="flex items-start space-x-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <p className="font-sans opacity-90">Minimum Investment: <strong>₹10 Lakhs</strong></p>
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
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setShowForm(true); setCurrentStep(1); }}
                    className="inline-flex items-center space-x-2 text-accent hover:text-white transition-colors font-syne font-bold"
                  >
                    <span>Start Questionnaire</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qa-box"
                initial={{ opacity: 0, rotateY: 90 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0, rotateY: -90 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 bg-white text-text-dark border border-black/10 rounded-3xl p-8 shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                {/* Header & Step Indicator */}
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <div>
                    <h4 className="text-xl font-syne font-bold text-text-dark">Franchise Inquiry</h4>
                    {status !== 'success' && (
                      <p className="text-xs text-gray-600 font-sans font-medium mt-0.5">Step {currentStep} of 4</p>
                    )}
                  </div>
                  <button onClick={resetForm} className="text-gray-400 hover:text-text-dark transition-colors p-1" aria-label="Close">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                {/* Status: Success */}
                {status === 'success' ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#143601" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <h5 className="text-2xl font-bold font-syne text-text-dark">Application Submitted!</h5>
                    <p className="text-gray-700 text-sm max-w-xs leading-relaxed">
                      Thank you, <strong className="text-text-dark">{formData.name}</strong>. Your inquiry has been logged into our system. Our team will call you at <strong className="text-text-dark">{formData.phone}</strong> soon.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col justify-between py-4">
                    {/* Q&A Steps */}
                    <AnimatePresence mode="wait">
                      {currentStep === 1 && (
                        <motion.div 
                          key="step1" 
                          initial={{ x: 20, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          exit={{ x: -20, opacity: 0 }}
                          className="space-y-4"
                        >
                          <label className="block text-lg font-syne font-bold text-text-dark">
                            1. What is your full name?
                          </label>
                          <input 
                            autoFocus
                            required 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                            placeholder="Enter your name" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-accent text-text-dark placeholder:text-gray-400 font-sans text-base" 
                          />
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div 
                          key="step2" 
                          initial={{ x: 20, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          exit={{ x: -20, opacity: 0 }}
                          className="space-y-4"
                        >
                          <label className="block text-lg font-syne font-bold text-text-dark">
                            2. What is your phone number?
                          </label>
                          <div className="flex gap-2">
                            <select 
                              name="countryCode"
                              value={formData.countryCode}
                              onChange={handleInputChange}
                              className="px-3 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-accent text-text-dark font-sans text-sm font-semibold cursor-pointer"
                            >
                              <option value="+91">🇮🇳 +91</option>
                              <option value="+971">🇦🇪 +971</option>
                              <option value="+966">🇸🇦 +966</option>
                              <option value="+974">🇶🇦 +974</option>
                              <option value="+965">🇰🇼 +965</option>
                              <option value="+968">🇴🇲 +968</option>
                              <option value="+973">🇧🇭 +973</option>
                              <option value="+1">🇺🇸 +1</option>
                              <option value="+44">🇬🇧 +44</option>
                              <option value="+65">🇸🇬 +65</option>
                              <option value="+60">🇲🇾 +60</option>
                              <option value="+61">🇦🇺 +61</option>
                            </select>
                            <input 
                              autoFocus
                              required 
                              type="tel" 
                              name="phone" 
                              value={formData.phone} 
                              onChange={handleInputChange} 
                              placeholder="Enter mobile number" 
                              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-accent text-text-dark placeholder:text-gray-400 font-sans text-base" 
                            />
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 3 && (
                        <motion.div 
                          key="step3" 
                          initial={{ x: 20, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          exit={{ x: -20, opacity: 0 }}
                          className="space-y-4"
                        >
                          <label className="block text-lg font-syne font-bold text-text-dark">
                            3. What is your preferred franchise location?
                          </label>
                          <input 
                            autoFocus
                            required 
                            type="text" 
                            name="location" 
                            value={formData.location} 
                            onChange={handleInputChange} 
                            placeholder="City / State / Area" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:border-accent text-text-dark placeholder:text-gray-400 font-sans text-base" 
                          />
                        </motion.div>
                      )}

                      {currentStep === 4 && (
                        <motion.div 
                          key="step4" 
                          initial={{ x: 20, opacity: 0 }} 
                          animate={{ x: 0, opacity: 1 }} 
                          exit={{ x: -20, opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                            <h5 className="font-syne font-bold text-text-dark text-base flex items-center gap-2">
                              <span className="text-xl">💰</span> Minimum Investment Notice
                            </h5>
                            <p className="text-sm font-sans text-gray-700 mt-1 leading-relaxed">
                              Starting a Coolcane Franchise requires a minimum investment of <strong className="text-text-dark font-bold">₹10 Lakhs</strong> (includes equipment, branding & setup support).
                            </p>
                          </div>

                          <label className="flex items-start space-x-3 cursor-pointer pt-2">
                            <input 
                              type="checkbox" 
                              name="agreedToInvestment"
                              checked={formData.agreedToInvestment}
                              onChange={handleInputChange}
                              className="mt-1 w-5 h-5 accent-bg rounded border-gray-300"
                            />
                            <span className="text-sm font-sans text-gray-800 leading-tight">
                              I understand and confirm that I have a minimum budget of <strong className="text-text-dark font-bold">₹10 Lakhs</strong> to proceed with this franchise application.
                            </span>
                          </label>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-4">
                      {currentStep > 1 ? (
                        <button 
                          type="button" 
                          onClick={handlePrev}
                          className="px-4 py-2 text-sm font-syne font-bold text-gray-700 hover:text-text-dark transition-colors"
                        >
                          ← Back
                        </button>
                      ) : <div />}

                      {currentStep < 4 ? (
                        <button 
                          type="button" 
                          onClick={handleNext}
                          disabled={
                            (currentStep === 1 && !formData.name.trim()) ||
                            (currentStep === 2 && !formData.phone.trim()) ||
                            (currentStep === 3 && !formData.location.trim())
                          }
                          className="px-6 py-3 bg-bg text-text-light font-syne font-bold rounded-xl hover:bg-accent hover:text-bg transition-colors disabled:opacity-40"
                        >
                          Next →
                        </button>
                      ) : (
                        <button 
                          type="button" 
                          onClick={handleSubmit}
                          disabled={!formData.agreedToInvestment || status === 'loading'}
                          className="px-6 py-3 bg-accent text-bg font-syne font-bold rounded-xl hover:bg-bg hover:text-white transition-colors disabled:opacity-40 flex items-center justify-center gap-2 min-w-[140px]"
                        >
                          {status === 'loading' ? (
                            <div className="w-5 h-5 border-2 border-bg border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            "Submit Application"
                          )}
                        </button>
                      )}
                    </div>
                    {status === 'error' && <p className="text-red-600 text-xs text-center font-medium mt-2">Something went wrong. Please try again.</p>}
                  </div>
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
