import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Award } from 'lucide-react';

interface KnowledgeSealProps {
  score?: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const KnowledgeSeal: React.FC<KnowledgeSealProps> = ({
  score = 98,
  label = 'ختم المطابقة الوزارية الرسمية',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-20 h-20 text-[9px]',
    md: 'w-28 h-28 text-[11px]',
    lg: 'w-36 h-36 text-xs',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses[size]}`}>
      {/* Rotating outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-[#ffe16d]/60"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Inner double border container */}
      <div className="w-[88%] h-[88%] rounded-full bg-gradient-to-tr from-[#ffe16d]/20 to-[#59dad1]/20 border border-[#ffe16d] flex flex-col items-center justify-center p-2 text-center shadow-[0_0_25px_rgba(255,225,109,0.25)]">
        <Award className="w-5 h-5 text-[#ffe16d] mb-0.5" />
        <span className="font-serif font-black text-white text-[11px] leading-tight">
          BAC DZ
        </span>
        <span className="text-[8px] text-[#ffe16d] font-bold tracking-tighter">
          معتمد 100%
        </span>
      </div>
    </div>
  );
};
