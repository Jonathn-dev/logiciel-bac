import React from 'react';
import { Palette, Eye, Type, Sparkles, Monitor, Languages, Zap } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { ThemePreview } from '../../../components/settings/ThemePreview';
import { ToggleSwitch } from '../../../components/settings/ToggleSwitch';

export const AppearanceSettings: React.FC = () => {
  const {
    theme,
    animationIntensity,
    fontSize,
    reducedMotion,
    language,
    highContrast,
    setTheme,
    updateAppearance,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* 1. Theme Selector */}
      <SettingsCard
        title="سمة النظام والمظهر البصري (Theme Palette)"
        subtitle="اختر النمط البصري المناسب لظروف الإضاءة وراحتك البصرية أثناء الدراسة والمراجعة"
        icon={Palette}
        badge="UI Theme"
      >
        <ThemePreview currentTheme={theme} onThemeSelect={setTheme} />
      </SettingsCard>

      {/* 2. Typography & Font Size */}
      <SettingsCard
        title="الخطوط وحجم النصوص (Typography & Scale)"
        subtitle="ضبط مقاسات الخطوط العربية (Playfair & Amiri & Tajawal) لتحسين مقروئية المقالات والوثائق التاريخية"
        icon={Type}
        badge="Font Scale"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'small' as const, label: 'حجم مدمج (Small)', desc: 'عرض كمية أكبر من الوثائق والخرائط' },
              { id: 'medium' as const, label: 'حجم قياسي (Medium)', desc: 'الحجم الافتراضي الموصى به للمنصة' },
              { id: 'large' as const, label: 'حجم مكبر (Large)', desc: 'وضوح فائق ومريح للقراءة السريعة' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => updateAppearance({ fontSize: f.id })}
                className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                  fontSize === f.id
                    ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(255,225,109,0.15)] ring-1 ring-amber-400/50'
                    : 'border-white/10 bg-[#070e2b] hover:border-white/20'
                }`}
              >
                <span className="text-xs font-bold text-white block">{f.label}</span>
                <span className="text-[11px] text-[#a2a6d0] mt-0.5 block">{f.desc}</span>
              </button>
            ))}
          </div>

          {/* Text Sample Preview */}
          <div className="p-4 rounded-2xl bg-[#060b22] border border-white/5 space-y-1">
            <span className="text-[10px] text-[#a2a6d0] font-mono">معاينة النص الحي المباشر:</span>
            <p
              className={`text-[#dfe0ff] leading-relaxed font-serif ${
                fontSize === 'small' ? 'text-xs' : fontSize === 'large' ? 'text-base' : 'text-sm'
              }`}
            >
              « معايير تشكل العالم غداة 1945: تاريخياً وسياسياً بروز القوتين العظميين، وتأسيس هيئة الأمم المتحدة في 24 أكتوبر 1945 لحفظ الأمن والسلم الدوليين. »
            </p>
          </div>
        </div>
      </SettingsCard>

      {/* 3. Motion & Accessibility */}
      <SettingsCard
        title="الحركات والتأثيرات وسهولة الاستخدام (Motion & FX)"
        subtitle="التحكم في سلاسة الانتقالات، الحركات ثلاثية الأبعاد ودرجة التباين"
        icon={Zap}
        badge="Performance & Motion"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            {[
              { id: 'low' as const, label: 'حركات خفيفة (Low FX)', sub: 'أداء أسرع للأجهزة الضعيفة' },
              { id: 'medium' as const, label: 'حركات متوازنة (Balanced)', sub: 'سلاسة طبيعية ومثالية' },
              { id: 'high' as const, label: 'تأثيرات فائقة (Full 3D)', sub: 'توهجات وارتدادات كاملة' },
            ].map((anim) => (
              <button
                key={anim.id}
                type="button"
                onClick={() => updateAppearance({ animationIntensity: anim.id })}
                className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                  animationIntensity === anim.id
                    ? 'border-teal-400 bg-teal-500/10 text-teal-300'
                    : 'border-white/10 bg-[#070e2b] text-[#a2a6d0]'
                }`}
              >
                <span className="text-xs font-bold block text-white">{anim.label}</span>
                <span className="text-[10px] block text-[#a2a6d0]">{anim.sub}</span>
              </button>
            ))}
          </div>

          <ToggleSwitch
            checked={reducedMotion}
            onChange={(checked) => updateAppearance({ reducedMotion: checked })}
            label="تقليل الحركة (Reduced Motion)"
            description="إيقاف التأثيرات الحركية السريعة والاهتزازات للمساعدة على التركيز"
          />

          <ToggleSwitch
            checked={highContrast}
            onChange={(checked) => updateAppearance({ highContrast: checked })}
            label="وضع التباين العالي (High Contrast Mode)"
            description="زيادة حدة الحدود وتفتيح النصوص لسهولة القراءة في ضوء الشمس"
          />
        </div>
      </SettingsCard>

      {/* 4. Language Selection */}
      <SettingsCard
        title="لغة الواجهة (Interface Language)"
        subtitle="اللغة المعتمدة لعناصر التحكم والرسائل في المنصة"
        icon={Languages}
        badge="Language"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'ar' as const, label: 'العربية 🇩🇿 (اللغة الرسمية)', active: true },
            { id: 'fr' as const, label: 'Français 🇫🇷 (قريباً)', active: false },
            { id: 'en' as const, label: 'English 🇬🇧 (قريباً)', active: false },
          ].map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => lang.active && updateAppearance({ language: lang.id })}
              disabled={!lang.active}
              className={`p-3.5 rounded-2xl border text-right transition-all ${
                language === lang.id
                  ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-black'
                  : lang.active
                  ? 'border-white/10 bg-[#070e2b] text-white hover:border-white/20 cursor-pointer'
                  : 'border-white/5 bg-white/[0.02] text-[#a2a6d0]/40 cursor-not-allowed'
              }`}
            >
              <span className="text-xs font-bold block">{lang.label}</span>
            </button>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
};
