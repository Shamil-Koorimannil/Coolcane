import React from 'react';
import { motion } from 'framer-motion';

const ProgressIndicator = ({ currentStep, totalSteps = 6 }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-xl mx-auto mb-8 sm:mb-12">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs sm:text-sm font-syne font-bold uppercase tracking-widest text-accent">
          Question {currentStep} of {totalSteps}
        </span>
        <span className="text-xs sm:text-sm font-sans font-semibold text-text-light/60">
          {Math.round(progressPercent)}% Completed
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden relative shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="h-full bg-gradient-to-r from-accent via-accent to-emerald-400 rounded-full relative"
        >
          {/* Subtle pulse glow on the tip of the progress bar */}
          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_10px_#ffffff] animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
