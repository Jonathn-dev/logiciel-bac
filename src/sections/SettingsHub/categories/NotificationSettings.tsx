import React from 'react';
import { Bell, Flame, Award, Clock, Sparkles, Volume2, ShieldAlert } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { ToggleSwitch } from '../../../components/settings/ToggleSwitch';
import { NotificationMockup } from '../../../components/settings/NotificationMockup';

export const NotificationSettings: React.FC = () => {
  const { notifications, updateNotifications } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* 1. Master Toggle & Live Mockup */}
      <SettingsCard
        title="نظام الإشعارات والتنبيهات المنهجية"
        subtitle="تلقي تنبيهات الورد اليومي ومواعيد المراجعة للحفاظ على التتابع الأكاديمي (Streak)"
        icon={Bell}
        badge="Notification Core"
        headerAction={
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              notifications.master
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {notifications.master ? 'الإشعارات مفعلة ✅' : 'الإشعارات معطلة ⛔'}
          </span>
        }
      >
        <div className="space-y-5">
          <ToggleSwitch
            checked={notifications.master}
            onChange={(checked) => updateNotifications({ master: checked })}
            label="تفعيل مفتاح الإشعارات الرئيسي (Master Notification Toggle)"
            description="السماح للمنصة بإرسال تنبيهات المراجعة اليومية والبطاقات العاجلة للبكالوريا"
          />

          {/* Notification Live Mockup */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-[#a2a6d0] block">
              معاينة حية لشكل الإشعار على جهازك:
            </span>
            <NotificationMockup
              title="تذكير ورشة المقال التاريخي ⏳"
              body="حان وقت المراجعة اليومية! أنجز مقال 'هجمات الشمال القسنطيني 1955' الآن للحفاظ على شعلة الـ 18 يوماً!"
              time="18:30"
              type="reminder"
            />
          </div>
        </div>
      </SettingsCard>

      {/* 2. Granular Notification Preferences */}
      <SettingsCard
        title="تفضيلات الإشعارات التفصيلية والتوقيت"
        subtitle="حدد نوع ومواعيد الرسائل والتنبيهات التي ترغب في تلقيها"
        icon={Clock}
        badge="Timetable & Rules"
      >
        <div className="space-y-4">
          {/* Daily Reminder Time */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white block">
                توقيت التذكير اليومي بالمراجعة (Daily Reminder Time):
              </span>
              <span className="text-[11px] text-[#a2a6d0]">
                الساعة المناسبة لتنبيهك ببدء جلسة الحفظ والحل اليومية
              </span>
            </div>
            <input
              type="time"
              value={notifications.dailyReminderTime}
              onChange={(e) => updateNotifications({ dailyReminderTime: e.target.value })}
              className="p-2 rounded-xl bg-[#091338] border border-amber-400/40 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
            />
          </div>

          <ToggleSwitch
            checked={notifications.streakWarning}
            onChange={(checked) => updateNotifications({ streakWarning: checked })}
            label="إنذار خطر انطفاء الشعلة (Streak Saver Alert)"
            description={`إرسال تنبيه عاجل قبل ${notifications.streakWarningThreshold} ساعات من منتصف الليل في حال عدم إكمال الهدف اليومي`}
            badge="مهم للالتزام"
          />

          <ToggleSwitch
            checked={notifications.achievements}
            onChange={(checked) => updateNotifications({ achievements: checked })}
            label="إشعارات الأوسمة والترقيات (XP & Rank Level-Ups)"
            description="إشعارك عند فتح أوسمة جديدة أو الانتقال لمستوى أعلى في البكالوريا"
          />

          <ToggleSwitch
            checked={notifications.newChallenges}
            onChange={(checked) => updateNotifications({ newChallenges: checked })}
            label="تحديات السرعة والمسابقات اليومية"
            description="تنبيه عند توفر معارك أسبوعية جديدة في بنك المصطلحات وتوقيع الخرائط"
          />

          <ToggleSwitch
            checked={notifications.aiTips}
            onChange={(checked) => updateNotifications({ aiTips: checked })}
            label="نصائح الرفيق الذكي ومنهجية الإجابة"
            description="تلقي ومضات ذكية سريعة حول أخطاء شائعة في تصحيح البكالوريا الرسمية"
          />

          <ToggleSwitch
            checked={notifications.soundEnabled}
            onChange={(checked) => updateNotifications({ soundEnabled: checked })}
            label="المؤثرات الصوتية عند اكتمال المهام"
            description="تشغيل صوت نغمة الإنجاز عند إتمام الأهداف اليومية"
          />
        </div>
      </SettingsCard>
    </div>
  );
};
