import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface FloatingLanternsProps {
  reducedMotion?: boolean;
}

export const FloatingLanterns: React.FC<FloatingLanternsProps> = ({ reducedMotion = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const lanterns = [
      { x: width * 0.12, baseOffset: 40, size: 28, swingSpeed: 0.0018, swingAmp: 0.08, phase: 0 },
      { x: width * 0.88, baseOffset: 60, size: 34, swingSpeed: 0.0015, swingAmp: 0.06, phase: 1.5 },
      { x: width * 0.04, baseOffset: 110, size: 24, swingSpeed: 0.0021, swingAmp: 0.1, phase: 3.1 },
      { x: width * 0.95, baseOffset: 95, size: 26, swingSpeed: 0.0019, swingAmp: 0.07, phase: 4.2 },
    ];

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 16;

      lanterns.forEach((l, idx) => {
        // Adjust x if resized
        const currentX = idx === 0 ? width * 0.12 : idx === 1 ? width * 0.88 : idx === 2 ? width * 0.04 : width * 0.95;
        const angle = Math.sin(time * l.swingSpeed + l.phase) * l.swingAmp;
        const cordLength = l.baseOffset + Math.sin(time * 0.001 + idx) * 8;

        ctx.save();
        ctx.translate(currentX, 0);
        ctx.rotate(angle);

        // Hanging Cord
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, cordLength);
        ctx.strokeStyle = 'rgba(180, 140, 80, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Top Cap
        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.moveTo(-l.size * 0.4, cordLength);
        ctx.lineTo(l.size * 0.4, cordLength);
        ctx.lineTo(l.size * 0.25, cordLength - 6);
        ctx.lineTo(-l.size * 0.25, cordLength - 6);
        ctx.closePath();
        ctx.fill();

        // Lantern Body
        const bodyTop = cordLength;
        const bodyHeight = l.size * 1.3;
        const bodyWidth = l.size;

        // Radial Glow
        const flicker = 0.85 + Math.sin(time * 0.008 + idx * 2) * 0.15;
        const glowRadius = l.size * 3.5 * flicker;
        const grad = ctx.createRadialGradient(0, bodyTop + bodyHeight * 0.5, 2, 0, bodyTop + bodyHeight * 0.5, glowRadius);
        grad.addColorStop(0, 'rgba(255, 200, 90, 0.35)');
        grad.addColorStop(0.5, 'rgba(255, 150, 40, 0.12)');
        grad.addColorStop(1, 'rgba(255, 120, 20, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, bodyTop + bodyHeight * 0.5, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glass Frame
        ctx.fillStyle = 'rgba(255, 220, 130, 0.25)';
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-bodyWidth * 0.5, bodyTop, bodyWidth, bodyHeight, 6);
        ctx.fill();
        ctx.stroke();

        // Inner Flame
        ctx.fillStyle = `rgba(255, 240, 180, ${0.9 * flicker})`;
        ctx.shadowColor = '#ffaa33';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.ellipse(0, bodyTop + bodyHeight * 0.55, l.size * 0.18, l.size * 0.32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Bottom tassel
        ctx.beginPath();
        ctx.moveTo(0, bodyTop + bodyHeight);
        ctx.lineTo(0, bodyTop + bodyHeight + 12);
        ctx.strokeStyle = '#b8860b';
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-96 w-full opacity-90"
      aria-hidden="true"
    />
  );
};
