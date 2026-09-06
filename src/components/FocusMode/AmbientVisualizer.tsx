import React from 'react';
import { motion } from 'motion/react';
import { FocusModeState } from '../../types';
import { CloudRain, Coffee, Wind, Volume2, VolumeX } from 'lucide-react';

interface AmbientVisualizerProps {
  currentSound: FocusModeState['ambientSound'];
  volume: number;
  onSelectSound: (sound: FocusModeState['ambientSound']) => void;
  onVolumeChange: (vol: number) => void;
}

export const AmbientVisualizer: React.FC<AmbientVisualizerProps> = ({
  currentSound,
  volume,
  onSelectSound,
  onVolumeChange,
}) => {
  const soundOptions: {
    id: FocusModeState['ambientSound'];
    label: string;
    icon: any;
    desc: string;
  }[] = [
    { id: 'library_rain', label: 'مطر المكتبة', icon: CloudRain, desc: 'صوت مطر هادئ على زجاج المكتبة' },
    { id: 'study_cafe', label: 'مقهى الدراسة', icon: Coffee, desc: 'ضوضاء بنية دافئة للتركيز' },
    { id: 'lofi_breeze', label: 'نسيم Lo-Fi', icon: Wind, desc: 'موجات صوتية ناعمة للاستيعاب' },
    { id: 'none', label: 'صامت', icon: VolumeX, desc: 'بدون خلفية صوتية' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Sound Options List */}
      <div className="grid grid-cols-2 gap-2">
        {soundOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = currentSound === opt.id;
          return (
            <button
              key={opt.id}
              id={`btn-ambient-${opt.id}`}
              onClick={() => onSelectSound(opt.id)}
              className={`flex items-center gap-2 rounded-2xl border p-3 text-right transition-all ${
                isSelected
                  ? 'border-amber-500/60 bg-amber-500/15 text-amber-300 shadow-md'
                  : 'border-stone-800 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <div>
                <div className="text-xs font-bold">{opt.label}</div>
                <div className="text-[10px] text-stone-500 line-clamp-1">{opt.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Audio Visualizer Waves when Sound is Active */}
      {currentSound !== 'none' && (
        <div className="flex flex-col gap-2 rounded-2xl border border-stone-800 bg-stone-950/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-400 flex items-center gap-1.5">
              <Volume2 className="h-3.5 w-3.5 text-amber-400" />
              مستوى الصوت والتردد:
            </span>
            <span className="font-mono text-xs text-amber-400 font-bold">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Animated Frequency Bars */}
          <div className="flex h-8 items-end justify-center gap-1 py-1">
            {[0.4, 0.8, 0.6, 1, 0.5, 0.9, 0.7, 0.3, 0.85, 0.65, 0.95, 0.4].map(
              (heightRatio, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: [`${heightRatio * 30}%`, `${heightRatio * 100}%`, `${heightRatio * 40}%`],
                  }}
                  transition={{
                    duration: 0.6 + (i % 4) * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-amber-500 to-teal-400 opacity-80"
                />
              )
            )}
          </div>

          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-amber-400 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
