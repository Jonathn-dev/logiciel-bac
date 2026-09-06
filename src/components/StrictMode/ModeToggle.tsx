import React from 'react';
import { Lock, Sparkles } from 'lucide-react';

interface ModeToggleProps {
  strictMode: boolean;
  onToggle: () => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({
  strictMode,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 px-3 rounded-xl bg-[#090d2e] border border-white/10">
      <div className="text-right">
        <div className="flex items-center gap-1.5 justify-end">
          <span className="text-xs font-bold text-white">الوضع الوزاري الصارم (Strict)</span>
          {strictMode ? (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d] font-mono">ON</span>
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-[#a2a6d0] font-mono">OFF</span>
          )}
        </div>
        <p className="text-[10px] text-[#a2a6d0]">التقيد الحرفي بمصطلحات ومناهج وزارة التربية 2026</p>
      </div>

      {/* Switch button */}
      <button
        dir="ltr"
        onClick={onToggle}
        className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors cursor-pointer shrink-0 px-0.5 ${
          strictMode ? 'bg-[#ffe16d] shadow-[0_0_12px_rgba(255,225,109,0.4)]' : 'bg-[#1c2357] border border-white/20'
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full bg-[#080d3b] flex items-center justify-center shadow-md transform transition-transform duration-200 ease-in-out ${
            strictMode ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {strictMode ? (
            <Lock className="w-3 h-3 text-[#ffe16d]" />
          ) : (
            <Sparkles className="w-3 h-3 text-[#59dad1]" />
          )}
        </span>
      </button>
    </div>
  );
};
