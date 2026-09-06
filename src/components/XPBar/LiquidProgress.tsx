import React from 'react';
import { motion } from 'motion/react';
import { Zap, Sparkles } from 'lucide-react';

interface LiquidProgressProps {
  currentXP: number;
  baseXP: number;
  targetXP: number;
  level: number;
  levelTitle: string;
}

export const LiquidProgress: React.FC<LiquidProgressProps> = ({
  currentXP,
  baseXP,
  targetXP,
  level,
  levelTitle,
}) => {
  const currentInLevel = Math.max(0, currentXP - baseXP);
  const requiredInLevel = Math.max(1, targetXP - baseXP);
  const percentage = Math.min(100, Math.max(0, Math.round((currentInLevel / requiredInLevel) * 100)));

  return (
    <div className="atlas-glass rounded-2xl p-4 sm:p-5 border border-[#59dad1]/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
      {/* Background Teal / Gold ambient glow */}
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-[#59dad1]/15 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#59dad1]/15 text-[#59dad1]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              مقياس الخبرة والتقدم (XP Progress)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#59dad1]/20 text-[#59dad1] font-mono">
                LVL {level}
              </span>
            </h3>
          </div>
        </div>

        <div className="text-left">
          <span className="font-mono text-sm font-bold text-[#ffe16d]">
            {currentXP.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#a2a6d0] mr-1">
            / {targetXP.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Liquid Progress Bar with SVG Wave & Mask */}
      <div className="relative w-full h-7 rounded-xl bg-[#080d3b] border border-[#59dad1]/30 overflow-hidden shadow-inner p-[2px]">
        {/* SVG Container with Masked Liquid Wave */}
        <svg className="w-full h-full rounded-[10px] overflow-hidden" preserveAspectRatio="none">
          <defs>
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#59dad1" />
              <stop offset="60%" stopColor="#79f6ed" />
              <stop offset="100%" stopColor="#ffe16d" />
            </linearGradient>

            <clipPath id="liquidClip">
              <motion.rect
                x="0"
                y="0"
                height="100%"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </clipPath>
          </defs>

          {/* Liquid Fill with Wave Pattern */}
          <g clipPath="url(#liquidClip)">
            <rect width="100%" height="100%" fill="url(#liquidGrad)" />

            {/* Animated Wave Surface */}
            <motion.path
              d="M 0 4 Q 30 1, 60 4 T 120 4 T 180 4 T 240 4 T 300 4 T 360 4 T 420 4 T 480 4 T 540 4 T 600 4 V 30 H 0 Z"
              fill="rgba(255, 255, 255, 0.28)"
              animate={{ x: [-60, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
            />
            <motion.path
              d="M 0 6 Q 40 10, 80 6 T 160 6 T 240 6 T 320 6 T 400 6 T 480 6 T 560 6 V 30 H 0 Z"
              fill="rgba(255, 255, 255, 0.18)"
              animate={{ x: [0, -80] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
            />
          </g>
        </svg>

        {/* Overlay Label centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-xs font-black text-[#040736] drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]">
            {percentage}%
          </span>
        </div>

        {/* Milestone Marks at 25%, 50%, 75% */}
        <div className="absolute inset-0 flex justify-between px-[25%] pointer-events-none">
          <div className="w-[1px] h-full bg-white/20" />
          <div className="w-[1px] h-full bg-white/20" />
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between text-[11px] text-[#a2a6d0] mt-2.5">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#ffe16d]" />
          الرتبة الحالية: <strong className="text-white">{levelTitle}</strong>
        </span>
        <span>
          متبقي <strong className="font-mono text-[#ffe16d]">{(targetXP - currentXP).toLocaleString()} XP</strong> للترقية للمستوى {level + 1}
        </span>
      </div>
    </div>
  );
};
