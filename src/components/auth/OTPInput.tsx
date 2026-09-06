import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (otp: string) => void;
  onComplete?: (otp: string) => void;
  disabled?: boolean;
  isError?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  isError = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Handle single digit input
  const handleChange = (index: number, digit: string) => {
    // Only accept numeric digits
    const cleaned = digit.replace(/\D/g, '');
    if (!cleaned && digit !== '') return;

    const currentDigits = value.padEnd(length, ' ').split('');
    currentDigits[index] = cleaned ? cleaned[cleaned.length - 1] : ' ';

    const newOtp = currentDigits.join('').trimEnd();
    onChange(newOtp);

    // If a digit was entered, move to next input
    if (cleaned && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }

    // Check if fully completed
    const fullValue = currentDigits.join('');
    if (fullValue.length === length && !fullValue.includes(' ') && onComplete) {
      onComplete(fullValue);
    }
  };

  // Handle Backspace and arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const currentDigits = value.padEnd(length, ' ').split('');
      if (currentDigits[index] !== ' ' && currentDigits[index] !== '') {
        currentDigits[index] = ' ';
        onChange(currentDigits.join('').trimEnd());
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        currentDigits[index - 1] = ' ';
        onChange(currentDigits.join('').trimEnd());
      }
    } else if (e.key === 'ArrowLeft' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const targetIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[targetIndex]?.focus();
      if (pastedData.length === length && onComplete) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center justify-center gap-2 sm:gap-3 dir-ltr" dir="ltr">
        {Array.from({ length }).map((_, index) => {
          const char = value[index] || '';
          const isFilled = Boolean(char && char !== ' ');

          return (
            <motion.div
              key={index}
              animate={isError ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={isFilled ? char : ''}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()}
                disabled={disabled}
                className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-2xl border transition-all duration-200 backdrop-blur-md focus:outline-none ${
                  isError
                    ? 'border-rose-500/80 bg-rose-500/10 text-rose-300 ring-2 ring-rose-500/30'
                    : isFilled
                    ? 'border-amber-400/70 bg-amber-400/10 text-amber-300 ring-2 ring-amber-400/20 shadow-lg shadow-amber-400/10'
                    : 'border-white/20 bg-white/[0.04] text-white hover:border-white/35 focus:border-amber-400 focus:bg-white/[0.08] focus:ring-2 focus:ring-amber-400/30'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
