import React from 'react';
import { CreditCard, Sparkles, Crown, Check, Zap, Database, Cpu, Image, ArrowRight } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { PlanBadge } from '../../../components/settings/PlanBadge';
import { UsageMeter } from '../../../components/settings/UsageMeter';
import { useSubscription } from '../../../hooks/useSubscription';

export const SubscriptionSettings: React.FC = () => {
  const { subscription } = useSettingsStore();
  const { isPro } = useSubscription();

  return (
    <div className="space-y-6">
      {/* 1. Current Plan Card */}
      <SettingsCard
        title="حالة الاشتراك والباقة المعتمدة"
        subtitle="تفاصيل باقتك الدراسية وميزات الذكاء الاصطناعي المفعلة لشهادة البكالوريا"
        icon={CreditCard}
        badge="BAC 2026 Plan"
        variant="amber"
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#091338] border border-amber-400/30">
            <div className="space-y-1.5">
              <span className="text-[11px] text-[#a2a6d0] block">الباقة الحالية:</span>
              <PlanBadge plan={subscription.plan} status={subscription.status} />
              <p className="text-xs text-[#a2a6d0] mt-1">
                تاريخ انتهاء الصلاحية:{' '}
                <span className="text-white font-mono font-bold">{subscription.expiresAt}</span> (تغطي كامل فترة الامتحانات الوطنية)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
              >
                <Crown className="w-4 h-4" />
                <span>ترقية إلى باقة الأكاديمية VIP</span>
              </button>
            </div>
          </div>

          {/* Usage Meters Grid */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white">استهلاك الموارد السحابية الشهرية:</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <UsageMeter
                label="استعلامات الذكاء الاصطناعي (AI Queries)"
                used={subscription.aiQueriesUsed}
                limit={subscription.aiQueriesLimit}
                unit="طلب"
                icon={Cpu}
                color="amber"
              />

              <UsageMeter
                label="حجم الذاكرة المتجهية (Vector DB)"
                used={subscription.vectorStorageUsedMb}
                limit={subscription.vectorStorageLimitMb}
                unit="MB"
                icon={Database}
                color="teal"
              />

              <UsageMeter
                label="المسح الضوئي للخرائط والمقالات (OCR)"
                used={subscription.ocrScansUsed}
                limit={subscription.ocrScansLimit}
                unit="مسح"
                icon={Image}
                color="purple"
              />
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* 2. Compare Plans */}
      <SettingsCard
        title="مقارنة باقات البكالوريا المتاحة"
        subtitle="جميع الباقات مصممة ومبرمجة لخدمة طلاب البكالوريا في الجزائر"
        icon={Crown}
        badge="Upgrade Tiers"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#060b22] border border-white/10 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white block">الباقة الأساسية المجانية</span>
              <span className="text-xl font-black text-white font-mono">0 دج</span>
              <span className="text-[10px] text-[#a2a6d0] block">دائماً مجانية</span>
            </div>
            <ul className="space-y-2 text-xs text-[#a2a6d0]">
              <li className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> تصفح جميع دروس المنهاج
              </li>
              <li className="flex items-center gap-2 text-white">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> بنك المصطلحات والتواريخ
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-white/30" /> 100 استعلام ذكاء اصطناعي شهرياً
              </li>
            </ul>
          </div>

          {/* PRO BAC (Current) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#091338] border-2 border-amber-400 shadow-[0_0_30px_rgba(255,225,109,0.15)] space-y-4 relative">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-black text-[10px]">
              الباقة النشطة
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300 block">باقة التفوق BAC PRO</span>
              <span className="text-xl font-black text-white font-mono">1,800 دج</span>
              <span className="text-[10px] text-[#a2a6d0] block">اشتراك سنوي لكامل الموسم</span>
            </div>
            <ul className="space-y-2 text-xs text-white">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> 2,500 استعلام فوري فائق السرعة
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> فاحص المقالات والمنهجية الوزارية
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> 50MB تخزين متجهي لملخصات الطالب
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-400" /> وضع RAG الصارم بلا هلوسة
              </li>
            </ul>
          </div>

          {/* VIP Academy */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#081335] border border-purple-400/40 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-purple-300 block">أكاديمية الامتياز VIP</span>
              <span className="text-xl font-black text-white font-mono">3,500 دج</span>
              <span className="text-[10px] text-[#a2a6d0] block">شامل الدعم الفردي والمراجعات</span>
            </div>
            <ul className="space-y-2 text-xs text-white">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" /> استعلامات غير محدودة (Unlimited)
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" /> تحليل ومقارنة خطوط اليد بالـ OCR
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-400" /> تصحيح مقالات فردي مباشر مع أساتذة
              </li>
            </ul>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
