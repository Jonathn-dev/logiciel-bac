import React from 'react';
import { Shield, Lock, Eye, KeyRound, Clock, UserCheck, AlertTriangle } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { ToggleSwitch } from '../../../components/settings/ToggleSwitch';
import { DangerAction } from '../../../components/settings/DangerAction';
import { settingsApi } from '../../../services/settingsApi';

export const PrivacySecurity: React.FC = () => {
  const { privacy, updatePrivacy, resetToDefaults } = useSettingsStore();

  const handleClearCache = async () => {
    await settingsApi.clearCache();
  };

  return (
    <div className="space-y-6">
      {/* 1. Progress Visibility */}
      <SettingsCard
        title="خصوصية الإنجازات والملف الشخصي (Progress Visibility)"
        subtitle="التحكم في من يمكنه رؤية تقدمك في البكالوريا وتصنيفك في لوحة الشرف الوطنية"
        icon={Eye}
        badge="Data Privacy"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'public' as const,
                title: 'عام (Public) 🌐',
                desc: 'الظهور في لوحة الشرف الوطنية وتحديات السرعة لمنافسة زملاء البكالوريا.',
              },
              {
                id: 'friends' as const,
                title: 'الأصدقاء فقط (Friends) 👥',
                desc: 'مشاركة الإنجازات فقط مع مجموعتك الدراسية المسجلة.',
              },
              {
                id: 'private' as const,
                title: 'خاص تماماً (Private) 🔒',
                desc: 'إخفاء إحصائياتك ونقاطك تماماً وجعل حسابك غير مرئي في لوحات المنافسة.',
              },
            ].map((vis) => (
              <button
                key={vis.id}
                type="button"
                onClick={() => updatePrivacy({ progressVisibility: vis.id })}
                className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                  privacy.progressVisibility === vis.id
                    ? 'border-teal-400 bg-teal-500/10 shadow-[0_0_20px_rgba(89,218,209,0.15)] ring-1 ring-teal-400/50'
                    : 'border-white/10 bg-[#070e2b] hover:border-white/20'
                }`}
              >
                <h5 className="text-xs sm:text-sm font-bold text-white mb-1">{vis.title}</h5>
                <p className="text-[11px] text-[#a2a6d0] leading-relaxed">{vis.desc}</p>
              </button>
            ))}
          </div>

          <ToggleSwitch
            checked={privacy.shareStudyStats}
            onChange={(checked) => updatePrivacy({ shareStudyStats: checked })}
            label="مشاركة إحصائيات المراجعة مجهولة الهوية لتحسين التوقعات"
            description="يساعد في تحسين توقعات مواضيع البكالوريا المحتملة بناءً على متوسط إتقان الطلاب"
          />

          <ToggleSwitch
            checked={privacy.allowAiTelemetry}
            onChange={(checked) => updatePrivacy({ allowAiTelemetry: checked })}
            label="تحسين دقة استجابات الذكاء الاصطناعي (AI Diagnostic Logs)"
            description="تسجيل الأخطاء المنهجية المكتشفة في المقالات لتحسين التقييم الوزاري المستمر"
          />
        </div>
      </SettingsCard>

      {/* 2. Security & Session Management */}
      <SettingsCard
        title="أمان الحساب والجلسات (Account Security)"
        subtitle="حماية حسابك وتشفير بيانات الملخصات والدفاتر المتجهة محلياً"
        icon={Lock}
        badge="AES-256 Encrypted"
      >
        <div className="space-y-4">
          <ToggleSwitch
            checked={privacy.twoFactorEnabled}
            onChange={(checked) => updatePrivacy({ twoFactorEnabled: checked })}
            label="تفعيل التحقق بخطوتين (2FA Authentication)"
            description="طلب رمز تأكيد إضافي عبر البريد الإلكتروني عند تسجيل الدخول من جهاز جديد"
            badge="أمان إضافي"
          />

          {/* Session timeout */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                مهلة قفل الجلسة التلقائي (Session Auto-Lock):
              </span>
              <span className="text-[11px] text-[#a2a6d0]">
                قفل المنصة وحماية دفاترك عند عدم النشاط
              </span>
            </div>
            <select
              value={privacy.sessionTimeoutMinutes}
              onChange={(e) => updatePrivacy({ sessionTimeoutMinutes: Number(e.target.value) })}
              className="p-2 rounded-xl bg-[#091338] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer font-mono"
            >
              <option value={15}>15 دقيقة</option>
              <option value={30}>30 دقيقة</option>
              <option value={60}>ساعة واحدة</option>
              <option value={180}>3 ساعات</option>
              <option value={0}>إيقاف القفل التلقائي</option>
            </select>
          </div>
        </div>
      </SettingsCard>

      {/* 3. Danger Zone */}
      <SettingsCard
        title="منطقة العمليات الحساسة وإعادة الضبط (Danger Zone)"
        subtitle="إجراءات مسح الذاكرة المؤقتة أو استعادة التهيئات الافتراضية"
        icon={AlertTriangle}
        variant="danger"
      >
        <div className="space-y-4">
          <DangerAction
            title="مسح الذاكرة المؤقتة للمتصفح (Clear Cache)"
            description="حذف الملفات المؤقتة والمسودات السريعة دون المساس بتقدمك أو نقاطك في البكالوريا"
            buttonLabel="مسح الذاكرة المؤقتة"
            onAction={handleClearCache}
            icon="reset"
          />

          <DangerAction
            title="إعادة تعيين جميع الإعدادات إلى الوضع المصنعي"
            description="إرجاع جميع التفضيلات، الألوان، وأوقات التنبيه إلى القيم الابتدائية"
            buttonLabel="استعادة الافتراضيات"
            confirmText="هل تريد حقاً استعادة إعدادات المصنع الافتراضية؟"
            onAction={resetToDefaults}
            icon="reset"
          />
        </div>
      </SettingsCard>
    </div>
  );
};
