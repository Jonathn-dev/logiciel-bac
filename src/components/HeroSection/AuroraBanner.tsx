import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass, ShieldAlert, BookOpen, BrainCircuit, Trophy } from 'lucide-react';
import { TimeOfDayInfo } from '../../hooks/useTimeOfDay';
import { UserStats } from '../../types';

interface AuroraBannerProps {
  timeInfo: TimeOfDayInfo;
  userStats: UserStats;
  onOpenPlanGenerator?: () => void;
  onOpenAnalysis?: () => void;
  onToggleStrictMode?: () => void;
}

export const AuroraBanner: React.FC<AuroraBannerProps> = ({
  timeInfo,
  userStats,
  onOpenPlanGenerator,
  onOpenAnalysis,
  onToggleStrictMode,
}) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#ffe16d]/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-5 sm:p-7 aurora-gradient">
      {/* Background Subtle Floating Glows */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#59dad1]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#ffe16d]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Right Info Section (Arabic RTL) */}
        <div className="space-y-2.5 max-w-2xl">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              {timeInfo.periodLabel}
            </span>

            <button
              onClick={onToggleStrictMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                userStats.strictMode
                  ? 'bg-[#ffe16d]/20 text-[#ffe16d] border-[#ffe16d] shadow-[0_0_12px_rgba(255,225,109,0.3)]'
                  : 'bg-[#1c2357]/60 text-[#a2a6d0] border-white/10 hover:border-white/30'
              }`}
              title="تفعيل التوافق الحصري مع الإطار المرجعي الوطني للبكالوريا"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>الوضع الصارم: {userStats.strictMode ? 'مفعّل (الإطار المرجعي)' : 'مرن'}</span>
            </button>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[#59dad1]/10 text-[#59dad1] border border-[#59dad1]/25">
              <Trophy className="w-3 h-3" />
              {userStats.levelTitle}
            </span>
          </div>

          {/* Heading with Amiri Font */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-wide leading-tight">
            {timeInfo.arabicGreeting}، يا{' '}
            <span className="text-[#ffe16d] drop-shadow-[0_0_15px_rgba(255,225,109,0.4)]">
              {userStats.name}
            </span>
          </h1>

          {/* Guidance Subtitle */}
          <p className="text-sm sm:text-base text-[#dfe0ff]/90 leading-relaxed font-sans">
            منظومة <strong className="text-[#59dad1]">Atlas BAC</strong> التاريخ والجغرافيا الذكية.
            خريطة طريقك لإتقان المقال التاريخي، وتفريغ الوثائق، وتأصيل المصطلحات وفق الإطار المرجعي
            المغربي الرسمي.
          </p>

          {/* Recommended Mode Hint */}
          <div className="flex items-center gap-2 text-xs text-[#a2a6d0] pt-1">
            <Compass className="w-4 h-4 text-[#ffe16d] shrink-0" />
            <span>نصيحة هذه الفترة: {timeInfo.recommendedStudyMode}</span>
          </div>
        </div>

        {/* Left Action Buttons */}
        <div className="flex flex-row md:flex-col gap-2.5 shrink-0 justify-start md:justify-center">
          {onOpenPlanGenerator && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenPlanGenerator}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ffe16d] to-[#ffdb3c] text-[#3a3000] font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(255,225,109,0.35)] flex items-center justify-center gap-2 hover:shadow-[0_0_25px_rgba(255,225,109,0.5)] transition-all cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>توليد خطة اليوم بالذكاء الاصطناعي</span>
            </motion.button>
          )}

          {onOpenAnalysis && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenAnalysis}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-[#080d3b]/80 hover:bg-[#1c2357] text-[#59dad1] border border-[#59dad1]/40 font-semibold text-xs sm:text-sm shadow-[0_0_15px_rgba(89,218,209,0.2)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>تحليل الوثائق والنصوص</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
