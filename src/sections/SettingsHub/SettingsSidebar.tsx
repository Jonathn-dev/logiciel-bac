import React from 'react';
import {
  User,
  BookMarked,
  Palette,
  Bell,
  Target,
  Shield,
  CreditCard,
  Download,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const SETTINGS_CATEGORIES = [
  {
    id: 'account',
    label: 'الحساب الشخصي',
    subtitle: 'الهوية والشعبة والولاية',
    icon: User,
    badge: 'BAC 2026',
  },
  {
    id: 'notebooks',
    label: 'إدارة الملخصات (RAG)',
    subtitle: 'حارس السياق والوضع الصارم',
    icon: BookMarked,
    badge: 'Zero Hallucination',
  },
  {
    id: 'appearance',
    label: 'المظهر والعرض',
    subtitle: 'السمة والخطوط والتأثيرات',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'الإشعارات والتنبيهات',
    subtitle: 'الورد اليومي وإنذار الشعلة',
    icon: Bell,
  },
  {
    id: 'learning',
    label: 'تفضيلات التعلم',
    subtitle: 'الهدف اليومي وأسلوب الرفيق',
    icon: Target,
  },
  {
    id: 'privacy',
    label: 'الخصوصية والأمان',
    subtitle: 'الظهور والتحقق ومهلة القفل',
    icon: Shield,
  },
  {
    id: 'subscription',
    label: 'الاشتراك والفوترة',
    subtitle: 'باقات التفوق واستهلاك السحابة',
    icon: CreditCard,
    badge: 'PRO BAC',
  },
  {
    id: 'backup',
    label: 'النسخ والتصدير',
    subtitle: 'تصدير JSON وتقارير MD',
    icon: Download,
  },
];

interface SettingsSidebarProps {
  activeCategory: string;
  onSelectCategory: (id: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const { profile, subscription } = useSettingsStore();

  return (
    <div className="w-full lg:w-72 shrink-0 space-y-4">
      {/* Mini Profile Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-b from-[#091338] to-[#050b24] border border-amber-400/20 shadow-lg text-right flex items-center gap-3">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-xs sm:text-sm font-bold text-white truncate">{profile.name}</h4>
          <p className="text-[11px] text-amber-300 font-mono font-bold truncate">
            {profile.level.split(' - ')[1] || profile.level}
          </p>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="space-y-1.5 p-2 rounded-2xl bg-[#060b22]/90 border border-white/10 backdrop-blur-xl">
        {SETTINGS_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full p-3 rounded-xl flex items-center justify-between text-right transition-all cursor-pointer group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-amber-400/10 text-white border border-amber-400/40 shadow-sm'
                  : 'text-[#a2a6d0] hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-md'
                      : 'bg-white/5 text-[#a2a6d0] group-hover:text-amber-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold block">{cat.label}</span>
                  <span className="text-[10px] text-[#a2a6d0] block truncate">
                    {cat.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {cat.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-amber-400/30 text-amber-300 border border-amber-400/40'
                        : 'bg-white/5 text-[#a2a6d0]'
                    }`}
                  >
                    {cat.badge}
                  </span>
                )}
                <ChevronLeft
                  className={`w-4 h-4 transition-transform ${
                    isActive ? 'text-amber-400 -translate-x-0.5' : 'text-white/20'
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
