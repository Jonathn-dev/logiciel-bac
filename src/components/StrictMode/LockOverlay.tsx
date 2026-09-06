import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, ShieldCheck } from 'lucide-react';

interface LockOverlayProps {
  active: boolean;
  message?: string;
}

export const LockOverlay: React.FC<LockOverlayProps> = ({
  active,
  message = 'الوضع الصارم مفعّل: تم قفل النطاق المعرفي على المنهاج المعتمد فقط',
}) => {
  if (!active) return null;

  return (
    <div className="absolute inset-0 bg-[#020617]/40 backdrop-blur-[1px] rounded-2xl pointer-events-none z-10 flex items-end justify-start p-3 border border-[#ffe16d]/20">
      <div className="bg-[#080d3b]/90 border border-[#ffe16d]/40 rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-[0_0_20px_rgba(255,225,109,0.15)]">
        <Lock className="w-3.5 h-3.5 text-[#ffe16d]" />
        <span className="text-[11px] text-[#ffe16d] font-bold">{message}</span>
      </div>
    </div>
  );
};
