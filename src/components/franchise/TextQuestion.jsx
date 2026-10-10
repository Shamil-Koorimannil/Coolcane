import React from 'react';
import { motion } from 'framer-motion';

const TextQuestion = ({
  questionNumber,
  questionText,
  subtitle,
  placeholder,
  value,
  onChange,
  onKeyDown,
  error,
  inputRef
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

      <div className="relative space-y-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className={`w-full px-6 py-4 sm:py-5 bg-white/5 border ${
            error ? 'border-red-500 focus:border-red-400' : 'border-white/20 focus:border-accent'
          } rounded-2xl text-text-light placeholder:text-text-light/30 text-lg sm:text-xl font-sans focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all duration-300 shadow-xl`}
          autoFocus
        />

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

        <div className="text-xs text-text-light/40 font-sans pt-1">
          Press <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-accent font-semibold">Enter ↵</kbd> to continue
        </div>
      </div>
    </div>
  );
};

export default TextQuestion;
