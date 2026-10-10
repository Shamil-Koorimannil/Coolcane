import React from 'react';
import { motion } from 'framer-motion';

const ChoiceQuestion = ({
  questionNumber,
  questionText,
  subtitle,
  options,
  selectedValue,
  onSelectOption,
  otherValue,
  onOtherValueChange,
  error
}) => {
  return (
    <div className="w-full max-w-xl mx-auto flex flex-col space-y-6">
      <div className="text-left space-y-2">
        <h2 className="text-2xl sm:text-4xl font-syne font-black text-text-light leading-tight">
          {questionText}
        </h2>
        {subtitle && (
          <p className="text-sm sm:text-base text-text-light/70 font-sans">
            {subtitle}
          </p>
        )}
      </div>

      {/* Choice Selection Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {options.map((optionText, idx) => {
          const isSelected = selectedValue === optionText || (optionText === 'Other' && selectedValue?.startsWith('Other'));

          return (
            <div key={idx} className="flex flex-col">
              <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectOption(optionText)}
                className={`w-full p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-accent/20 border-accent text-text-light shadow-[0_0_20px_rgba(141,198,63,0.2)]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-text-light/80 hover:text-text-light'
                }`}
              >
                <div className="flex items-center space-x-3.5 sm:space-x-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-accent bg-accent text-slate-950' : 'border-white/30 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    )}
                  </div>
                  <span className="text-base sm:text-lg font-syne font-bold">
                    {optionText}
                  </span>
                </div>

                {isSelected && (
                  <span className="text-xs font-syne font-bold uppercase tracking-wider text-accent bg-accent/20 px-3 py-1 rounded-full border border-accent/30">
                    Selected
                  </span>
                )}
              </motion.button>

              {/* Text box when selecting Other */}
              {optionText === 'Other' && isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2.5 px-1"
                >
                  <input
                    type="text"
                    value={otherValue || ''}
                    onChange={(e) => onOtherValueChange && onOtherValueChange(e.target.value)}
                    placeholder="Please specify your occupation"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 focus:border-accent rounded-xl text-text-light placeholder:text-text-light/40 text-base font-sans focus:outline-none focus:ring-2 focus:ring-accent/30 shadow-inner"
                    autoFocus
                  />
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm font-sans font-medium pt-1 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
};

export default ChoiceQuestion;
