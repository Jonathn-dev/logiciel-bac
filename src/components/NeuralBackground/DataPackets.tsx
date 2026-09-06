import React from 'react';
import { motion } from 'motion/react';

interface DataPacketsProps {
  packetCount?: number;
  color?: string;
}

export const DataPackets: React.FC<DataPacketsProps> = ({
  packetCount = 6,
  color = '#59dad1',
}) => {
  const packets = Array.from({ length: packetCount }).map((_, i) => ({
    id: i,
    top: `${15 + (i * 14) % 75}%`,
    duration: 4 + (i % 3) * 1.5,
    delay: i * 0.8,
    size: 4 + (i % 3) * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {packets.map((pkt) => (
        <motion.div
          key={pkt.id}
          className="absolute rounded-full shadow-[0_0_12px_rgba(89,218,209,0.8)]"
          style={{
            top: pkt.top,
            width: pkt.size,
            height: pkt.size,
            backgroundColor: color,
          }}
          initial={{ left: '-5%', opacity: 0 }}
          animate={{
            left: '105%',
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: pkt.duration,
            repeat: Infinity,
            delay: pkt.delay,
            ease: 'linear',
          }}
        >
          {/* Glowing particle trail */}
          <div
            className="absolute top-1/2 -right-6 -translate-y-1/2 w-8 h-[2px] opacity-60 pointer-events-none"
            style={{
              background: `linear-gradient(to left, transparent, ${color})`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
};
