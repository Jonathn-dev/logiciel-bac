import React from 'react';
import { motion } from 'motion/react';

interface FlameIconProps {
  active?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FlameIcon: React.FC<FlameIconProps> = ({
  active = true,
  size = 'md',
  className = '',
}) => {
  const sizePixels = size === 'sm' ? 24 : size === 'lg' ? 44 : 32;

  if (!active) {
    return (
      <svg
        width={sizePixels}
        height={sizePixels}
        viewBox="0 0 24 24"
        fill="none"
        className={`text-[#6b729f] opacity-50 ${className}`}
      >
        <path
          d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 17.5 7 14.5 4C14.5 7 13 8.5 11.5 9.5C10 10.5 8 11.5 8 14C8 14.5 8.1 15 8.3 15.5C6.9 14.5 6 12.8 6 11C4.5 13 4 15 4 16C4 19.3137 7.58172 22 12 22Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 bg-[#ffdb3c] rounded-full blur-md pointer-events-none"
      />

      {/* SVG Multi-layer Animated Flame */}
      <svg width={sizePixels} height={sizePixels} viewBox="0 0 32 32" fill="none">
        <defs>
          <linearGradient id="flameOuter" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffe16d" />
            <stop offset="50%" stopColor="#ff9f1c" />
            <stop offset="100%" stopColor="#ff4000" />
          </linearGradient>
          <linearGradient id="flameInner" x1="16" y1="10" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffe16d" />
            <stop offset="100%" stopColor="#ff9f1c" />
          </linearGradient>
          <filter id="flameGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Flame (Animates scaleY: [1, 1.2, 1] infinite) */}
        <motion.path
          d="M16 2C22 8 28 14 28 21C28 26.5 22.6 30 16 30C9.4 30 4 26.5 4 21C4 16 7 12 10 9C10 13 13 14 14.5 12.5C16 11 16 7 16 2Z"
          fill="url(#flameOuter)"
          filter="url(#flameGlow)"
          animate={{ scaleY: [1, 1.2, 1], scaleX: [1, 0.95, 1] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ originX: 0.5, originY: 1 }}
        />

        {/* Inner Core Flame */}
        <motion.path
          d="M16 11C19.5 15 22 18.5 22 23C22 26.5 19.3 28.5 16 28.5C12.7 28.5 10 26.5 10 23C10 19.5 12.5 17 14 15C14.5 16 15.5 16.5 16 15C16.5 13.5 16 12 16 11Z"
          fill="url(#flameInner)"
          animate={{ scaleY: [1, 1.28, 1], scaleX: [1, 0.92, 1] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.2,
          }}
          style={{ originX: 0.5, originY: 1 }}
        />

        {/* Floating Sparks */}
        <motion.circle
          cx="16"
          cy="8"
          r="1.2"
          fill="#ffe16d"
          animate={{
            y: [-2, -8, -14],
            opacity: [1, 0.8, 0],
            x: [0, 2, -2],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
        <motion.circle
          cx="13"
          cy="12"
          r="1"
          fill="#fff"
          animate={{
            y: [-1, -6, -12],
            opacity: [1, 0.7, 0],
            x: [0, -2, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeOut',
            delay: 0.4,
          }}
        />
      </svg>
    </div>
  );
};
