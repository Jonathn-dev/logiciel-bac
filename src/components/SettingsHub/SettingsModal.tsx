import React from 'react';
import { X, Settings, Shield, Bell, BookOpen, Clock, Sparkles } from 'lucide-react';
import { ToggleSwitch } from '../settings/ToggleSwitch';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  strictMode: boolean;
  onToggleStrictMode: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  strictMode,
  onToggleStrictMode,
  notificationsEnabled,
  onToggleNotifications,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090d2e] border border-amber-400/30 shadow-2xl p-6 sm:p-7 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">إعدادات المنهاج وتخصيص المذاكرة</h3>
              <p className="text-xs text-[#a2a6d0]">خيارات بكالوريا الجزائر الرسمية 2026</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a2a6d0] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toggles and Settings */}
        <div className="space-y-3">
          <ToggleSwitch
            label="الوضع الوزاري الصارم (Strict Mode)"
            description="الالتزام الحرفي بمصطلحات وشبكة تقويم وزارة التربية الوطنية الجزائرية دون اجتهادات خارجية."
            checked={strictMode}
            onChange={onToggleStrictMode}
          />

          <ToggleSwitch
            label="التنبيهات والمواعيد اليومية"
            description="إشعارك بمواعيد الكتل الزمنية وجلسات استرجاع الذاكرة قصيرة المدى."
            checked={notificationsEnabled}
            onChange={onToggleNotifications}
          />
        </div>

        {/* Curriculum Info Box */}
        <div className="p-4 rounded-2xl bg-[#05081f] border border-white/10 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>الشعب المدعومة في هذا التطبيق:</span>
          </div>
          <p className="text-[#a2a6d0] leading-relaxed">
            آداب وفلسفة، لغات أجنبية، علوم تجريبية، رياضيات، تقني رياضي، تسيير واقتصاد.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs sm:text-sm cursor-pointer transition-all"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
