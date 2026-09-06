import React from 'react';
import { motion } from 'motion/react';

interface HUDRingsProps {
  size?: number;
  className?: string;
  active?: boolean;
}

export const HUDRings: React.FC<HUDRingsProps> = ({
  size = 280,
  className = '',
  active = true,
}) => {
  return (
    <div
      className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full opacity-60"
        style={{ filter: 'drop-shadow(0 0 8px rgba(89, 218, 209, 0.4))' }}
      >
        {/* Outer dashed ring */}
        <motion.circle
          cx="150"
          cy="150"
          r="135"
          fill="none"
          stroke="#59dad1"
          strokeWidth="1.2"
          strokeDasharray="6 12"
          animate={active ? { rotate: 360 } : {}}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* Counter rotating segmented ring */}
        <motion.circle
          cx="150"
          cy="150"
          r="115"
          fill="none"
          stroke="#ffe16d"
          strokeWidth="1.5"
          strokeDasharray="40 15 10 15 80 20"
          animate={active ? { rotate: -360 } : {}}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* Middle telemetry circle */}
        <circle
          cx="150"
          cy="150"
          r="95"
          fill="none"
          stroke="rgba(89, 218, 209, 0.25)"
          strokeWidth="1"
        />

        {/* Inner high-speed ring with 4 ticks */}
        <motion.circle
          cx="150"
          cy="150"
          r="75"
          fill="none"
          stroke="#59dad1"
          strokeWidth="2"
          strokeDasharray="15 35"
          animate={active ? { rotate: 360 } : {}}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{ originX: '150px', originY: '150px' }}
        />

        {/* Center Target Crosshairs */}
        <line x1="140" y1="150" x2="160" y2="150" stroke="#ffe16d" strokeWidth="1.5" />
        <line x1="150" y1="140" x2="150" y2="160" stroke="#ffe16d" strokeWidth="1.5" />

        {/* Coordinate Cardinal markers */}
        <text x="150" y="24" fill="#59dad1" fontSize="8" textAnchor="middle" fontFamily="monospace">
          BAC 2026 CORE
        </text>
        <text x="150" y="286" fill="#ffe16d" fontSize="7" textAnchor="middle" fontFamily="monospace">
          STRICT RAG ENGINE
        </text>
        <text x="18" y="153" fill="rgba(89, 218, 209, 0.6)" fontSize="7" textAnchor="middle" fontFamily="monospace">
          Nº 1954
        </text>
        <text x="282" y="153" fill="rgba(89, 218, 209, 0.6)" fontSize="7" textAnchor="middle" fontFamily="monospace">
          DZ-REF
        </text>
      </svg>
    </div>
  );
};
