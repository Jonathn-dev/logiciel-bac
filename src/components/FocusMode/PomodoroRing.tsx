import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Coffee, BookOpen } from 'lucide-react';

interface PomodoroRingProps {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  mode: 'study' | 'short_break' | 'long_break' | string;
  onToggle: () => void;
  onReset: (mins: number) => void;
}

export const PomodoroRing: React.FC<PomodoroRingProps> = ({
  minutes,
  seconds,
  isRunning,
  mode,
  onToggle,
  onReset,
}) => {
  const totalSeconds = mode === 'study' ? 25 * 60 : 5 * 60;
  const currentRemaining = minutes * 60 + seconds;
  const progressPercent = Math.max(0, Math.min(100, (1 - currentRemaining / totalSeconds) * 100));

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* SVG Circular Ring */}
      <div className="relative flex items-center justify-center">
        <svg className="h-44 w-44 -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
            fill="none"
          />
          {/* Active Animated Progress Arc */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={mode === 'study' ? '#f59e0b' : '#10b981'}
            strokeWidth="8"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: 'linear' }}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Center Time Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {mode === 'study' ? (
              <>
                <BookOpen className="h-3 w-3 text-amber-400" />
                <span>تركيز عميق</span>
              </>
            ) : (
              <>
                <Coffee className="h-3 w-3 text-emerald-400" />
                <span>استراحة قصيرة</span>
              </>
            )}
          </span>
          <div className="font-mono text-3xl font-black text-stone-100">
            {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-2">
        <button
          id="btn-pomodoro-toggle"
          onClick={onToggle}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            isRunning
              ? 'bg-stone-800 text-amber-400 border border-amber-500/30 hover:bg-stone-700'
              : 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 hover:brightness-110'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="h-3.5 w-3.5" />
              <span>إيقاف مؤقت</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>ابدأ الجلسة</span>
            </>
          )}
        </button>

        <button
          id="btn-pomodoro-reset-25"
          onClick={() => onReset(25)}
          className="rounded-xl border border-stone-700 bg-stone-800 p-2 text-stone-400 hover:text-stone-200"
          title="إعادة ضبط (25 دقيقة)"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        <button
          id="btn-pomodoro-break-5"
          onClick={() => onReset(5)}
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/20"
          title="استراحة 5 دقائق"
        >
          5د استراحة
        </button>
      </div>
    </div>
  );
};
