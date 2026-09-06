import React from 'react';
import { motion } from 'motion/react';
import { AICompanionStatus } from '../../types';

interface ContextAwareGlowProps {
  status: AICompanionStatus;
}

export const ContextAwareGlow: React.FC<ContextAwareGlowProps> = ({ status }) => {
  const getGlowStyles = () => {
    switch (status) {
      case 'thinking':
        return {
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 70%)',
          scale: [1, 1.25, 1],
          opacity: 0.8,
        };
      case 'ready':
        return {
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 70%)',
          scale: [1, 1.3, 1],
          opacity: 0.9,
        };
      case 'error':
        return {
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, transparent 70%)',
          scale: [1, 1.1, 1],
          opacity: 0.6,
        };
      case 'idle':
      default:
        return {
          background: 'radial-gradient(circle, rgba(89, 218, 209, 0.18) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 70%)',
          scale: [1, 1.08, 1],
          opacity: 0.5,
        };
    }
  };

  const style = getGlowStyles();

  return (
    <motion.div
      animate={{
        scale: style.scale,
        opacity: style.opacity,
      }}
      transition={{
        duration: status === 'thinking' ? 1.2 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: style.background,
      }}
      className="pointer-events-none fixed bottom-6 left-6 z-30 h-72 w-72 -translate-x-12 translate-y-12 rounded-full blur-2xl"
    />
  );
};
