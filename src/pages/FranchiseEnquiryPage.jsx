import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { isValidPhoneNumber } from 'react-phone-number-input';
import logo from '../assets/Coolcane logo.svg';

import ProgressIndicator from '../components/franchise/ProgressIndicator';
import TextQuestion from '../components/franchise/TextQuestion';
import PhoneQuestion from '../components/franchise/PhoneQuestion';
import ChoiceQuestion from '../components/franchise/ChoiceQuestion';
import EnquirySuccess from '../components/franchise/EnquirySuccess';
import { submitFranchiseEnquiry, getFranchiseIntegrationStatus } from '../services/franchiseService';

const DRAFT_STORAGE_KEY = 'coolcane_franchise_draft';

const INITIAL_FORM_DATA = {
  fullName: '',
  phoneNumber: '',
  countryCode: '+91',
  occupation: '',
  otherOccupation: '',
  preferredLocation: '',
  openingTimeline: '',
  investmentReadiness: ''
};

const FranchiseEnquiryPage = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Restore draft state if available
  const [formData, setFormData] = useState(() => {
    try {
      const savedDraft = sessionStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        return { ...INITIAL_FORM_DATA, ...JSON.parse(savedDraft) };
      }
    } catch (e) {
      console.error('Failed to parse draft from sessionStorage', e);
    }
    return INITIAL_FORM_DATA;
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [integrationMode, setIntegrationMode] = useState('unknown');
  const [submissionResult, setSubmissionResult] = useState(null);

  // Fetch integration status to detect demo vs live mode
  useEffect(() => {
    getFranchiseIntegrationStatus()
      .then((res) => {
        if (res && res.mode) setIntegrationMode(res.mode);
      })
      .catch(() => {});
  }, []);

  // Sync draft to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to save draft to sessionStorage', e);
    }
  }, [formData]);

  // Focus input when entering step 1, 2, or 4
  useEffect(() => {
    setValidationError('');
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [currentStep]);

  // Validate step before advancing
  const validateStep = (step) => {
    setValidationError('');

    if (step === 1) {
      if (!formData.fullName || !formData.fullName.trim()) {
        setValidationError('Please enter your full name to proceed.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.phoneNumber) {
        setValidationError('Please enter your contact number to proceed.');
        return false;
      }
      if (!isValidPhoneNumber(formData.phoneNumber)) {
        setValidationError('Please enter a valid international contact number.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.occupation) {
        setValidationError('Please select your current occupation.');
        return false;
      }
      if (formData.occupation === 'Other' || formData.occupation.startsWith('Other')) {
        if (!formData.otherOccupation || !formData.otherOccupation.trim()) {
          setValidationError('Please specify your occupation in the text box.');
          return false;
        }
      }
    } else if (step === 4) {
      if (!formData.preferredLocation || !formData.preferredLocation.trim()) {
        setValidationError('Please enter your preferred location.');
        return false;
      }
    } else if (step === 5) {
      if (!formData.openingTimeline) {
        setValidationError('Please select your preferred timeline.');
        return false;
      }
    } else if (step === 6) {
      if (!formData.investmentReadiness) {
        setValidationError('Please select your investment readiness.');
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 6) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setValidationError('');
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleOptionSelect = (fieldName, optionValue) => {
    setFormData((prev) => ({ ...prev, [fieldName]: optionValue }));
    setValidationError('');
  };

  const handleFinalSubmit = async () => {
    if (!validateStep(6)) return;
    if (isSubmitting) return; // Prevent duplicate clicks

    setIsSubmitting(true);
    setSubmitError('');

    // Format occupation payload if Other was selected
    const submissionData = {
      ...formData,
      occupation:
        formData.occupation === 'Other' || formData.occupation.startsWith('Other')
          ? `Other: ${formData.otherOccupation.trim()}`
          : formData.occupation
    };

    try {
      const result = await submitFranchiseEnquiry(submissionData);
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      setSubmissionResult(result);
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Responsive slide animation variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-bg text-text-light relative overflow-x-hidden flex flex-col justify-between selection:bg-accent selection:text-bg">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[160px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between relative z-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Coolcane Logo" className="h-10 sm:h-12 w-auto object-contain" />
        </Link>

        <Link
          to="/"
          className="text-xs sm:text-sm font-syne font-bold uppercase tracking-wider text-text-light/70 hover:text-accent transition-colors flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full border border-white/10 hover:border-accent/40 bg-white/5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Questionnaire Container */}
      <main className="flex-1 flex flex-col justify-center px-4 py-6 sm:py-12 relative z-10 w-full overflow-x-hidden">
        {!isSubmitted ? (
          <div className="w-full max-w-2xl mx-auto px-1 sm:px-0">
            {/* Demo Mode Notice Banner during Development */}
            {integrationMode === 'demo' && (
              <div className="w-full max-w-xl mx-auto mb-4 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-between shadow-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>DEMO MODE: Submissions are simulated. CRM credentials not active.</span>
                </span>
                <span className="text-[10px] opacity-75 hidden sm:inline uppercase tracking-wider font-bold text-amber-400">Dev Mode</span>
              </div>
            )}

            {/* Progress Bar */}
            <ProgressIndicator currentStep={currentStep} totalSteps={6} />

            {/* Slide-animated Question Card with Overflow Protection */}
            <div className="relative min-h-[380px] sm:min-h-[420px] flex flex-col justify-between w-full overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentStep}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full"
                >
                  {currentStep === 1 && (
                    <TextQuestion
                      questionNumber={1}
                      questionText="What is your full name?"
                      subtitle="Tell us who we are speaking with."
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(val) => setFormData((prev) => ({ ...prev, fullName: val }))}
                      onKeyDown={handleKeyDown}
                      error={validationError}
                      inputRef={inputRef}
                    />
                  )}

                  {currentStep === 2 && (
                    <PhoneQuestion
                      value={formData.phoneNumber}
                      onChange={(val) => setFormData((prev) => ({ ...prev, phoneNumber: val || '' }))}
                      onKeyDown={handleKeyDown}
                      error={validationError}
                      inputRef={inputRef}
                    />
                  )}

                  {currentStep === 3 && (
                    <ChoiceQuestion
                      questionNumber={3}
                      questionText="What is your current occupation?"
                      subtitle="Help us understand your background."
                      options={[
                        'Business owner',
                        'Salaried employee',
                        'Self-employed / Freelancer',
                        'Investor',
                        'Other'
                      ]}
                      selectedValue={formData.occupation}
                      onSelectOption={(val) => handleOptionSelect('occupation', val)}
                      otherValue={formData.otherOccupation}
                      onOtherValueChange={(val) => setFormData((prev) => ({ ...prev, otherOccupation: val }))}
                      error={validationError}
                    />
                  )}

                  {currentStep === 4 && (
                    <TextQuestion
                      questionNumber={4}
                      questionText="In which city or location are you planning to open your franchise?"
                      subtitle="Enter your target location in India or abroad."
                      placeholder="Enter your preferred city or location"
                      value={formData.preferredLocation}
                      onChange={(val) => setFormData((prev) => ({ ...prev, preferredLocation: val }))}
                      onKeyDown={handleKeyDown}
                      error={validationError}
                      inputRef={inputRef}
                    />
                  )}

                  {currentStep === 5 && (
                    <ChoiceQuestion
                      questionNumber={5}
                      questionText="When are you planning to start your franchise?"
                      subtitle="Select your preferred launch timeline."
                      options={[
                        'Within 2 months',
                        'Within 6 months',
                        'Within 1 year',
                        'More than 1 year',
                        'Just exploring opportunities'
                      ]}
                      selectedValue={formData.openingTimeline}
                      onSelectOption={(val) => handleOptionSelect('openingTimeline', val)}
                      error={validationError}
                    />
                  )}

                  {currentStep === 6 && (
                    <ChoiceQuestion
                      questionNumber={6}
                      questionText="Are you ready to invest ₹10 lakh in a CoolCane franchise?"
                      subtitle="Minimum target investment for store machinery, branding, and full launch."
                      options={[
                        'Yes, I am ready to invest ₹10 lakh',
                        'No, my budget is below ₹10 lakh.'
                      ]}
                      selectedValue={formData.investmentReadiness}
                      onSelectOption={(val) => handleOptionSelect('investmentReadiness', val)}
                      error={validationError}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="w-full max-w-xl mx-auto pt-8 sm:pt-10 flex items-center justify-between border-t border-white/10 mt-6 sm:mt-8">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-syne font-bold text-text-light/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-slate-950 font-syne font-bold rounded-full hover:bg-white transition-all duration-300 shadow-xl flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                  >
                    <span>Continue</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-slate-950 font-syne font-bold rounded-full hover:bg-white transition-all duration-300 shadow-xl flex items-center gap-2 disabled:opacity-50 cursor-pointer text-xs sm:text-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Application</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>

              {submitError && (
                <div className="pt-3 text-center space-y-2">
                  <p className="text-red-400 text-sm font-sans font-medium">
                    {submitError}
                  </p>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-syne font-bold text-accent bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Retry Submission</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EnquirySuccess
            fullName={formData.fullName}
            submissionResult={submissionResult}
            onVisitWebsite={() => navigate('/')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-text-light/40 font-sans border-t border-white/5 relative z-20">
        © {new Date().getFullYear()} CoolCane Beverages. All rights reserved.
      </footer>
    </div>
  );
};

export default FranchiseEnquiryPage;
