import React from 'react';
import { User, Mail, MapPin, GraduationCap, Calendar, Target, Award, FileText } from 'lucide-react';
import { useSettingsStore } from '../../../store/settingsStore';
import { SettingsCard } from '../SettingsCard';
import { AvatarUploader } from '../../../components/settings/AvatarUploader';
import { InlineEditor } from '../../../components/settings/InlineEditor';

const ALGERIA_WILAYAS = [
  '01 - أدرار', '02 - الشلف', '03 - الأغواط', '04 - أم البواقي', '05 - باتنة',
  '06 - بجاية', '07 - بسكرة', '08 - بشار', '09 - البليدة', '10 - البويرة',
  '11 - تمنراست', '12 - تبسة', '13 - تلمسان', '14 - تيارت', '15 - تيزي وزو',
  '16 - الجزائر العاصمة', '17 - الجلفة', '18 - جيجل', '19 - سطيف', '20 - سعيدة',
  '21 - سكيكدة', '22 - سيدي بلعباس', '23 - عنابة', '24 - قالمة', '25 - قسنطينة',
  '26 - المدية', '27 - مستغانم', '28 - المسيلة', '29 - معسكر', '30 - ورقلة',
  '31 - وهران', '32 - البيض', '33 - إليزي', '34 - برج بوعريريج', '35 - بومرداس',
  '36 - الطارف', '37 - تندوف', '38 - تسمسيلت', '39 - الوادي', '40 - خنشلة',
  '41 - سوق أهراس', '42 - تيبازة', '43 - ميلة', '44 - عين الدفلى', '45 - النعامة',
  '46 - عين تموشنت', '47 - غرداية', '48 - غليزان', '49 - تيميمون', '50 - برج باجي مختار',
  '51 - أولاد جلال', '52 - بني عباس', '53 - عين صالح', '54 - عين قزام', '55 - تقرت',
  '56 - جانت', '57 - المغير', '58 - المنيعة'
];

const BAC_STREAMS = [
  '3 ثانوي - شعبة آداب وفلسفة (مادة أساسية)',
  '3 ثانوي - شعبة لغات أجنبية',
  '3 ثانوي - شعبة تسيير واقتصاد (مادة أساسية)',
  '3 ثانوي - شعبة علوم تجريبية',
  '3 ثانوي - شعبة رياضيات',
  '3 ثانوي - شعبة تقني رياضي',
  'مترشح حر (Candidat Libre)',
];

export const AccountProfile: React.FC = () => {
  const { profile, updateProfile } = useSettingsStore();

  return (
    <div className="space-y-6">
      {/* 1. Avatar & Identity Header */}
      <SettingsCard
        title="الملف الشخصي وهوية المترشح"
        subtitle="إدارة بياناتك الشخصية، الولاية، الشعبة، والهدف السنوي للبكالوريا"
        icon={User}
        badge="BAC 2026 Profile"
      >
        <div className="space-y-6">
          <AvatarUploader
            currentAvatar={profile.avatar}
            name={profile.name}
            onAvatarChange={(newAvatar) => updateProfile({ avatar: newAvatar })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InlineEditor
              label="الاسم واللقب الكامل"
              value={profile.name}
              placeholder="مثال: مروان البارودي"
              onSave={(val) => updateProfile({ name: val })}
              badge="الاسم المعتمد"
            />

            <InlineEditor
              label="البريد الإلكتروني"
              value={profile.email}
              type="email"
              placeholder="student@gmail.com"
              onSave={(val) => updateProfile({ email: val })}
              description="يستخدم لإرسال التقارير الدورية واستعادة الحساب"
            />
          </div>
        </div>
      </SettingsCard>

      {/* 2. Academic Stream & Region */}
      <SettingsCard
        title="الشعبة والمسار الدراسي للبكالوريا"
        subtitle="تحديد الشعبة يساعد في تخصيص المعاملات والدروس وفق الإطار المرجعي لوزارة التربية الوطنية"
        icon={GraduationCap}
        badge="المنهاج الجزائري"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stream Select */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>الشعبة والمستوى الدراسي:</span>
            </label>
            <select
              value={profile.level}
              onChange={(e) => updateProfile({ level: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#091338] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {BAC_STREAMS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#a2a6d0]">
              شعب الآداب والتسيير تتميز بمعاملات أعلى في مادتي التاريخ والجغرافيا
            </p>
          </div>

          {/* Wilaya Select */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-300" />
              <span>الولاية (مركز الإجراء):</span>
            </label>
            <select
              value={profile.state}
              onChange={(e) => updateProfile({ state: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#091338] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {ALGERIA_WILAYAS.map((wilaya) => (
                <option key={wilaya} value={wilaya}>
                  {wilaya}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-[#a2a6d0]">
              تستخدم لتنسيق التوقيت المحلي ومواعيد الامتحانات التجريبية
            </p>
          </div>

          {/* Target Grade */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-300" />
                <span>العلامة المستهدفة في التاريخ والجغرافيا:</span>
              </span>
              <span className="font-mono text-sm font-black text-amber-300">
                {profile.targetGrade} / 20
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={20}
              step={0.5}
              value={profile.targetGrade}
              onChange={(e) => updateProfile({ targetGrade: Number(e.target.value) })}
              className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
            />
            <div className="flex items-center justify-between text-[10px] text-[#a2a6d0] font-mono">
              <span>10/20 (مقبول)</span>
              <span>15/20 (جيد جداً)</span>
              <span>20/20 (امتياز وطني)</span>
            </div>
          </div>

          {/* Target Bac Year */}
          <InlineEditor
            label="دورة البكالوريا المقررة"
            value={profile.bacYear}
            placeholder="2026"
            onSave={(val) => updateProfile({ bacYear: val })}
            badge="دورة جوان 2026"
            description="الامتحان الوطني الموحد دورة جوان 2026"
          />
        </div>

        {/* Bio / Motivation */}
        <div className="pt-2">
          <InlineEditor
            label="رسالة التحفيز والشعار الشخصي"
            value={profile.bio || ''}
            type="textarea"
            placeholder="اكتب عبارة تحفيزية تراها يومياً عند فتح المنصة..."
            onSave={(val) => updateProfile({ bio: val })}
            description="تظهر هذه العبارة في رأس لوحة التحكم لتشجيعك أثناء المراجعة"
          />
        </div>
      </SettingsCard>
    </div>
  );
};
