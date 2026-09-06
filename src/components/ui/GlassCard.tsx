import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glow' | 'accent' | 'danger' | 'amber';
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  interactive = false,
  ...motionProps
}) => {
  const variantStyles = {
    default: 'bg-[#081133]/70 border-white/10 hover:border-white/20',
    glow: 'bg-[#081133]/80 border-amber-400/30 shadow-[0_0_25px_rgba(255,225,109,0.1)]',
    accent: 'bg-[#061438]/80 border-teal-400/30 shadow-[0_0_25px_rgba(89,218,209,0.1)]',
    amber: 'bg-[#0d162f]/80 border-amber-500/30',
    danger: 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/50',
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -2, transition: { duration: 0.15 } } : undefined}
      className={`relative backdrop-blur-xl border rounded-2xl p-4 sm:p-6 transition-colors ${variantStyles[variant]} ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
