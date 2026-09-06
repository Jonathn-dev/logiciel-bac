import React from 'react';
import { motion } from 'motion/react';

interface BranchAnimatorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  active?: boolean;
}

export const BranchAnimator: React.FC<BranchAnimatorProps> = ({
  startX,
  startY,
  endX,
  endY,
  color = '#59dad1',
  active = true,
}) => {
  // Cubic Bezier curve path calculation
  const midX = (startX + endX) / 2;
  const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

  return (
    <g>
      {/* Background branch line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeOpacity="0.3"
      />

      {/* Animated growing pulse path */}
      {active && (
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeDasharray="6 12"
          initial={{ strokeDashoffset: 50 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      )}
    </g>
  );
};
