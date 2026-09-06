import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string | null;
  isValid?: boolean;
  helperText?: string;
  actionElement?: React.ReactNode;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      id,
      label,
      value,
      onChange,
      icon,
      error,
      isValid,
      helperText,
      actionElement,
      className = '',
      type = 'text',
      required,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = value !== undefined && value !== null && String(value).length > 0;
    const isFloating = isFocused || hasValue;

    const inputId = id || `floating-input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full space-y-1.5 text-right font-sans">
        <div
          className={`relative flex items-center rounded-2xl border transition-all duration-200 backdrop-blur-md bg-white/[0.04] ${
            error
              ? 'border-rose-500/70 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20'
              : isFocused
              ? 'border-amber-400 shadow-lg shadow-amber-400/15 ring-2 ring-amber-400/25 bg-white/[0.07]'
              : isValid
              ? 'border-teal-400/60 bg-white/[0.05]'
              : 'border-white/15 hover:border-white/25'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {/* Right Icon (Prefix in Arabic RTL) */}
          {icon && (
            <div
              className={`flex items-center justify-center pr-3.5 pl-1.5 transition-colors ${
                error
                  ? 'text-rose-400'
                  : isFocused
                  ? 'text-amber-400'
                  : isValid
                  ? 'text-teal-400'
                  : 'text-white/40'
              }`}
            >
              {icon}
            </div>
          )}

          {/* Input field */}
          <div className="relative flex-1 py-1">
            <input
              ref={ref}
              id={inputId}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              className={`w-full bg-transparent px-3.5 pt-5 pb-2 text-sm text-white placeholder-transparent focus:outline-none disabled:cursor-not-allowed ${
                icon ? 'pr-1' : ''
              } ${actionElement ? 'pl-10' : ''} ${className}`}
              placeholder={label}
              required={required}
              {...props}
            />

            {/* Floating Label */}
            <label
              htmlFor={inputId}
              className={`absolute right-3.5 pointer-events-none transition-all duration-200 origin-top-right text-right select-none ${
                isFloating
                  ? 'top-1.5 text-[10px] font-bold ' +
                    (error
                      ? 'text-rose-400'
                      : isFocused
                      ? 'text-amber-400'
                      : isValid
                      ? 'text-teal-300'
                      : 'text-white/60')
                  : 'top-3.5 text-xs sm:text-sm text-white/45 font-medium'
              }`}
            >
              {label} {required && <span className="text-amber-400">*</span>}
            </label>
          </div>

          {/* Left Action / Status Indicator */}
          <div className="flex items-center pl-3 gap-1.5">
            {actionElement}

            {isValid && !actionElement && !error && (
              <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            )}

            {error && !actionElement && (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
            )}
          </div>
        </div>

        {/* Error or Helper Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pr-1"
            >
              <span>{error}</span>
            </motion.p>
          )}

          {!error && helperText && (
            <p className="text-[11px] text-white/50 pr-1">{helperText}</p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';
