import React from 'react';
import { motion } from 'motion/react';
import { AICompanionStatus } from '../../types';
import { Sparkles, Bot, BrainCircuit, Check, AlertCircle } from 'lucide-react';

interface FloatingOrbProps {
  status: AICompanionStatus;
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const FloatingOrb: React.FC<FloatingOrbProps> = ({
  status,
  isOpen,
  onClick,
  unreadCount = 0,
}) => {
  // Animation states according to user specification:
  // - Idle: boxShadow pulse 2s infinite
  // - Thinking: rotate 360deg, 1s linear infinite
  // - Ready: scale 1.2, green/gold glow
  // - Error: red pulse

  const getOrbVariants = () => {
    switch (status) {
      case 'thinking':
        return {
          animate: {
            rotate: 360,
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)',
              '0 0 35px rgba(245, 158, 11, 0.9), 0 0 60px rgba(139, 92, 246, 0.7)',
              '0 0 20px rgba(245, 158, 11, 0.6), 0 0 40px rgba(139, 92, 246, 0.4)',
            ],
          },
          transition: {
            rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
            boxShadow: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' },
          },
        };
      case 'ready':
        return {
          animate: {
            scale: 1.2,
            rotate: 0,
            boxShadow: '0 0 35px rgba(16, 185, 129, 0.9), 0 0 65px rgba(245, 158, 11, 0.6)',
          },
          transition: {
            duration: 0.35,
            ease: 'easeOut',
          },
        };
      case 'error':
        return {
          animate: {
            scale: [1, 1.08, 1],
            rotate: 0,
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.8)',
          },
          transition: {
            duration: 0.8,
            repeat: Infinity,
          },
        };
      case 'idle':
      default:
        return {
          animate: {
            scale: [1, 1.04, 1],
            rotate: 0,
            boxShadow: [
              '0 0 15px rgba(89, 218, 209, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)',
              '0 0 28px rgba(89, 218, 209, 0.8), 0 0 45px rgba(245, 158, 11, 0.45)',
              '0 0 15px rgba(89, 218, 209, 0.4), 0 0 30px rgba(245, 158, 11, 0.2)',
            ],
          },
          transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        };
    }
  };

  const orbVariants = getOrbVariants();

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <motion.button
        id="btn-ai-floating-orb"
        onClick={onClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.94 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#09152a] via-[#122442] to-[#1c3761] border border-amber-400/50 cursor-pointer shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-400/30"
        aria-label="رفيق الباك الذكي"
        aria-expanded={isOpen}
      >
        {/* Animated Inner Orb Core */}
        <motion.div
          animate={orbVariants.animate}
          transition={orbVariants.transition as any}
          className="absolute inset-1 rounded-full bg-gradient-to-tr from-amber-500/20 via-teal-400/30 to-amber-300/40"
        />

        {/* Center Icon */}
        <div className="relative z-10 text-stone-100 flex items-center justify-center">
          {status === 'thinking' ? (
            <BrainCircuit className="h-7 w-7 text-amber-300 animate-spin" />
          ) : status === 'ready' ? (
            <Check className="h-7 w-7 text-emerald-300 stroke-[3]" />
          ) : status === 'error' ? (
            <AlertCircle className="h-7 w-7 text-rose-400" />
          ) : (
            <Sparkles className="h-7 w-7 text-amber-300" />
          )}
        </div>

        {/* Pulse Ring Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span
            className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              status === 'thinking'
                ? 'bg-amber-400'
                : status === 'ready'
                ? 'bg-emerald-400'
                : 'bg-teal-400'
            }`}
          />
          <span
            className={`relative inline-flex h-4 w-4 rounded-full border-2 border-[#09152a] ${
              status === 'thinking'
                ? 'bg-amber-500'
                : status === 'ready'
                ? 'bg-emerald-500'
                : 'bg-teal-500'
            }`}
          />
        </span>

        {/* Tooltip Label on Hover */}
        <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-stone-900/90 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-stone-700 opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 shadow-lg">
          {status === 'thinking'
            ? 'جاري التحليل وفق الإطار المرجعي...'
            : status === 'ready'
            ? 'الإجابة جاهزة!'
            : 'اسأل رفيق الباكالوريا'}
        </div>
      </motion.button>
    </div>
  );
};
