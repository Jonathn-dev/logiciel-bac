import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

interface FloatingShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  type: 'star8' | 'hexagon' | 'diamond' | 'arabesque';
  opacity: number;
}

export const ConstellationCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number; isHovering: boolean }>({
    x: -1000,
    y: -1000,
    isHovering: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize particles
    const particleCount = Math.min(65, Math.floor((width * height) / 18000));
    const particles: Particle[] = [];

    const colors = ['#f59e0b', '#fbbf24', '#38bdf8', '#2dd4bf', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    // Initialize floating geometric Islamic shapes
    const shapesCount = 7;
    const shapes: FloatingShape[] = [];
    const shapeTypes: ('star8' | 'hexagon' | 'diamond' | 'arabesque')[] = [
      'star8',
      'hexagon',
      'diamond',
      'arabesque',
    ];

    for (let i = 0; i < shapesCount; i++) {
      shapes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 45 + 35,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        type: shapeTypes[i % shapeTypes.length],
        opacity: Math.random() * 0.06 + 0.05, // Subtle 5-11% opacity
      });
    }

    const drawIslamicStar8 = (context: CanvasRenderingContext2D, size: number) => {
      const outerRadius = size;
      const innerRadius = size * 0.58;
      context.beginPath();
      for (let i = 0; i < 16; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / 8;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    };

    const drawHexagon = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = Math.cos(angle) * size;
        const y = Math.sin(angle) * size;
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.closePath();
    };

    const drawArabesque = (context: CanvasRenderingContext2D, size: number) => {
      context.beginPath();
      context.rect(-size / 2, -size / 2, size, size);
      context.stroke();
      context.beginPath();
      context.rotate(Math.PI / 4);
      context.rect(-size / 2, -size / 2, size, size);
      context.closePath();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw floating Islamic geometric shapes
      shapes.forEach((shape) => {
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;

        if (shape.x < -100) shape.x = width + 100;
        if (shape.x > width + 100) shape.x = -100;
        if (shape.y < -100) shape.y = height + 100;
        if (shape.y > height + 100) shape.y = -100;

        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        ctx.strokeStyle = '#fbbf24'; // Gold
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = shape.opacity;

        if (shape.type === 'star8') {
          drawIslamicStar8(ctx, shape.size);
          ctx.stroke();
        } else if (shape.type === 'hexagon') {
          drawHexagon(ctx, shape.size);
          ctx.stroke();
        } else if (shape.type === 'arabesque') {
          drawArabesque(ctx, shape.size);
          ctx.stroke();
        } else {
          drawIslamicStar8(ctx, shape.size * 0.7);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Update and draw particles
      const mouse = mousePosRef.current;
      const maxDistance = 120;
      const mouseMaxDistance = 160;

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        // Draw particle dot
        ctx.save();
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = p1.alpha;
        ctx.fill();
        ctx.restore();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = (1 - dist / maxDistance) * 0.18;
            ctx.stroke();
            ctx.restore();
          }
        }

        // Mouse interaction: constellation lines to cursor
        if (mouse.isHovering) {
          const mdx = p1.x - mouse.x;
          const mdy = p1.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouseMaxDistance) {
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 0.8;
            ctx.globalAlpha = (1 - mdist / mouseMaxDistance) * 0.35;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = {
        x: e.clientX,
        y: e.clientY,
        isHovering: true,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.isHovering = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-[#070b19] bg-gradient-to-br from-[#0a1128] via-[#102246] to-[#080d1f]" />
      
      {/* Morphing ambient color blobs */}
      <div className="absolute top-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-amber-500/10 blur-[130px] animate-pulse" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[140px] animate-pulse" />
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[110px]" />

      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
    </div>
  );
};
