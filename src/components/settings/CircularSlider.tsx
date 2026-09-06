import React from 'react';
import { Clock, Zap } from 'lucide-react';

interface CircularSliderProps {
  value: number; // in minutes
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const CircularSlider: React.FC<CircularSliderProps> = ({
  value,
  onChange,
  min = 15,
  max = 180,
  step = 5,
}) => {
  const percentage = Math.round(((value - min) / (max - min)) * 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleQuickAdd = (amount: number) => {
    const next = Math.max(min, Math.min(max, value + amount));
    onChange(next);
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-[#081133] to-[#04081c] border border-white/10 space-y-4">
      {/* SVG Radial Progress */}
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 130 130">
          {/* Background circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-white/10 fill-none"
          />
          {/* Progress circle */}
          <circle
            cx="65"
            cy="65"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-amber-400 fill-none transition-all duration-300 shadow-lg"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <Clock className="w-4 h-4 text-amber-300 mb-0.5" />
          <span className="text-2xl font-black font-mono text-white leading-none">
            {value}
          </span>
          <span className="text-[10px] font-bold text-[#a2a6d0] mt-0.5">دقيقة / يوم</span>
        </div>
      </div>

      {/* Range Slider for granular control */}
      <div className="w-full space-y-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
        />
        <div className="flex items-center justify-between text-[10px] text-[#a2a6d0] font-mono">
          <span>{min} دقيقة (خفيف)</span>
          <span>90 دقيقة (متوسط)</span>
          <span>{max} دقيقة (مكثف)</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {[25, 45, 60, 90, 120].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
              value === preset
                ? 'bg-amber-400 text-stone-950 font-black shadow-md'
                : 'bg-white/5 text-[#a2a6d0] hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {preset} د
          </button>
        ))}
      </div>
    </div>
  );
};
