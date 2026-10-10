import React from 'react';
import { motion } from 'framer-motion';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const PhoneQuestion = ({
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
          What is your contact number?
        </h2>
        <p className="text-sm sm:text-base text-text-light/70 font-sans">
          Our franchise expansion team will connect with you via WhatsApp or phone.
        </p>
      </div>

      <div className="relative space-y-2">
        <div className="coolcane-phone-wrapper p-1 rounded-2xl bg-white/5 border border-white/20 focus-within:border-accent transition-all duration-300">
          <PhoneInput
            defaultCountry="IN"
            placeholder="Enter mobile number"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="w-full text-text-light text-lg sm:text-xl font-sans"
          />
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

        <div className="text-xs text-text-light/40 font-sans pt-1">
          Press <kbd className="px-2 py-0.5 bg-white/10 rounded border border-white/20 text-accent font-semibold">Enter ↵</kbd> to continue
        </div>
      </div>

      {/* Embedded CSS overrides for react-phone-number-input styling */}
      <style>{`
        .coolcane-phone-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
        }
        .coolcane-phone-wrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .coolcane-phone-wrapper .PhoneInputCountrySelect {
          background: #143601;
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
        }
        .coolcane-phone-wrapper .PhoneInputCountrySelect option {
          background: #0b1f00;
          color: #ffffff;
        }
        .coolcane-phone-wrapper .PhoneInputCountryIcon {
          width: 24px;
          height: 18px;
          border-radius: 3px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .coolcane-phone-wrapper .PhoneInputInput {
          flex: 1;
          background: transparent;
          border: none;
          color: #f7f9f6;
          font-size: 1.125rem;
          outline: none;
          padding: 8px 4px;
        }
        .coolcane-phone-wrapper .PhoneInputInput::placeholder {
          color: rgba(247, 249, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default PhoneQuestion;
