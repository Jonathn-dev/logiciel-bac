import React from 'react';
import { motion } from 'motion/react';
import { Award, Shield, Star, Crown } from 'lucide-react';
import { UserStats } from '../../types';

interface LevelBadgeProps {
  userStats: UserStats;
  onOpenProfile?: () => void;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ userStats, onOpenProfile }) => {
  return (
    <div
      onClick={onOpenProfile}
      className="atlas-glass rounded-2xl p-4 sm:p-5 border border-[#ffe16d]/25 shadow-[0_8px_32px_rgba(0,0,0,0.35)] flex items-center justify-between gap-4 cursor-pointer group hover:border-[#ffe16d]/50 transition-all"
    >
      <div className="flex items-center gap-3.5">
        {/* Avatar with Animated Gold Ring */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0">
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-[#ffe16d]/20 animate-ping opacity-30 pointer-events-none" />

          {/* Rotating decorative border */}
          <div className="absolute -inset-1 rounded-full border border-dashed border-[#ffe16d]/60 animate-[spin_20s_linear_infinite]" />

          {/* Avatar Container */}
          <div className="w-full h-full rounded-full border-2 border-[#ffe16d] overflow-hidden bg-[#080d3b] shadow-[0_0_15px_rgba(255,225,109,0.4)]">
            <img
              src={userStats.avatarUrl}
              alt={userStats.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Crown badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ffe16d] text-[#3a3000] flex items-center justify-center shadow-md">
            <Crown className="w-3 h-3 fill-[#3a3000]" />
          </div>
        </div>

        {/* User Info */}
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#ffe16d] transition-colors">
              {userStats.name}
            </h3>
            <span className="p-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d]">
              <Star className="w-3 h-3 fill-[#ffe16d]" />
            </span>
          </div>

          <p className="text-xs text-[#ffe16d] font-semibold flex items-center gap-1 mt-0.5">
            <Award className="w-3.5 h-3.5" />
            {userStats.levelTitle}
          </p>

          <span className="text-[11px] text-[#a2a6d0] block mt-0.5 font-mono">
            المستوى {userStats.currentLevel} • {userStats.totalXP.toLocaleString()} XP
          </span>
        </div>
      </div>

      {/* Rank Shield Badge */}
      <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-[#0a0e27]/80 border border-[#ffe16d]/30 text-center shrink-0 min-w-[70px]">
        <span className="text-[10px] text-[#a2a6d0] block">الرتبة</span>
        <span className="font-mono text-sm font-extrabold text-[#ffe16d]">
          #{userStats.currentLevel}
        </span>
        <span className="text-[9px] text-[#59dad1] font-bold mt-0.5">TOP 1%</span>
      </div>
    </div>
  );
};
