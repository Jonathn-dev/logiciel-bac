import React from 'react';
import { Target, Clock, BookOpen, Bot, Headphones, Award, Sparkles, Sliders } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { CircularSlider } from '../../../components/settings/CircularSlider';
import { DraggableRank } from '../../../components/settings/DraggableRank';
import { ToggleSwitch } from '../../../components/settings/ToggleSwitch';

export const LearningPreferences: React.FC = () => {
  const {
    dailyGoalMinutes,
    subjectPriority,
    difficultyBaseline,
    focusModeDefaults,
    aiPersona,
    updateLearning,
  } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* 1. Daily Study Target */}
      <SettingsCard
        title="الهدف الزمني اليومي (Daily Study Goal)"
        subtitle="تحديد عدد دقائق المراجعة اليومية المطلوبة لضمان استكمال كامل محاور المنهاج قبل شهر ماي"
        icon={Target}
        badge="BAC 2026 Target"
      >
        <div className="space-y-4">
          <CircularSlider
            value={dailyGoalMinutes}
            onChange={(val) => updateLearning({ dailyGoalMinutes: val })}
            min={15}
            max={180}
            step={5}
          />
        </div>
      </SettingsCard>

      {/* 2. Subject Priority Reordering */}
      <SettingsCard
        title="أسبقية المواد وتوزيع الجلسات (Subject Priority)"
        subtitle="رتّب المواد حسب حاجتك للتركيز لبرمجة جلسات المراجعة التلقائية في جدولك اليومي"
        icon={BookOpen}
        badge="Smart Scheduling"
      >
        <DraggableRank
          items={subjectPriority}
          onChange={(newPriority) => updateLearning({ subjectPriority: newPriority })}
        />
      </SettingsCard>

      {/* 3. AI Companion Persona */}
      <SettingsCard
        title="شخصية ونبرة الرفيق الذكي (AI Persona & Guidance Style)"
        subtitle="اختر الأسلوب التوجيهي الذي تفضله عند الاستفسار وتصحيح المقالات"
        icon={Bot}
        badge="AI Tutor"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'strict' as const,
              title: 'مفتش ومنهجي صارم 👨‍🏫',
              desc: 'يركز على معايير التنقيط الصارمة لوزارة التربية، يدقق في كل كلمة في المقال، ولا يتساهل مع المصطلحات غير الدقيقة.',
            },
            {
              id: 'friendly' as const,
              title: 'موجّه مشجع ومحفز 🌟',
              desc: 'يبسط المفاهيم بطرق تدريجية وسهلة الحفظ، مع التركيز على التحفيز الإيجابي والدعم النفسي المستمر.',
            },
            {
              id: 'concise' as const,
              title: 'موجز ونقاط مباشرة ⚡',
              desc: 'يقدم الإجابات في شكل نقاط ورؤوس أقلام مباشرة وسريعة للمراجعة في أوقات الضغط العالي.',
            },
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => updateLearning({ aiPersona: p.id })}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                aiPersona === p.id
                  ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(255,225,109,0.1)] ring-1 ring-amber-400/50'
                  : 'border-white/10 bg-[#070e2b] hover:border-white/20'
              }`}
            >
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-white mb-1">{p.title}</h5>
                <p className="text-[11px] text-[#a2a6d0] leading-relaxed">{p.desc}</p>
              </div>
              {aiPersona === p.id && (
                <span className="text-[10px] font-bold text-amber-300 self-end bg-amber-400/20 px-2 py-0.5 rounded">
                  المختار حالياً
                </span>
              )}
            </button>
          ))}
        </div>
      </SettingsCard>

      {/* 4. Focus Mode & Pomodoro Defaults */}
      <SettingsCard
        title="إعدادات وضع التركيز (Focus Mode & Pomodoro)"
        subtitle="تخصيص مدة جلسة الحفظ، فترات الاستراحة، والصوت المحيطي المهدئ"
        icon={Headphones}
        badge="Pomodoro Timer"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pomodoro Work Duration */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>مدة جلسة التركيز (Pomodoro Duration):</span>
                <span className="font-mono text-amber-300 font-bold">
                  {focusModeDefaults.pomodoroDuration} دقيقة
                </span>
              </label>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={focusModeDefaults.pomodoroDuration}
                onChange={(e) =>
                  updateLearning({
                    focusModeDefaults: {
                      ...focusModeDefaults,
                      pomodoroDuration: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>

            {/* Pomodoro Break Duration */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>مدة الاستراحة (Break Duration):</span>
                <span className="font-mono text-teal-300 font-bold">
                  {focusModeDefaults.breakDuration} دقيقة
                </span>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={focusModeDefaults.breakDuration}
                onChange={(e) =>
                  updateLearning({
                    focusModeDefaults: {
                      ...focusModeDefaults,
                      breakDuration: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-teal-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
              />
            </div>
          </div>

          {/* Ambient Sound Selection */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <label className="text-xs font-bold text-white block">
              الصوت المحيطي الافتراضي للتركيز (Ambient Sound):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'library' as const, label: 'أجواء مكتبة هادئة 📚' },
                { id: 'rain' as const, label: 'صوت مطر خفيف 🌧️' },
                { id: 'waves' as const, label: 'أمواج البحر الهادئ 🌊' },
                { id: 'silence' as const, label: 'صمت تام (بدون صوت) 🔇' },
              ].map((snd) => (
                <button
                  key={snd.id}
                  type="button"
                  onClick={() =>
                    updateLearning({
                      focusModeDefaults: {
                        ...focusModeDefaults,
                        ambientSound: snd.id,
                      },
                    })
                  }
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    focusModeDefaults.ambientSound === snd.id
                      ? 'border-teal-400 bg-teal-500/20 text-teal-200 font-bold'
                      : 'border-white/10 bg-[#091338] text-[#a2a6d0] hover:text-white'
                  }`}
                >
                  <span>{snd.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
