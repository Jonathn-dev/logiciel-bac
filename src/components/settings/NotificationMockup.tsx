import React from 'react';
import { Bell, Flame, Sparkles, Award } from 'lucide-react';

interface NotificationMockupProps {
  title?: string;
  body?: string;
  time?: string;
  type?: 'reminder' | 'streak' | 'achievement' | 'tip';
}

export const NotificationMockup: React.FC<NotificationMockupProps> = ({
  title = 'تذكير ورد الحفظ اليومي ⏳',
  body = 'تبقى لك 25 دقيقة فقط لإكمال هدفك اليومي وتثبيت مصطلحات الحرب الباردة قبل منتصف الليل!',
  time = 'الآن',
  type = 'reminder',
}) => {
  const getIcon = () => {
    switch (type) {
      case 'streak':
        return <Flame className="w-4 h-4 text-orange-400" />;
      case 'achievement':
        return <Award className="w-4 h-4 text-amber-300" />;
      case 'tip':
        return <Sparkles className="w-4 h-4 text-teal-300" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-[#091338]/90 border border-amber-400/30 shadow-lg shadow-black/40 text-right space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
            {getIcon()}
          </div>
          <span className="font-bold text-white">أطلس البكالوريا • إشعار فوري</span>
        </div>
        <span className="text-[#a2a6d0] font-mono text-[10px]">{time}</span>
      </div>

      <div className="space-y-0.5 pr-8">
        <h5 className="text-xs font-bold text-amber-300">{title}</h5>
        <p className="text-[11px] text-[#dfe0ff] leading-relaxed">{body}</p>
      </div>
    </div>
  );
};
