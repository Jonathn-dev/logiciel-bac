import { useState, useEffect, useCallback } from 'react';
import { Task, DailyPlanResponse } from '../types';

export const TIME_BUDGET_PRESETS = [
  { id: 30, label: '30 دقيقة', sub: 'جلسة سريعة ⚡', desc: 'مراجعة نقطية مركزة' },
  { id: 60, label: '60 دقيقة', sub: 'جلسة قياسية ⏱️', desc: 'البرنامج اليومي المتوازن' },
  { id: 90, label: '90 دقيقة', sub: 'جلسة معمقة 🎯', desc: 'فهم وتطبيق واسترجاع' },
  { id: 120, label: '120 دقيقة', sub: 'ماراثون التفوق 🏆', desc: 'تغطية شاملة وتدريب مكثف' },
];

const generateTimeBudgetTasks = (minutes: number, strictMode: boolean): Task[] => {
  const now = Date.now();
  if (minutes <= 35) {
    return [
      {
        id: `task-${now}-1`,
        title: 'كتلة التركيز الرئيسية: مراجعة قرارات مؤتمر الصومام 1956 وهيكلة الولايات الست',
        category: 'history',
        categoryLabel: 'تاريخ الثورة التحريرية',
        chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
        estimatedMinutes: 20,
        timeSlot: 'الفترة 1 • 20 دقيقة',
        phase: 'focus',
        phaseLabel: 'جلسة تركيز وفهم',
        xpReward: 80,
        completed: false,
        notes: 'التركيز على ميثاق الصومام، مؤسستي CNRA وCCE، وأولوية الداخل على الخارج والسياسي على العسكري',
        tags: ['مؤتمر الصومام', 'الولايات الست', 'بكالوريا الجزائر'],
      },
      {
        id: `task-${now}-2`,
        title: 'كتلة الاسترجاع السريع: استحضار 5 مصطلحات وشخصيات أساسية',
        category: 'terminology',
        categoryLabel: 'المصطلحات والشخصيات',
        chapter: 'شخصيات ومصطلحات البكالوريا الرسمية',
        estimatedMinutes: 10,
        timeSlot: 'الفترة 2 • 10 دقائق',
        phase: 'review',
        phaseLabel: 'استرجاع نشط',
        xpReward: 45,
        completed: false,
        notes: 'مصطفى بن بولعيد، ديدوش مراد، مبدأ ترومان، مشروع مارشال، الوفاق الدولي',
        tags: ['شخصيات تاريخية', 'مصطلحات رسمية'],
      },
    ];
  }

  if (minutes <= 65) {
    return [
      {
        id: `task-${now}-1`,
        title: 'الفترة 1 (25 دقيقة): دراسة استراتيجيات المعسكرين في الحرب الباردة والمشاريع الاقتصادية',
        category: 'history',
        categoryLabel: 'تاريخ العلاقات الدولية',
        chapter: 'تطور العالم في ظل القطبية الثنائية (1945 - 1989)',
        estimatedMinutes: 25,
        timeSlot: 'الفترة 1 • 25 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة التركيز والفهم',
        xpReward: 95,
        completed: false,
        notes: 'المقارنة بين مشروع مارشال ومنظمة الكومكون، ومبدأ ترومان ومبدأ جدانوف وحلفي الناتو ووارسو',
        tags: ['الحرب الباردة', 'مشروع مارشال', 'حلف وارسو'],
      },
      {
        id: `task-${now}-2`,
        title: 'الفترة 2 (20 دقيقة): تحليل معايير التقدم والتخلف وأسواق الطاقة ومنظمة أوبك (OPEC)',
        category: 'geography',
        categoryLabel: 'الجغرافيا الاقتصادية',
        chapter: 'إشكالية التقدم والتخلف والمبادلات العالمية',
        estimatedMinutes: 20,
        timeSlot: 'الفترة 2 • 20 دقيقة',
        phase: 'practice',
        phaseLabel: 'كتلة التطبيق والتحليل',
        xpReward: 75,
        completed: false,
        notes: 'حفظ مكونات مؤشر IDH والدول المؤسسة لمنظمة أوبك والعوامل المتحكمة في أسعار البترول',
        tags: ['مؤشر التنمية', 'منظمة أوبك', 'سوق المحروقات'],
      },
      {
        id: `task-${now}-3`,
        title: 'الفترة 3 (15 دقيقة): تدريب منهجي على صياغة مقدمة وخاتمة مقال تاريخي مع طرح الإشكالية',
        category: 'methodology',
        categoryLabel: 'منهجية المقال',
        chapter: 'مهارات التحرير المنهجي للبكالوريا',
        estimatedMinutes: 15,
        timeSlot: 'الفترة 3 • 15 دقيقة',
        phase: 'quiz',
        phaseLabel: 'كتلة التثبيت المنهجي',
        xpReward: 60,
        completed: false,
        notes: 'الالتزام بتمهيد وظيفي محدد زماناً ومكاناً، وطرح السؤالين بعلامتي الاستفهام، وصياغة خاتمة استنتاجية',
        tags: ['مقال تاريخي', 'منهجية 04/04', 'الوزارة'],
      },
    ];
  }

  if (minutes <= 95) {
    return [
      {
        id: `task-${now}-1`,
        title: 'الفترة 1 (35 دقيقة): إتقان هجمات الشمال القسنطيني ومؤتمر الصومام ودبلوماسية الثورة',
        category: 'history',
        categoryLabel: 'تاريخ الثورة الجزائرية',
        chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
        estimatedMinutes: 35,
        timeSlot: 'الفترة 1 • 35 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة الفهم المعمق',
        xpReward: 120,
        completed: false,
        notes: 'أهداف هجمات 20 أوت 1955 بقيادة زيغود يوسف وتدويل القضية في مؤتمر باندونغ وقرارات الصومام',
        tags: ['هجمات 20 أوت', 'مؤتمر الصومام', 'تدويل الثورة'],
      },
      {
        id: `task-${now}-2`,
        title: 'الفترة 2 (30 دقيقة): الجغرافيا العالمية - القوة الاقتصادية للاتحاد الأوروبي وشرق وجنوب شرق آسيا',
        category: 'geography',
        categoryLabel: 'الجغرافيا الإقليمية',
        chapter: 'القوى الاقتصادية الكبرى في العالم',
        estimatedMinutes: 30,
        timeSlot: 'الفترة 2 • 30 دقيقة',
        phase: 'practice',
        phaseLabel: 'كتلة الخرائط والتحليل',
        xpReward: 100,
        completed: false,
        notes: 'عوامل القوة ومعيقات التكتل ودور التنينات والنمور الآسيوية واليابان في الاقتصاد العالمي',
        tags: ['الاتحاد الأوروبي', 'آسيا الاقتصادية', 'التكتلات'],
      },
      {
        id: `task-${now}-3`,
        title: 'الفترة 3 (25 دقيقة): اختبار استرجاع سريع وحفظ 8 تواريخ وشخصيات ومصطلحات معتمدة',
        category: 'terminology',
        categoryLabel: 'المصطلحات والشخصيات',
        chapter: 'المعجم المرجعي لبكالوريا الجزائر',
        estimatedMinutes: 25,
        timeSlot: 'الفترة 3 • 25 دقيقة',
        phase: 'review',
        phaseLabel: 'كتلة الاسترجاع والحفظ',
        xpReward: 85,
        completed: false,
        notes: 'استحضار التواريخ المفصلية (1947، 1954، 1956، 1962، 1989) والمصطلحات الوزارية المعتمدة',
        tags: ['تواريخ مفصلية', 'شخصيات رسمية', 'مصطلحات'],
      },
    ];
  }

  // 120+ minutes
  return [
    {
      id: `task-${now}-1`,
      title: 'الفترة 1 (40 دقيقة): مراجعة شاملة لمحطات الصراع في إطار القطبية الثنائية وسقوط المعسكر الشيوعي',
      category: 'history',
      categoryLabel: 'تاريخ العلاقات الدولية',
      chapter: 'تطور العالم في ظل الثنائية القطبية والأحادية (1945 - 1991)',
      estimatedMinutes: 40,
      timeSlot: 'الفترة 1 • 40 دقيقة',
      phase: 'focus',
      phaseLabel: 'كتلة التركيز المعمق',
      xpReward: 140,
      completed: false,
      notes: 'الأزمات الدولية (برلين، كوريا، كوبا السويس)، الوفاق الدولي، وإصلاحات غورباتشوف وسقوط جدار برلين',
      tags: ['أزمات الحرب الباردة', 'سقوط المعسكر الشرقي', 'غورباتشوف'],
    },
    {
      id: `task-${now}-2`,
      title: 'الفترة 2 (35 دقيقة): دراسة إشكالية المبادلات وحركة رؤوس الأموال ودور منظمة التجارة والشركات متعدية الجنسيات',
      category: 'geography',
      categoryLabel: 'الجغرافيا الاقتصادية',
      chapter: 'المجال الجغرافي والمبادلات العالمية',
      estimatedMinutes: 35,
      timeSlot: 'الفترة 2 • 35 دقيقة',
      phase: 'practice',
      phaseLabel: 'كتلة التطبيق الإحصائي',
      xpReward: 120,
      completed: false,
      notes: 'سوق الغذاء (القمح والأرز)، سوق الطاقة، حركة الأموال، وهيمنة الدول المتقدمة على التجارة العالمية',
      tags: ['المبادلات العالمية', 'سوق القمح', 'رؤوس الأموال'],
    },
    {
      id: `task-${now}-3`,
      title: 'الفترة 3 (25 دقيقة): تحرير مقال كامل بمطّات نموذجية وسلم تنقيط 04/04',
      category: 'methodology',
      categoryLabel: 'منهجية المقال',
      chapter: 'التطبيق المنهجي المعتمد',
      estimatedMinutes: 25,
      timeSlot: 'الفترة 3 • 25 دقيقة',
      phase: 'focus',
      phaseLabel: 'كتلة التحرير العملي',
      xpReward: 95,
      completed: false,
      notes: 'كتابة مقال تاريخي أو جغرافي وفق القواعد الرسمية لمفتشية التربية الوطنية',
      tags: ['مقال بكالوريا', 'شبكة التقويم', 'تدريب'],
    },
    {
      id: `task-${now}-4`,
      title: 'الفترة 4 (20 دقيقة): مراجعة توقيع المواقع والخرائط الصماء والمصطلحات',
      category: 'terminology',
      categoryLabel: 'الخرائط والمصطلحات',
      chapter: 'الإطار المرجعي الوزاري',
      estimatedMinutes: 20,
      timeSlot: 'الفترة 4 • 20 دقيقة',
      phase: 'review',
      phaseLabel: 'كتلة التثبيت والخرائط',
      xpReward: 75,
      completed: false,
      notes: 'توقيع الدول الأعضاء في حلف وارسو والأوبك والاتحاد الأوروبي ومصطلحات البكالوريا',
      tags: ['خرائط صماء', 'مصطلحات', 'توقيع جغرافي'],
    },
  ];
};

export function useDailyPlan(
  userId: string,
  notebookId: string,
  strictMode: boolean,
  onTaskCompleted?: (task: Task) => void
) {
  const [selectedTimeBudget, setSelectedTimeBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`bac_daily_time_budget_${userId}`);
      if (saved) return Number(saved);
    } catch {
      // ignore
    }
    return 60;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`bac_daily_tasks_${userId}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return generateTimeBudgetTasks(60, strictMode);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(() => {
    return localStorage.getItem(`bac_plan_generated_at_${userId}`) || null;
  });
  const [focusTheme, setFocusTheme] = useState<string>(
    'الخطة الموزعة زمنياً: جدول دراسي منظم بدقة حسب وقت المذاكرة المتاح اليوم'
  );
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([
    'منهاج وزارة التربية الوطنية الجزائرية (التاريخ والجغرافيا 2026)',
    'نظام الجدولة الزمنية بالكتل الدراسية (Time-Block Study System)',
    'فيكتور ستور دفاتر التلميذ (Embeddings v2)',
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(`bac_daily_tasks_${userId}`, JSON.stringify(tasks));
      localStorage.setItem(`bac_daily_time_budget_${userId}`, String(selectedTimeBudget));
    } catch {
      // ignore
    }
  }, [tasks, selectedTimeBudget, userId]);

  const toggleTask = useCallback(
    (taskId: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const nextCompleted = !t.completed;
            const updated = {
              ...t,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : undefined,
            };
            if (nextCompleted && onTaskCompleted) {
              onTaskCompleted(updated);
            }
            return updated;
          }
          return t;
        })
      );
    },
    [onTaskCompleted]
  );

  const generatePlan = useCallback(
    async (customPrompt?: string, targetMinutes?: number) => {
      setIsLoading(true);
      setError(null);
      const minutesToUse = targetMinutes || selectedTimeBudget;

      try {
        const response = await fetch('/api/ai/daily-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            notebookId,
            strictMode,
            customPrompt,
            timeBudgetMinutes: minutesToUse,
            currentTasksCount: tasks.length,
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate daily plan: ${response.status}`);
        }

        const data: DailyPlanResponse = await response.json();
        if (data && data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks);
          setFocusTheme(
            data.focusTheme || `الخطة اليومية الموزعة حسب الوقت (${minutesToUse} دقيقة)`
          );
          setSourcesUsed(
            data.sourcesUsed || ['جدول التوزيع الزمني للبكالوريا', 'الإطار المرجعي الرسمي 2026']
          );
          const nowStr = new Date().toISOString();
          setLastGeneratedAt(nowStr);
          localStorage.setItem(`bac_plan_generated_at_${userId}`, nowStr);
        } else {
          throw new Error('No tasks in response');
        }
      } catch (err) {
        console.warn('AI generator endpoint fallback to local time-based generator:', err);
        const fallbackTasks = generateTimeBudgetTasks(minutesToUse, strictMode);
        setTasks(fallbackTasks);
        setFocusTheme(`الخطة الزمنية المقترحة (${minutesToUse} دقيقة مذاكرة منظمة)`);
        setSourcesUsed([
          'نظام الكتل الزمنية البيداغوجي المعتمد',
          'المنهاج الرسمي لوزارة التربية الوطنية 2026',
        ]);
        const nowStr = new Date().toISOString();
        setLastGeneratedAt(nowStr);
        localStorage.setItem(`bac_plan_generated_at_${userId}`, nowStr);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, notebookId, strictMode, selectedTimeBudget, tasks.length]
  );

  const changeTimeBudget = useCallback(
    (minutes: number) => {
      setSelectedTimeBudget(minutes);
      generatePlan(undefined, minutes);
    },
    [generatePlan]
  );

  return {
    tasks,
    isLoading,
    lastGeneratedAt,
    focusTheme,
    sourcesUsed,
    error,
    selectedTimeBudget,
    changeTimeBudget,
    toggleTask,
    generatePlan,
    setTasks,
  };
}
