import React from 'react';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { QuickAccessItem } from '../../types';

interface HexButtonProps {
  item: QuickAccessItem;
  onClick: (item: QuickAccessItem) => void;
}

const COLOR_MAP: Record<string, { ring: string; bg: string; text: string; glow: string }> = {
  gold: {
    ring: 'border-[#ffe16d]/40 group-hover:border-[#ffe16d]',
    bg: 'from-[#ffe16d]/20 to-[#0e1442]',
    text: 'text-[#ffe16d]',
    glow: 'rgba(255, 225, 109, 0.35)',
  },
  cyan: {
    ring: 'border-[#59dad1]/40 group-hover:border-[#59dad1]',
    bg: 'from-[#59dad1]/20 to-[#0e1442]',
    text: 'text-[#59dad1]',
    glow: 'rgba(89, 218, 209, 0.35)',
  },
  amber: {
    ring: 'border-[#ffdb3c]/40 group-hover:border-[#ffdb3c]',
    bg: 'from-[#ffdb3c]/20 to-[#0e1442]',
    text: 'text-[#ffdb3c]',
    glow: 'rgba(255, 219, 60, 0.35)',
  },
  emerald: {
    ring: 'border-[#4ade80]/40 group-hover:border-[#4ade80]',
    bg: 'from-[#4ade80]/20 to-[#0e1442]',
    text: 'text-[#4ade80]',
    glow: 'rgba(74, 222, 128, 0.35)',
  },
  indigo: {
    ring: 'border-[#818cf8]/40 group-hover:border-[#818cf8]',
    bg: 'from-[#818cf8]/20 to-[#0e1442]',
    text: 'text-[#818cf8]',
    glow: 'rgba(129, 140, 248, 0.35)',
  },
  rose: {
    ring: 'border-[#fb7185]/40 group-hover:border-[#fb7185]',
    bg: 'from-[#fb7185]/20 to-[#0e1442]',
    text: 'text-[#fb7185]',
    glow: 'rgba(251, 113, 133, 0.35)',
  },
};

export const HexButton: React.FC<HexButtonProps> = ({ item, onClick }) => {
  const colorTheme = COLOR_MAP[item.color] || COLOR_MAP.gold;

  // Dynamically resolve icon from lucide-react or fallback
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Sparkles;

  return (
    <motion.div
      className="perspective-1000 flex flex-col items-center cursor-pointer group"
      whileHover={{ scale: 1.1, rotateY: 15 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      onClick={() => onClick(item)}
    >
      {/* 3D Hexagon Button Base */}
      <div className="relative w-20 h-22 sm:w-24 sm:h-26 flex items-center justify-center">
        {/* Outer Glow on hover */}
        <div
          className="absolute inset-0 clip-hex opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none"
          style={{ backgroundColor: colorTheme.glow }}
        />

        {/* Hexagon Border Container */}
        <div
          className={`absolute inset-0 clip-hex bg-gradient-to-b ${colorTheme.bg} p-[2px] transition-all duration-300`}
        >
          {/* Inner Hex Face */}
          <div className="w-full h-full clip-hex bg-[#080d3b]/95 group-hover:bg-[#121743] flex flex-col items-center justify-center p-2 transition-colors">
            {/* Top Shine */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Icon */}
            <div className={`p-2 rounded-xl bg-white/5 ${colorTheme.text} mb-1 transition-transform group-hover:scale-110`}>
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            {/* Badge if present */}
            {item.badge && (
              <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#ffe16d] text-[#3a3000] shadow-[0_0_8px_rgba(255,225,109,0.8)]">
                {item.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Label and Subtitle */}
      <div className="mt-2 text-center max-w-[110px]">
        <h4 className="text-xs sm:text-sm font-bold text-[#dfe0ff] group-hover:text-white transition-colors leading-tight truncate">
          {item.title}
        </h4>
        <p className="text-[10px] text-[#a2a6d0] mt-0.5 line-clamp-1">
          {item.subtitle}
        </p>
      </div>
    </motion.div>
  );
};
