import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordStrengthInfo } from '../../types';

interface StrengthMeterProps {
  strength: PasswordStrengthInfo;
  showRequirements?: boolean;
}

export function computePasswordStrength(password: string): PasswordStrengthInfo {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password) || /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(password);

  let score = 0;
  const feedback: string[] = [];

  if (hasMinLength) score += 1;
  else feedback.push('8 أحرف على الأقل');

  if (hasNumber) score += 1;
  else feedback.push('رقم واحد (0-9)');

  if (hasUpper) score += 1;
  else feedback.push('حروف متنوعة');

  if (hasSpecial) score += 1;
  else feedback.push('رمز خاص (!@#$)');

  if (password.length === 0) {
    return {
      score: 0,
      label: 'ضعيفة جداً',
      color: 'bg-white/20',
      feedback,
      hasMinLength: false,
      hasNumber: false,
      hasUpper: false,
      hasSpecial: false,
    };
  }

  let label: PasswordStrengthInfo['label'] = 'ضعيفة جداً';
  let color = 'bg-rose-500';

  if (score === 1) {
    label = 'ضعيفة';
    color = 'bg-rose-400';
  } else if (score === 2) {
    label = 'متوسطة';
    color = 'bg-amber-400';
  } else if (score === 3) {
    label = 'جيدة';
    color = 'bg-teal-400';
  } else if (score >= 4) {
    label = 'قوية وممتازة';
    color = 'bg-emerald-400';
  }

  return {
    score,
    label,
    color,
    feedback,
    hasMinLength,
    hasNumber,
    hasUpper,
    hasSpecial,
  };
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({
  strength,
  showRequirements = true,
}) => {
  return (
    <div className="w-full space-y-2 text-right">
      {/* 4 Segmented Progress Bars */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 grid grid-cols-4 gap-1.5 h-1.5">
          {[1, 2, 3, 4].map((step) => {
            const isFilled = strength.score >= step;
            return (
              <div
                key={step}
                className={`h-full rounded-full transition-all duration-300 ${
                  isFilled ? strength.color : 'bg-white/10'
                }`}
              />
            );
          })}
        </div>
        <span
          className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            strength.score >= 3
              ? 'text-emerald-300 bg-emerald-400/15 border border-emerald-400/30'
              : strength.score === 2
              ? 'text-amber-300 bg-amber-400/15 border border-amber-400/30'
              : 'text-rose-300 bg-rose-400/15 border border-rose-400/30'
          }`}
        >
          {strength.label}
        </span>
      </div>

      {/* Real-time Validation Criteria Checklist */}
      {showRequirements && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
          <div
            className={`flex items-center gap-1.5 ${
              strength.hasMinLength ? 'text-emerald-400 font-bold' : 'text-white/40'
            }`}
          >
            {strength.hasMinLength ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-white/30 shrink-0" />
            )}
            <span>8 أحرف على الأقل</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              strength.hasNumber ? 'text-emerald-400 font-bold' : 'text-white/40'
            }`}
          >
            {strength.hasNumber ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-white/30 shrink-0" />
            )}
            <span>أرقام (0-9)</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              strength.hasUpper ? 'text-emerald-400 font-bold' : 'text-white/40'
            }`}
          >
            {strength.hasUpper ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-white/30 shrink-0" />
            )}
            <span>حروف متنوعة</span>
          </div>

          <div
            className={`flex items-center gap-1.5 ${
              strength.hasSpecial ? 'text-emerald-400 font-bold' : 'text-white/40'
            }`}
          >
            {strength.hasSpecial ? (
              <Check className="w-3 h-3 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-3 h-3 text-white/30 shrink-0" />
            )}
            <span>رموز خاصة (@#$%)</span>
          </div>
        </div>
      )}
    </div>
  );
};
