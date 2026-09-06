import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

interface ParallaxShelvesProps {
  reducedMotion?: boolean;
}

export const ParallaxShelves: React.FC<ParallaxShelvesProps> = ({ reducedMotion = false }) => {
  const { scrollY } = useScroll();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 3 Layers of Parallax translateY
  const layer1Y = useTransform(scrollY, [0, 1000], [0, -70]);
  const layer2Y = useTransform(scrollY, [0, 1000], [0, -140]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, -210]);

  useEffect(() => {
    if (reducedMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 15,
        y: (e.clientY / window.innerHeight - 0.5) * 15,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1329] via-[#080d1d] to-[#04070f]" />
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep Atmospheric Base */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_0%] from-[#0f1d3a] via-[#070b16] to-[#03060d]" />

      {/* Layer 1: Distant Archways & Ancient Maps (Slowest) */}
      <motion.div
        style={{ y: layer1Y, x: mousePos.x * 0.2 }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-12 left-10 h-72 w-96 rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent backdrop-blur-3xl" />
        <div className="absolute top-28 right-16 h-80 w-80 rounded-full border border-teal-500/20 bg-gradient-to-bl from-teal-500/5 to-transparent backdrop-blur-3xl" />
        
        {/* Subtle Moroccan Geometric Arch SVG Silhouette */}
        <svg className="absolute -top-10 left-1/2 h-96 -translate-x-1/2 stroke-amber-500/10 fill-none" viewBox="0 0 400 300">
          <path d="M 50 300 L 50 120 C 50 40, 200 10, 200 10 C 200 10, 350 40, 350 120 L 350 300" strokeWidth="2" />
          <circle cx="200" cy="110" r="45" strokeWidth="1.5" />
          <path d="M 200 65 L 200 155 M 155 110 L 245 110" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Layer 2: Midground Bookshelves & Manuscripts */}
      <motion.div
        style={{ y: layer2Y, x: mousePos.x * 0.5 }}
        className="absolute inset-x-0 top-0 h-[120vh] opacity-35"
      >
        {/* Left Library Shelf Segment */}
        <div className="absolute top-36 -left-12 flex flex-col gap-24">
          <div className="flex h-12 w-64 items-end gap-1.5 border-b-4 border-amber-900/60 bg-gradient-to-t from-amber-950/40 to-transparent p-2">
            <div className="h-10 w-4 rounded-t-sm bg-gradient-to-t from-emerald-900 to-emerald-700 shadow-sm" />
            <div className="h-11 w-5 rounded-t-sm bg-gradient-to-t from-amber-900 to-amber-700 shadow-sm" />
            <div className="h-9 w-3.5 rounded-t-sm bg-gradient-to-t from-cyan-950 to-cyan-800 shadow-sm" />
            <div className="h-12 w-6 rounded-t-sm bg-gradient-to-t from-rose-950 to-rose-800 shadow-sm" />
            <div className="h-8 w-4 rounded-t-sm bg-gradient-to-t from-yellow-900 to-yellow-700 shadow-sm" />
          </div>
          <div className="flex h-12 w-72 items-end gap-2 border-b-4 border-amber-900/60 bg-gradient-to-t from-amber-950/40 to-transparent p-2">
            <div className="h-12 w-6 rounded-t-sm bg-gradient-to-t from-amber-900 to-amber-700 shadow-sm" />
            <div className="h-10 w-5 rounded-t-sm bg-gradient-to-t from-teal-900 to-teal-700 shadow-sm" />
            <div className="h-11 w-4 rounded-t-sm bg-gradient-to-t from-indigo-950 to-indigo-800 shadow-sm" />
          </div>
        </div>

        {/* Right Library Shelf Segment */}
        <div className="absolute top-44 -right-12 flex flex-col gap-28">
          <div className="flex h-12 w-64 items-end justify-end gap-1.5 border-b-4 border-amber-900/60 bg-gradient-to-t from-amber-950/40 to-transparent p-2">
            <div className="h-11 w-5 rounded-t-sm bg-gradient-to-t from-indigo-900 to-indigo-700 shadow-sm" />
            <div className="h-9 w-4 rounded-t-sm bg-gradient-to-t from-amber-900 to-amber-700 shadow-sm" />
            <div className="h-12 w-6 rounded-t-sm bg-gradient-to-t from-teal-950 to-teal-800 shadow-sm" />
          </div>
        </div>
      </motion.div>

      {/* Layer 3: Foreground Ambient Dust & Light Beams (Fastest) */}
      <motion.div
        style={{ y: layer3Y, x: mousePos.x * 0.8 }}
        className="absolute inset-0 pointer-events-none opacity-40"
      >
        <div className="absolute -top-32 left-1/4 h-[800px] w-96 rotate-12 bg-gradient-to-b from-amber-200/10 via-amber-400/5 to-transparent blur-3xl" />
        <div className="absolute -top-32 right-1/4 h-[800px] w-80 -rotate-12 bg-gradient-to-b from-teal-200/10 via-teal-400/5 to-transparent blur-3xl" />
      </motion.div>
    </div>
  );
};
