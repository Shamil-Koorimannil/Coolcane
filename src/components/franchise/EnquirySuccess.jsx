import React from 'react';
import { motion } from 'framer-motion';
import companyProfilePdf from '../../assets/cool cane Company profile.pdf';

const EnquirySuccess = ({ fullName, onVisitWebsite, submissionResult }) => {
  const profileUrl = import.meta.env.VITE_COMPANY_PROFILE_URL || companyProfilePdf || '/CoolCane-Company-Profile.pdf';
  const mainWebsiteUrl = import.meta.env.VITE_MAIN_WEBSITE_URL || '/';

  const handleDownloadProfile = () => {
    const link = document.createElement('a');
    link.href = profileUrl;
    link.download = 'CoolCane-Company-Profile.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVisitWebsite = () => {
    if (onVisitWebsite) {
      onVisitWebsite();
    } else if (mainWebsiteUrl.startsWith('http')) {
      window.location.href = mainWebsiteUrl;
    } else {
      window.location.href = '/';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.8, bounce: 0.2 }}
      className="w-full max-w-xl mx-auto py-8 text-center flex flex-col items-center space-y-8"
    >
      {/* Animated Checkmark Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center text-accent shadow-[0_0_40px_rgba(141,198,63,0.3)] relative"
      >
        <svg className="w-12 h-12 sm:w-14 sm:h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>

        {/* Pulse rings */}
        <span className="absolute -inset-3 rounded-full bg-accent/10 animate-ping pointer-events-none" />
      </motion.div>

      {/* Main Success Headers */}
      <div className="space-y-3">
        <h1 className="text-4xl sm:text-6xl font-syne font-black text-text-light tracking-tight">
          Thank you!
        </h1>
        <h2 className="text-xl sm:text-2xl font-syne font-bold text-accent">
          Our Team will connect with you soon.
        </h2>
      </div>

      {/* Supporting Copy */}
      <p className="text-base sm:text-lg font-sans text-text-light/80 leading-relaxed max-w-lg">
        Thank you for your interest in becoming a CoolCane franchise partner. We have received your enquiry and our team will connect with you soon.
      </p>

      {/* Demo Mode Notice (Active only during simulated development tests) */}
      {submissionResult?.mode === 'demo' && (
        <div className="w-full max-w-md mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono text-left space-y-1.5 shadow-lg">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>DEVELOPMENT DEMO MODE SIMULATION</span>
          </div>
          <p className="text-[12px] text-amber-100">
            Calculated Lead Priority: <span className="font-bold text-slate-950 px-2 py-0.5 rounded bg-accent">{submissionResult.priority}</span>
          </p>
          <p className="text-[11px] text-amber-300/80 pt-0.5 leading-relaxed">
            Note: This enquiry was processed in Demo Mode and was <strong>NOT</strong> sent to Getlead CRM. To enable live submissions, configure your real <code className="text-white bg-black/40 px-1 py-0.5 rounded">GETLEAD_API_KEY</code>.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Button 1 — Download Company Profile */}
        <button
          onClick={handleDownloadProfile}
          className="w-full sm:w-auto px-8 py-4 bg-accent text-slate-950 font-syne font-bold rounded-full hover:bg-white hover:text-slate-950 transition-all duration-300 shadow-xl flex items-center justify-center gap-2.5 cursor-pointer text-sm sm:text-base"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download Company Profile</span>
        </button>

        {/* Button 2 — Visit Main Website */}
        <button
          onClick={handleVisitWebsite}
          className="w-full sm:w-auto px-8 py-4 bg-white/10 text-text-light font-syne font-bold rounded-full border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
        >
          <span>Visit CoolCane Website</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default EnquirySuccess;
