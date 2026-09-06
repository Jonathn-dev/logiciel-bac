import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';

interface ThemePreviewProps {
  currentTheme: 'dark' | 'light' | 'system';
  onThemeSelect: (theme: 'dark' | 'light' | 'system') => void;
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  currentTheme,
  onThemeSelect,
}) => {
  const THEMES = [
    {
      id: 'dark' as const,
      name: 'الوضع الليلي الاحترافي (Dark Atlas)',
      desc: 'ألوان داكنة مريحة للعينين مع توهجات ذهبية وفيروزية تناسب جلسات المراجعة الطويلة',
      icon: Moon,
      bg: 'bg-[#04081c]',
      card: 'bg-[#081133]',
      accent: 'bg-amber-400',
    },
    {
      id: 'light' as const,
      name: 'الوضع النهاري المشرق (Light Crisp)',
      desc: 'خلفية نظيفة عالية التباين وخطوط واضحة للقراءة في الإضاءة النهارية',
      icon: Sun,
      bg: 'bg-[#f4f6fa]',
      card: 'bg-white text-stone-900',
      accent: 'bg-amber-600',
    },
    {
      id: 'system' as const,
      name: 'تلقائي حسب الجهاز (System)',
      desc: 'مزامنة مظهر التطبيق تلقائياً مع إعدادات نظام التشغيل والمفضلة لديك',
      icon: Monitor,
      bg: 'bg-gradient-to-r from-[#04081c] to-[#f4f6fa]',
      card: 'bg-stone-800',
      accent: 'bg-teal-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {THEMES.map((t) => {
        const isSelected = currentTheme === t.id;
        const Icon = t.icon;

        return (
          <motion.div
            key={t.id}
            whileHover={{ y: -2 }}
            onClick={() => onThemeSelect(t.id)}
            className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
              isSelected
                ? 'border-amber-400 bg-[#091338] shadow-[0_0_20px_rgba(255,225,109,0.15)] ring-1 ring-amber-400/50'
                : 'border-white/10 bg-[#060b22] hover:border-white/20'
            }`}
          >
            {/* Visual Mini Mockup */}
            <div className={`h-16 rounded-xl ${t.bg} p-2 flex flex-col justify-between overflow-hidden border border-white/10 relative`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </div>
                <div className={`w-3 h-3 rounded-full ${t.accent}`} />
              </div>
              <div className={`h-6 rounded-lg ${t.card} p-1 flex items-center gap-1`}>
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <div className="w-8 h-1 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Content info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-300' : 'text-[#a2a6d0]'}`} />
                  <span className="text-xs font-bold text-white">{t.name.split(' (')[0]}</span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 font-black" />
                  </div>
                )}
              </div>
              <p className="text-[10px] text-[#a2a6d0] leading-normal">{t.desc}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
