import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, Sparkles } from 'lucide-react';
import { CountdownTime } from '../../hooks/useCountdown';

interface FlipUnitProps {
  currentValue: string;
  label: string;
  unitKey: string;
}

const FlipDigit: React.FC<{ digit: string }> = ({ digit }) => {
  return (
    <div className="relative w-6 sm:w-8 md:w-9 h-9 sm:h-11 md:h-13 bg-[#0a0e27]/90 border border-[#ffe16d]/30 rounded-lg flex items-center justify-center overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.5)] shrink-0">
      {/* Top half subtle sheen */}
      <div className="absolute top-0 inset-x-0 h-1/2 bg-white/5 border-b border-black/40 pointer-events-none" />
      
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={digit}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 24,
            duration: 0.6,
          }}
          className="font-mono text-base sm:text-xl md:text-2xl font-bold text-[#ffe16d] tracking-wider select-none"
        >
          {digit}
        </motion.div>
      </AnimatePresence>

      {/* Center line divider */}
      <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/60 shadow-[0_1px_0_rgba(255,255,255,0.08)] pointer-events-none" />
    </div>
  );
};

const FlipUnit: React.FC<FlipUnitProps> = ({ currentValue, label }) => {
  const digits = currentValue.padStart(2, '0').split('');

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-1">
        <FlipDigit digit={digits[0]} />
        <FlipDigit digit={digits[1]} />
      </div>
      <span className="text-[11px] sm:text-xs font-semibold text-[#a2a6d0] tracking-wide">
        {label}
      </span>
    </div>
  );
};

interface FlipClockProps {
  countdown: CountdownTime;
  targetDateLabel?: string;
  onAdjustDate?: () => void;
}

export const FlipClock: React.FC<FlipClockProps> = ({
  countdown,
  targetDateLabel = 'الامتحان الوطني الموحد للبكالوريا - الدورة العادية',
  onAdjustDate,
}) => {
  return (
    <div className="atlas-glass rounded-2xl p-4 sm:p-5 border border-[#ffe16d]/25 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden group">
      {/* Background radial accent glow */}
      <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#ffe16d]/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-[#59dad1]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#ffe16d]/15 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#ffe16d]/10 border border-[#ffe16d]/30 text-[#ffe16d]">
            <Clock className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-bold text-[#dfe0ff] font-sans">
                العد التنازلي للباكالوريا
              </h3>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#59dad1]/15 text-[#59dad1] border border-[#59dad1]/30">
                <Sparkles className="w-2.5 h-2.5" />
                حاسم
              </span>
            </div>
            <p className="text-[11px] text-[#a2a6d0] truncate max-w-[200px] sm:max-w-xs">
              {targetDateLabel}
            </p>
          </div>
        </div>

        {onAdjustDate && (
          <button
            onClick={onAdjustDate}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-[#1c2357]/80 hover:bg-[#ffe16d]/20 text-[#a2a6d0] hover:text-[#ffe16d] border border-white/10 hover:border-[#ffe16d]/40 transition-all flex items-center gap-1"
            title="تعديل تاريخ الامتحان"
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">تعديل الموعد</span>
          </button>
        )}
      </div>

      {/* Clock Digits Display */}
      <div className="flex items-center justify-center gap-1 sm:gap-2.5 md:gap-3.5 py-1">
        <FlipUnit currentValue={countdown.formattedDays} label="يوم" unitKey="days" />
        <span className="text-[#ffe16d]/60 font-mono text-lg sm:text-xl font-bold mb-4 sm:mb-5 select-none">:</span>
        <FlipUnit currentValue={countdown.formattedHours} label="ساعة" unitKey="hours" />
        <span className="text-[#ffe16d]/60 font-mono text-lg sm:text-xl font-bold mb-4 sm:mb-5 select-none">:</span>
        <FlipUnit currentValue={countdown.formattedMinutes} label="دقيقة" unitKey="minutes" />
        <span className="text-[#ffe16d]/60 font-mono text-lg sm:text-xl font-bold mb-4 sm:mb-5 select-none">:</span>
        <FlipUnit currentValue={countdown.formattedSeconds} label="ثانية" unitKey="seconds" />
      </div>

      {/* Progress Footer */}
      <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-[#a2a6d0]">
        <span>كل دقيقة تقربك من ميزة حسن جداً 🎯</span>
        <span className="font-mono text-[#ffe16d] font-semibold">
          {countdown.days} يوماً متبقية
        </span>
      </div>
    </div>
  );
};
