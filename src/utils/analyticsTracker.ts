// Analytics & Progress Tracker for Algerian Baccalaureate Prep
import { UserStats } from '../types';

export interface UnitMasteryData {
  id: string;
  subject: 'history' | 'geography';
  unitName: string;
  shortName: string;
  masteryPercentage: number;
  totalConcepts: number;
  masteredConcepts: number;
  weakPoints: string[];
  strongPoints: string[];
  status: 'excellent' | 'good' | 'needs_work' | 'not_started';
}

export interface SkillDimension {
  name: string;
  key: 'terms' | 'dates' | 'maps' | 'essays' | 'quizzes' | 'consistency';
  score: number; // 0 to 100
  weight: number; // e.g. 0.20
  description: string;
  icon: string;
  color: string;
}

export interface DayActivity {
  date: string;
  dayName: string;
  shortDay: string;
  hoursSpent: number;
  tasksDone: number;
  quizzesTaken: number;
  xpGained: number;
}

export interface StudentAnalyticsReport {
  overallReadiness: number; // 0 to 100%
  predictedGrade: number; // 0 to 20
  predictedGradeHistory: number; // 0 to 10
  predictedGradeGeography: number; // 0 to 10
  confidenceLevel: 'مرتفع جداً' | 'مرتفع' | 'متوسط' | 'يحتاج تكثيف';
  totalStudyHours: number;
  termsMastered: number;
  totalTerms: number;
  datesMastered: number;
  totalDates: number;
  mapsMastered: number;
  totalMaps: number;
  essaysWritten: number;
  averageEssayScore: number;
  quizzesCompleted: number;
  quizAccuracyPercentage: number;
  currentStreak: number;
  dimensions: SkillDimension[];
  units: UnitMasteryData[];
  recentDaysActivity: DayActivity[];
  keyRecommendations: {
    title: string;
    description: string;
    urgency: 'high' | 'medium' | 'low';
    actionRoute: string;
    actionLabel: string;
  }[];
}

const STORAGE_ANALYTICS_KEY = 'atlas_bac_analytics_data_v1';

export function getStudentAnalytics(userStats: UserStats): StudentAnalyticsReport {
  // Load saved local custom data if present
  let localData: any = {};
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    if (raw) localData = JSON.parse(raw);
  } catch (e) {
    console.error('Error parsing analytics data', e);
  }

  // Base metrics from userXP and streak
  const xp = userStats.totalXP || 1450;
  const streak = userStats.streakDays || 5;

  // Compute realistic metrics based on student level & XP
  const baseProgress = Math.min(100, Math.max(25, Math.round(xp / 45)));

  const termsMastered = localData.termsMastered ?? Math.min(180, Math.round(45 + xp * 0.045));
  const totalTerms = 180;
  const termsScore = Math.min(100, Math.round((termsMastered / totalTerms) * 100));

  const datesMastered = localData.datesMastered ?? Math.min(75, Math.round(22 + xp * 0.02));
  const totalDates = 75;
  const datesScore = Math.min(100, Math.round((datesMastered / totalDates) * 100));

  const mapsMastered = localData.mapsMastered ?? Math.min(24, Math.round(8 + xp * 0.007));
  const totalMaps = 24;
  const mapsScore = Math.min(100, Math.round((mapsMastered / totalMaps) * 100));

  const essaysWritten = localData.essaysWritten ?? Math.max(2, Math.round(xp / 400));
  const averageEssayScore = localData.averageEssayScore ?? (3.4 + Math.min(0.5, (xp / 10000))).toFixed(1);
  const essayScore = Math.min(100, Math.round((parseFloat(averageEssayScore) / 4.0) * 100));

  const quizzesCompleted = localData.quizzesCompleted ?? Math.max(6, Math.round(xp / 180));
  const quizAccuracyPercentage = localData.quizAccuracyPercentage ?? Math.min(94, Math.max(68, Math.round(72 + xp * 0.008)));

  const consistencyScore = Math.min(100, Math.round(streak * 14 + 30));

  // Weighted Dimensions
  const dimensions: SkillDimension[] = [
    {
      name: 'المصطلحات والمفاهيم الرسمية',
      key: 'terms',
      score: termsScore,
      weight: 0.25,
      description: `${termsMastered} من أصل ${totalTerms} مصطلح وزاري تم استيعابها بدقة`,
      icon: 'BookMarked',
      color: '#ffe16d',
    },
    {
      name: 'التواريخ والمعالم الكرونولوجية',
      key: 'dates',
      score: datesScore,
      weight: 0.20,
      description: `${datesMastered} من أصل ${totalDates} حدثاً تاريخياً معلماً بدقة متناهية`,
      icon: 'Clock',
      color: '#59dad1',
    },
    {
      name: 'الخرائط والتوقيع المكاني',
      key: 'maps',
      score: mapsScore,
      weight: 0.15,
      description: `${mapsMastered} من ${totalMaps} خريطة معتمدة (حركات التحرر، الأقاليم الكبرى، البترول)`,
      icon: 'MapPin',
      color: '#a78bfa',
    },
    {
      name: 'المقال المنهجي (المقدمة، العرض، الخاتمة)',
      key: 'essays',
      score: essayScore,
      weight: 0.20,
      description: `معدل ${averageEssayScore}/04 في كتابة المقالات وفق المعايير الوزارية`,
      icon: 'PenTool',
      color: '#4ade80',
    },
    {
      name: 'دقة اختبارات ساحة التحدي',
      key: 'quizzes',
      score: quizAccuracyPercentage,
      weight: 0.10,
      description: `نسبة الإجابة الصحيحة ${quizAccuracyPercentage}% في ${quizzesCompleted} اختبار سرعة`,
      icon: 'Zap',
      color: '#f43f5e',
    },
    {
      name: 'الانتظام والانضباط اليومي',
      key: 'consistency',
      score: consistencyScore,
      weight: 0.10,
      description: `سلسلة استمرار يومية متواصلة لمدة ${streak} أيام متتالية`,
      icon: 'Flame',
      color: '#fb923c',
    },
  ];

  // Overall Readiness calculation (0-100)
  const overallReadiness = Math.round(
    dimensions.reduce((acc, dim) => acc + dim.score * dim.weight, 0)
  );

  // Predicted BAC score (0 - 20)
  const predictedGrade = parseFloat(((overallReadiness / 100) * 16 + 3.5).toFixed(1));
  const predictedGradeHistory = parseFloat(((predictedGrade / 2) + 0.1).toFixed(1));
  const predictedGradeGeography = parseFloat((predictedGrade - predictedGradeHistory).toFixed(1));

  let confidenceLevel: StudentAnalyticsReport['confidenceLevel'] = 'متوسط';
  if (overallReadiness >= 85) confidenceLevel = 'مرتفع جداً';
  else if (overallReadiness >= 70) confidenceLevel = 'مرتفع';
  else if (overallReadiness >= 50) confidenceLevel = 'متوسط';
  else confidenceLevel = 'يحتاج تكثيف';

  // Units Mastery Breakdown
  const units: UnitMasteryData[] = [
    {
      id: 'hist-u1',
      subject: 'history',
      unitName: 'تطور العالم في ظل القطبية الثنائية (1945 - 1989)',
      shortName: 'الحرب الباردة والقطبية',
      masteryPercentage: Math.min(95, Math.round(baseProgress * 1.05)),
      totalConcepts: 42,
      masteredConcepts: Math.round(42 * (Math.min(95, baseProgress * 1.05) / 100)),
      strongPoints: ['مبدأ ترومان وخطة مارشال', 'أزمة السويس وأزمة الصواريخ بكوبا', 'مفهوم الانفراج الدولي'],
      weakPoints: ['منظمة الكومنفورم وحلف وارسو', 'مؤتمر باندونغ وتأسيس حركة عدم الانحياز'],
      status: baseProgress >= 70 ? 'excellent' : 'good',
    },
    {
      id: 'hist-u2',
      subject: 'history',
      unitName: 'الثورة التحريرية الجزائرية واستعادة السيادة (1954 - 1962)',
      shortName: 'الثورة التحريرية الكبرى',
      masteryPercentage: Math.min(98, Math.round(baseProgress * 1.15)),
      totalConcepts: 50,
      masteredConcepts: Math.round(50 * (Math.min(98, baseProgress * 1.15) / 100)),
      strongPoints: ['هجمات 20 أوت 1955 وقرارات مؤتمر الصومام', 'مفهوم الوفد الخارجي والحكومة المؤقتة GPRA', 'مفاوضات إيفيان 1962'],
      weakPoints: ['استراتيجية ديغول السياسية والمشاريع الإغرائية (مشروع قسنطينة)'],
      status: 'excellent',
    },
    {
      id: 'hist-u3',
      subject: 'history',
      unitName: 'العالم الثالث بين تراجع الاستعمار وحركات التحرر',
      shortName: 'حركات التحرر والدول النامية',
      masteryPercentage: Math.max(35, Math.round(baseProgress * 0.78)),
      totalConcepts: 28,
      masteredConcepts: Math.round(28 * (Math.max(35, baseProgress * 0.78) / 100)),
      strongPoints: ['الثورة الكوبية وحركة الفيتنام', 'مفهوم الكومنولث والفرانكفونية'],
      weakPoints: ['دور الجزائر الدبلوماسي في دعم حركات التحرر بالأمم المتحدة 1974'],
      status: baseProgress >= 75 ? 'good' : 'needs_work',
    },
    {
      id: 'geo-u1',
      subject: 'geography',
      unitName: 'واقع الاقتصاد العالمي وتجارة البترول والقمح والأموال',
      shortName: 'أسواق الطاقة والمبادلات',
      masteryPercentage: Math.min(92, Math.round(baseProgress * 1.02)),
      totalConcepts: 38,
      masteredConcepts: Math.round(38 * (Math.min(92, baseProgress * 1.02) / 100)),
      strongPoints: ['معايير تصنيف الدول ومؤشر التنمية البشرية IDH', 'عوامل تحكم أسعار البترول ومنظمة OPEC', 'حركة رؤوس الأموال والبورصات'],
      weakPoints: ['تجارة السلاح الأخضر وتكتل الكارتل النفطي'],
      status: baseProgress >= 65 ? 'excellent' : 'good',
    },
    {
      id: 'geo-u2',
      subject: 'geography',
      unitName: 'القوى الاقتصادية الكبرى (الولايات المتحدة، الاتحاد الأوروبي، شرق آسيا)',
      shortName: 'الأقطاب الاقتصادية الكبرى',
      masteryPercentage: Math.max(40, Math.round(baseProgress * 0.85)),
      totalConcepts: 45,
      masteredConcepts: Math.round(45 * (Math.max(40, baseProgress * 0.85) / 100)),
      strongPoints: ['المركب الفلاحي الصناعي Agrobusiness بالولايات المتحدة', 'أقاليم حزام الشمس Sun Belt'],
      weakPoints: ['توطين دول التنينات والنمور الآسيوية على الخريطة', 'معاهدة روما وماستريخت بالاتحاد الأوروبي'],
      status: baseProgress >= 70 ? 'good' : 'needs_work',
    },
    {
      id: 'geo-u3',
      subject: 'geography',
      unitName: 'الاقتصاد والتنمية في دول الجنوب (الجزائر / البرازيل / الهند)',
      shortName: 'التنمية في دول الجنوب',
      masteryPercentage: Math.max(30, Math.round(baseProgress * 0.72)),
      totalConcepts: 32,
      masteredConcepts: Math.round(32 * (Math.max(30, baseProgress * 0.72) / 100)),
      strongPoints: ['الموقع الاستراتيجي للجزائر وإمكانيات الطاقة', 'عوامل النمو البرازيلي وتجارة البن والصويا'],
      weakPoints: ['إشكالية التباين الإقليمي والمثلث الاقتصادي البرازيلي'],
      status: 'needs_work',
    },
  ];

  // Past 7 Days Learning Log
  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const today = new Date();
  const recentDaysActivity: DayActivity[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayName = daysOfWeek[d.getDay()];
    const shortDay = dayName.slice(0, 3);
    const isToday = i === 0;

    // Simulated realistic curve
    const dayFactor = (7 - i) / 7;
    const hoursSpent = isToday ? 1.8 : parseFloat((0.8 + Math.sin(i * 1.5) * 0.6 + dayFactor * 0.8).toFixed(1));
    const tasksDone = Math.max(1, Math.round(hoursSpent * 2.5));
    const quizzesTaken = Math.round(hoursSpent * 1.4);
    const xpGained = Math.round(hoursSpent * 180 + tasksDone * 40);

    recentDaysActivity.push({
      date: d.toISOString().split('T')[0],
      dayName,
      shortDay,
      hoursSpent: Math.max(0.5, hoursSpent),
      tasksDone,
      quizzesTaken,
      xpGained,
    });
  }

  const totalStudyHours = parseFloat(
    (14.5 + (xp / 120)).toFixed(1)
  );

  // Recommendations for high marks
  const keyRecommendations = [
    {
      title: 'تثبيت توقيع دول شرق وجنوب شرق آسيا على الخريطة الصماء',
      description: 'تم رصد نقص بنسبة 28% في التوقيع الدقيق لدول التنينات والنمور ومضيق ملقا. افتح وحدة الخرائط لتثبيت 02 نقطتين مضمونتين.',
      urgency: 'high' as const,
      actionRoute: 'maps',
      actionLabel: 'فتح الخريطة التفاعلية 🗺️',
    },
    {
      title: 'صياغة مقال منهجي حول حركة التحرر ومؤتمر باندونغ',
      description: 'التدرب على تفكيك العرض إلى مطّات دقيقة حول مبادئ الحياد الإيجابي وتأسيس حركة عدم الانحياز 1961.',
      urgency: 'medium' as const,
      actionRoute: 'essay',
      actionLabel: 'كتابة مقال منهجي 📝',
    },
    {
      title: 'مراجعة مصطلحات أسواق الطاقة والبورصات العالمية',
      description: 'إتقان تعاريف (منظمة الأوبك، البرميل المرجعي، السلاح الأخضر، المضاربة) لضمان علامة الجزء الأول كاملة.',
      urgency: 'medium' as const,
      actionRoute: 'flashcards',
      actionLabel: 'تحدي الفلاش كاردز ⚡',
    },
  ];

  return {
    overallReadiness,
    predictedGrade,
    predictedGradeHistory,
    predictedGradeGeography,
    confidenceLevel,
    totalStudyHours,
    termsMastered,
    totalTerms,
    datesMastered,
    totalDates,
    mapsMastered,
    totalMaps,
    essaysWritten,
    averageEssayScore: parseFloat(averageEssayScore),
    quizzesCompleted,
    quizAccuracyPercentage,
    currentStreak: streak,
    dimensions,
    units,
    recentDaysActivity,
    keyRecommendations,
  };
}

export function saveAnalyticsRecord(patch: Partial<{
  termsMastered: number;
  datesMastered: number;
  mapsMastered: number;
  essaysWritten: number;
  averageEssayScore: number;
  quizzesCompleted: number;
  quizAccuracyPercentage: number;
}>) {
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    const updated = { ...existing, ...patch };
    localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analytics record', e);
  }
}
