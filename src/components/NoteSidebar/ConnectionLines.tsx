import React from 'react';
import { motion } from 'motion/react';

interface ConnectionLinesProps {
  activeCount: number;
}

export const ConnectionLines: React.FC<ConnectionLinesProps> = ({ activeCount }) => {
  if (activeCount === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden opacity-30">
      <svg className="h-full w-full stroke-amber-400 fill-none" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#59dad1" />
            <stop offset="50%" stopColor="#ffe16d" />
            <stop offset="100%" stopColor="#ff7b72" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 50 150 C 200 80, 400 300, 750 200"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeDasharray="6 6"
          animate={{ strokeDashoffset: [0, -36] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
    </div>
  );
};
