import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  BookOpen, 
  Map, 
  PenTool, 
  Flame, 
  Trophy, 
  Clock, 
  Settings,
  Sparkles,
  Calendar
} from 'lucide-react';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { ModeToggle } from '../StrictMode/ModeToggle';

interface NavbarProps {
  activeTab: 'plan' | 'maps' | 'essays' | 'quizzes' | 'timeline' | 'flashcards';
  setActiveTab: (tab: 'plan' | 'maps' | 'essays' | 'quizzes' | 'timeline' | 'flashcards') => void;
  xp: number;
  streakDays: number;
  strictMode: boolean;
  onToggleStrictMode: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  xp,
  streakDays,
  strictMode,
  onToggleStrictMode,
  onOpenSettings
}) => {
  // Algerian Bac countdown (approx June 2026)
  const [daysRemaining, setDaysRemaining] = useState<number>(100);

  useEffect(() => {
    const bacDate = new Date('2026-06-07T08:00:00');
    const now = new Date();
    const diff = Math.max(0, Math.ceil((bacDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    setDaysRemaining(diff);
  }, []);

  const navItems = [
    { id: 'plan', label: 'الخطة اليومية', icon: Compass },
    { id: 'maps', label: 'أطلس الخرائط', icon: Map },
    { id: 'essays', label: 'محرر المقالات (04/04)', icon: PenTool },
    { id: 'quizzes', label: 'حلبة الاختبارات', icon: Flame },
    { id: 'timeline', label: 'شريط التواريخ', icon: Clock },
    { id: 'flashcards', label: 'معجم المصطلحات', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#ffe16d]/20 bg-[#05081f]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 p-0.5 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <div className="w-full h-full bg-[#05081f] rounded-[14px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-wide">
                  أطلس وموجه بكالوريا الجزائر
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  BAC 2026
                </span>
              </div>
              <p className="text-[11px] text-[#a2a6d0] hidden sm:block">
                التاريخ والجغرافيا • المنهاج الوزاري الرسمي التفاعلي
              </p>
            </div>
          </div>

          {/* Gamification & Bac Countdown Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Days to BAC */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121743] border border-white/10 text-xs text-[#dfe0ff]">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>متبقي للبكالوريا:</span>
              <span className="font-bold text-amber-300 font-mono">{daysRemaining} يوم</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-950/40 border border-orange-500/30 text-xs font-bold text-orange-400">
              <Flame className="w-4 h-4 fill-orange-400 text-orange-400 animate-pulse" />
              <span>{streakDays} يوم</span>
            </div>

            {/* XP Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-400/30 text-xs font-bold text-amber-300">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{xp} XP</span>
            </div>

            {/* Strict Mode Toggle */}
            <div className="hidden lg:block">
              <ModeToggle strictMode={strictMode} onToggle={onToggleStrictMode} />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle variant="compact" />

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-[#121743] hover:bg-[#1a215b] border border-white/10 text-[#a2a6d0] hover:text-white transition-all cursor-pointer"
              title="الإعدادات وخيارات المنهاج"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 custom-scrollbar border-t border-white/5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                    : 'text-[#a2a6d0] hover:text-white hover:bg-[#121743]/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
