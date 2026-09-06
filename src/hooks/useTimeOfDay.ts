import { useState, useEffect } from 'react';

export type TimePeriod = 'fajr' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeOfDayInfo {
  period: TimePeriod;
  arabicGreeting: string;
  periodLabel: string;
  iconName: 'Sun' | 'Moon' | 'Sunrise' | 'Sunset' | 'Sparkles';
  accentColor: string;
  glowColor: string;
  recommendedStudyMode: string;
}

export function useTimeOfDay(): TimeOfDayInfo {
  const getTimeInfo = (): TimeOfDayInfo => {
    const hour = new Date().getHours();

    if (hour >= 4 && hour < 7) {
      return {
        period: 'fajr',
        arabicGreeting: 'صباح الهمة والبركة الباكرة',
        periodLabel: 'وقت الفجر والتركيز الذهني الأقصى',
        iconName: 'Sunrise',
        accentColor: '#ffe16d',
        glowColor: 'rgba(255, 225, 109, 0.25)',
        recommendedStudyMode: 'حفظ المصطلحات والأعلام وتثبيت الخطوط الزمنية',
      };
    } else if (hour >= 7 && hour < 12) {
      return {
        period: 'morning',
        arabicGreeting: 'صباح التميز والإنتاجية',
        periodLabel: 'الفترة الصباحية',
        iconName: 'Sun',
        accentColor: '#ffdb3c',
        glowColor: 'rgba(255, 219, 60, 0.2)',
        recommendedStudyMode: 'صياغة المقالات التاريخية وتحليل الخرائط الجغرافية',
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        period: 'afternoon',
        arabicGreeting: 'مساء العطاء والمثابرة',
        periodLabel: 'فترة الظهيرة',
        iconName: 'Sun',
        accentColor: '#59dad1',
        glowColor: 'rgba(89, 218, 209, 0.2)',
        recommendedStudyMode: 'حل أسئلة الامتحانات الوطنية السابقة وتدقيق المصطلحات',
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        period: 'evening',
        arabicGreeting: 'مساء المراجعة الهادئة',
        periodLabel: 'الفترة المسائية',
        iconName: 'Sunset',
        accentColor: '#dee0ff',
        glowColor: 'rgba(222, 224, 255, 0.25)',
        recommendedStudyMode: 'المراجعة الذهنية الشاملة وتلخيص المفاهيم الأساسية',
      };
    } else {
      return {
        period: 'night',
        arabicGreeting: 'طابت ليلتك يا بطل البكالوريا',
        periodLabel: 'فترة الهدوء الليلي',
        iconName: 'Moon',
        accentColor: '#c1c4e6',
        glowColor: 'rgba(193, 196, 230, 0.15)',
        recommendedStudyMode: 'تصفح البطاقات التفاعلية السريعة ومراجعة إنجازات اليوم',
      };
    }
  };

  const [timeInfo, setTimeInfo] = useState<TimeOfDayInfo>(getTimeInfo);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeInfo(getTimeInfo());
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  return timeInfo;
}
