import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Trophy, Flame } from 'lucide-react';
import { FlameIcon } from './FlameIcon';

interface StreakCounterProps {
  streakDays: number;
  streakActive: boolean;
  freezesRemaining: number;
  onUseFreeze?: () => void;
}

const WEEK_DAYS = [
  { key: 'mon', label: 'إثن', full: 'الاثنين', completed: true },
  { key: 'tue', label: 'ثلا', full: 'الثلاثاء', completed: true },
  { key: 'wed', label: 'أرب', full: 'الأربعاء', completed: true },
  { key: 'thu', label: 'خمي', full: 'الخميس', completed: true },
  { key: 'fri', label: 'جمع', full: 'الجمعة', completed: true },
  { key: 'sat', label: 'سبت', full: 'السبت', completed: true },
  { key: 'sun', label: 'أحد', full: 'الأحد', completed: true, isToday: true },
];

export const StreakCounter: React.FC<StreakCounterProps> = ({
  streakDays,
  streakActive = true,
  freezesRemaining = 2,
  onUseFreeze,
}) => {
  return (
    <div className="atlas-glass rounded-2xl p-4 sm:p-5 border border-[#ffe16d]/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#ff9f1c]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/5 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-[#ffe16d]/15 text-[#ffe16d]">
            <Flame className="w-4 h-4 fill-[#ffe16d]" />
          </div>
          <h3 className="text-xs sm:text-sm font-bold text-white">سلسلة الالتزام (Daily Streak)</h3>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#59dad1] bg-[#59dad1]/10 px-2 py-0.5 rounded-full border border-[#59dad1]/25">
          <Shield className="w-3 h-3" />
          <span>{freezesRemaining} تجميد متاح</span>
        </div>
      </div>

      {/* Main Counter Display */}
      <div className="flex items-center gap-4 py-1">
        <FlameIcon active={streakActive} size="lg" />

        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#ffe16d] tracking-tight drop-shadow-[0_0_12px_rgba(255,225,109,0.5)]">
              {streakDays}
            </span>
            <span className="text-sm font-bold text-white">يوماً متتالياً</span>
          </div>
          <p className="text-[11px] text-[#a2a6d0]">
            {streakDays >= 7
              ? '🔥 بطل متفوق! ثباتك اليومي يصنع الفارق في الوطني'
              : 'واصل المراجعة اليومية للحفاظ على شعلة الهمة'}
          </p>
        </div>
      </div>

      {/* 7 Days Visual Ring / Tracker */}
      <div className="mt-3.5 pt-2.5 border-t border-white/5">
        <div className="flex items-center justify-between gap-1">
          {WEEK_DAYS.map((day, idx) => (
            <div key={day.key} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] text-[#a2a6d0] font-medium">{day.label}</span>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  day.completed
                    ? 'bg-[#ffe16d] text-[#3a3000] shadow-[0_0_8px_rgba(255,225,109,0.5)]'
                    : day.isToday
                    ? 'bg-[#1c2357] text-[#ffe16d] border border-[#ffe16d] animate-pulse'
                    : 'bg-[#0a0e27] text-[#6b729f] border border-white/10'
                }`}
              >
                {day.completed ? '✓' : idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
