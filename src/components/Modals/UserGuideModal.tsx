import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Compass,
  Upload,
  BrainCircuit,
  PenTool,
  Swords,
  Layers,
  BarChart3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Clock,
  Flame,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  FileText,
  Target,
  Trophy,
  Zap,
  GraduationCap,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'plan' | 'lessons' | 'tools' | 'progress') => void;
  onOpenLessonSpace?: () => void;
  onOpenUpload?: () => void;
  onOpenEssay?: () => void;
  onOpenQuiz?: () => void;
  onOpenCurriculum?: () => void;
}

interface GuideSection {
  id: string;
  title: string;
  badge: string;
  icon: any;
  color: string;
  summary: string;
  steps: {
    title: string;
    description: string;
    tip?: string;
  }[];
  actionLabel?: string;
  onAction?: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onOpenLessonSpace,
  onOpenUpload,
  onOpenEssay,
  onOpenQuiz,
  onOpenCurriculum,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const guideSections: GuideSection[] = [
    {
      id: 'overview',
      title: 'نظرة عامة على المنصة وفلسفة العمل',
      badge: 'البداية السريعة',
      icon: Compass,
      color: 'from-amber-400 to-amber-500',
      summary:
        'منصة Atlas BAC مصممة خصيصاً لتلاميذ بكالوريا الجزائر (تاريخ وجغرافيا) وفق المنهاج الرسمي والإطار المرجعي لوزارة التربية الوطنية 2026.',
      steps: [
        {
          title: '1. الهدف الأساسي',
          description:
            'تمكين المترشح من استيعاب دروس التاريخ والجغرافيا كاملة مع حفظ المصطلحات والشخصيات والتواريخ والتدرب على منهجية المقال (العلامة الكاملة 04/04).',
          tip: 'تم تبسيط المنصة في 4 تبويبات رئيسية تجنبك التشتت وتضع بين يديك كل ما تحتاجه للنجاح.',
        },
        {
          title: '2. الوضع الصارم (Strict Mode 🔒)',
          description:
            'عند تفعيله، يلتزم الذكاء الاصطناعي والمساعد بالإطار المرجعي الرسمي الصادر عن وزارة التربية الوطنية وتفادي أي معلومات زائدة غير مقررة في البكالوريا.',
        },
        {
          title: '3. نظام النقاط ومستويات الخبرة (XP & Streak)',
          description:
            'كل مهمة تنجزها أو درس تدرسه أو اختبار تجتازه يمنحك نقاط خبرة XP ويزيد من سلسلة المذاكرة اليومية (Streak) لتحفيزك باستمرار.',
        },
      ],
    },
    {
      id: 'curriculum',
      title: 'المنهاج والمقرر الوزاري الرسمي (دورة 2026)',
      badge: 'المقرر الرسمي',
      icon: GraduationCap,
      color: 'from-emerald-400 to-teal-500',
      summary:
        'استعراض تفصيلي للوحدات والوضعيات التعلمية الـ 16 المقررة في التاريخ والجغرافيا لجميع الشعب، مع الكفاءات الختامية ودليل المعاملات وشبكة التنقيط.',
      steps: [
        {
          title: '1. هيكلة الوحدات والوضعيات (16 وضعية)',
          description:
            'ينقسم المقرر إلى 3 وحدات تاريخية (العالم بين 1945-1989، الثورة التحريرية 1954-1962، حركات التحرر والعالم الثالث) و 3 وحدات جغرافية (الاقتصاد العالمي والتبادل، القوى الاقتصادية الكبرى، التنمية في العالم الثالث).',
        },
        {
          title: '2. الكفاءات المستهدفة والمفاهيم الإلزامية',
          description:
            'تحت كل وضعية ستجد قائمة الكفاءات المستهدفة، والمفاهيم والمصطلحات المقررة للحفظ والفهم، وأبرز التواريخ المعلمية والشخصيات.',
        },
        {
          title: '3. دليل الشعب والمعاملات وهيكلة الامتحان',
          description:
            'يوضح لك المنهاج معاملات المادة وساعات التدريس الأسبوعية لكل شعبة، مع تفصيل شبكة تصحيح موضوع البكالوريا وسلالم تنقيط المقال (04/04).',
          tip: 'يمكنك فتح نافذة البرنامج الرسمي في أي وقت من زر "برنامج الباك" في الشريط العلوي.',
        },
      ],
      actionLabel: 'استعراض البرنامج الوزاري الكامل',
      onAction: () => {
        onOpenCurriculum?.();
        onClose();
      },
    },
    {
      id: 'plan',
      title: 'المرحلة 1: خطة اليوم والمهام الذكية',
      badge: 'التبويب الأول',
      icon: BrainCircuit,
      color: 'from-amber-400 to-amber-600',
      summary:
        'خطة يومية ذكية مبنية على مستواك الفعلي والمقرر الدراسي لتنظيم أوقات الحفظ والفهم والمراجعة.',
      steps: [
        {
          title: '1. استعراض مهام اليوم المقترحة',
          description:
            'يقترح عليك النظام مهاماً يومية متوازنة بين التاريخ، الجغرافيا، المصطلحات، ومنهجية المقال مع تقدير للزمن بالدقائق.',
        },
        {
          title: '2. تعليم المهمة كمكتملة (✓)',
          description:
            'عند إتمام أي مهمة اضغط على الدائرة الخضراء لتسجيل إنجازها وكسب نقاط الـ XP واحتفال تشجيعي فوري.',
        },
        {
          title: '3. توليد خطة جديدة بالذكاء الاصطناعي',
          description:
            'اضغط على زر "توليد خطة اليوم بالذكاء الاصطناعي" لتحديث جدولك بما يتوافق مع ما درسته مؤخراً ونقاط ضعفك.',
          tip: 'يمكنك اختيار كراس الطالب أو المنهاج الرسمي كمصدر رئيسي لتوليد الخطة.',
        },
      ],
      actionLabel: 'الانتقال إلى خطة اليوم',
      onAction: () => {
        onNavigateToTab?.('plan');
        onClose();
      },
    },
    {
      id: 'lessons',
      title: 'المرحلة 2: فضاء الدروس التفاعلي والمحتوى',
      badge: 'التبويب الثاني',
      icon: BookOpen,
      color: 'from-teal-400 to-emerald-500',
      summary:
        'فهرس كامل وشامل لكل دروس التاريخ والجغرافيا المقررة في بكالوريا الجزائر مع ملخصات منظمة ومصطلحات وشخصيات مرافقة.',
      steps: [
        {
          title: '1. البحث والتصفية حسب المادة',
          description:
            'يمكنك تصفية الدروس لعرض التاريخ فقط 🏛️ أو الجغرافيا 🌍 أو استخدام شريط البحث للوصول لأي درس أو معاهدة أو مؤتمر بثوانٍ.',
        },
        {
          title: '2. فتح الدرس في فضاء التعلم التفاعلي',
          description:
            'اضغط على "ابدأ دراسة الدرس" للدخول في بيئة دراسية مركزة خالية من المشتتات.',
        },
        {
          title: '3. وضع التركيز وبومودورو (Focus Mode)',
          description:
            'داخل فضاء الدرس يمكنك تفعيل مؤقت بومودورو للتركيز وأصوات الطبيعة الهادئة لتعزيز الحفظ والاستيعاب العميق.',
        },
        {
          title: '4. استخدام رفيق البكالوريا الذكي (AI Companion)',
          description:
            'اسأل المساعد الذكي عن أي جزئية في الدرس أو اطلب منه شرح سبب تاريخي أو تلخيص فكرة وسيجيبك بدقة مستنداً للمنهاج.',
        },
      ],
      actionLabel: 'استعراض دروس البكالوريا',
      onAction: () => {
        onNavigateToTab?.('lessons');
        onClose();
      },
    },
    {
      id: 'upload',
      title: 'المرحلة 3: رفع وثائق وملخصات الطالب (OCR & RAG)',
      badge: 'مركز الوثائق',
      icon: Upload,
      color: 'from-amber-400 to-amber-500',
      summary:
        'ارفع كراسك الخاص أو ملخصاتك بصيغ (PDF / Word / صور) ليقوم النظام بتحليلها دلالياً ودمجها مع أسئلة الذكاء الاصطناعي.',
      steps: [
        {
          title: '1. الوصول إلى نافذة الرفع',
          description:
            'اضغط على زر "رفع الوثائق" في الشريط العلوي أو من شريط الرفع السريع في تبويب الخطة.',
        },
        {
          title: '2. سحب وإفلات الملفات أو اختيارها',
          description:
            'يدعم النظام ملفات PDF، ومستندات Word (docx)، وصور الكراس بخط اليد. يقوم المحرك بمعالجة النصوص واستخراج الأفكار بدقة.',
        },
        {
          title: '3. الفهرسة في الذاكرة المتجهية (Vector Store)',
          description:
            'يتم تقطيع الملخص وتخزينه في الذاكرة المحلية ليصبح المساعد الذكي قادراً على الإجابة من كراسك الشخصي مع وضع المراجع.',
        },
      ],
      actionLabel: 'فتح مركز رفع الوثائق',
      onAction: () => {
        onOpenUpload?.();
        onClose();
      },
    },
    {
      id: 'essay',
      title: 'المرحلة 4: صانع ومصحح المقالات المنهجية (04/04)',
      badge: 'الأداة الذهبية',
      icon: PenTool,
      color: 'from-emerald-400 to-teal-500',
      summary:
        'تدريب عملي صارم على كتابة المقال التاريخي والجغرافي وفق شبكة التنقيط المعتمدة في تصحيح البكالوريا الرسمية.',
      steps: [
        {
          title: '1. اختيار الموضوع أو كتابة مقال حر',
          description:
            'اختر من بنك مواضيع البكالوريا السابقة أو اكتب مقالاً حول موضوع تقترحه بنفسك.',
        },
        {
          title: '2. الالتزام بالهيكلة الثلاثية (المقدمة، العرض، الخاتمة)',
          description:
            'المقدمة: مدخل وظيفي + إبراز الإشكالية مع طرح التساؤل (0.5 ن).\nالعرض: إجابة على التعليمتين في شكل عناصر ومطويات محددة (2.5 ن).\nالخاتمة: استنتاج حقيقي وحوصلة تقييمية (0.5 ن + 0.5 ن للشكل والتنظيم).',
        },
        {
          title: '3. التصحيح الفوري بالذكاء الاصطناعي مع العلامة',
          description:
            'يقوم المصحح بفحص مقالك وتقديم علامة تقديرية من 4 مع توضيح الفجوات ونقاط القوة والنصائح البيداغوجية لتحسين أسلوبك.',
        },
      ],
      actionLabel: 'فتح صانع المقالات',
      onAction: () => {
        onOpenEssay?.();
        onClose();
      },
    },
    {
      id: 'quiz',
      title: 'المرحلة 5: ساحة التحدي وبطاقات الاستذكار (Quiz & Flashcards)',
      badge: 'المراجعة النشطة',
      icon: Swords,
      color: 'from-rose-400 to-amber-500',
      summary:
        'اختبارات تفاعلية سريعة وبطاقات لايتنر للحفظ التكراري المتباعد للتواريخ والمصطلحات والشخصيات.',
      steps: [
        {
          title: '1. معارك السرعة والاختبارات (Quiz Arena)',
          description:
            'اختبر سرعة استحضارك للمعلومات من خلال أسئلة متعددة الخيارات (QCM) حول التواريخ المعلمية والشخصيات التاريخية والجغرافيا الاقتصادية.',
        },
        {
          title: '2. بطاقات لايتنر الذكية (Leitner Flashcards)',
          description:
            'نظام مراجعة ذكي يكرر عليك التواريخ والمفاهيم التي تجد فيها صعوبة حتى ترسخ في الذاكرة طويلة المدى.',
        },
        {
          title: '3. معجم المصطلحات والشخصيات الرسمي',
          description:
            'تصفح أكثر من 180 مصطلحاً وشخصية مصنفة حسب الوحدات مع إمكانية البحث الفوري.',
        },
      ],
      actionLabel: 'دخول ساحة التحدي',
      onAction: () => {
        onOpenQuiz?.();
        onClose();
      },
    },
    {
      id: 'progress',
      title: 'المرحلة 6: مؤشر الجاهزية ورادار المهارات الست',
      badge: 'التبويب الرابع',
      icon: BarChart3,
      color: 'from-teal-400 to-cyan-500',
      summary:
        'تحليلات دقيقة تكشف لك نسبة استعدادك الفعلي لامتحان البكالوريا ونقاط القوة والمواضيع التي تحتاج إلى مزيد من المراجعة.',
      steps: [
        {
          title: '1. رادار المهارات الست',
          description:
            'يقيس مستواك في:\n1. الحفظ والاستذكار\n2. المنهجية وصياغة المقال\n3. تحليل الوثائب والجداول\n4. المصطلحات والمفاهيم\n5. التواريخ والأحداث المعلمية\n6. الخرائط والتوقيع الجغرافي.',
        },
        {
          title: '2. تشخيص الفجوات المعرفية (Knowledge Gap)',
          description:
            'يوضح لك النظام الوحدات أو الدروس التي لم تنجز مهامها بعد أو حصلت فيها على نتائج منخفضة في الاختبارات لتركز عليها.',
        },
      ],
      actionLabel: 'عرض تقدمي والتحليلات',
      onAction: () => {
        onNavigateToTab?.('progress');
        onClose();
      },
    },
  ];

  const filteredSections = guideSections.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.steps.some(
        (st) =>
          st.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          st.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const currentSection = guideSections[activeSectionIndex] || guideSections[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020617]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl bg-[#090e38] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0c1348] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-400/20 font-black">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    دليل الاستعمال الشامل لمنصة Atlas BAC
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold">
                    إصدار بكالوريا 2026
                  </span>
                </div>
                <p className="text-xs text-white/60">
                  دليل تفصيلي مبسط لجميع مراحل وميزات المنصة خطوة بخطوة
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Navigation Pills */}
          <div className="px-5 py-3 border-b border-white/10 bg-[#070b2c] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar py-1">
              {guideSections.map((sec, idx) => {
                const IconComponent = sec.icon;
                const isActive = activeSectionIndex === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionIndex(idx)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                        : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/5'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    <span>{sec.badge}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الدليل..."
                className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-[#040822] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* Section Header Card */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${currentSection.color} p-[2px] shadow-lg shrink-0`}
                >
                  <div className="w-full h-full bg-[#090e38] rounded-[14px] flex items-center justify-center text-white">
                    <currentSection.icon className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold">
                      {currentSection.badge}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {currentSection.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">
                    {currentSection.summary}
                  </p>
                </div>
              </div>

              {currentSection.actionLabel && currentSection.onAction && (
                <button
                  onClick={currentSection.onAction}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs transition-all cursor-pointer shrink-0 shadow-md shadow-amber-400/20 flex items-center gap-1.5"
                >
                  <span>{currentSection.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Steps Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                خطوات الاستخدام والميزات الأساسية:
              </h4>

              <div className="grid grid-cols-1 gap-3.5">
                {currentSection.steps.map((step, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-[#060b29] border border-white/10 hover:border-white/20 transition-all space-y-2"
                  >
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{step.title}</span>
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed pr-6 whitespace-pre-line">
                      {step.description}
                    </p>

                    {step.tip && (
                      <div className="mr-6 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 text-[11px] text-amber-300 flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{step.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-transparent border border-teal-400/20 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs text-teal-200">
                <div className="font-bold text-white">نصيحة ذهبية لنيل امتياز البكالوريا (18+/20):</div>
                <p className="leading-relaxed opacity-90">
                  قم يومياً بإنجاز مهام الخطة اليومية، وحفظ مصطلحين وشخصية تاريخية واحدة، ثم تدرب على كتابة مقال منهجي كامل كل نهاية أسبوع مع مراعاة المصطلحات المفتاحية.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070b2c] flex items-center justify-between gap-3">
            <button
              onClick={() => setActiveSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeSectionIndex === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/40'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
              <span>المرحلة السابقة</span>
            </button>

            <div className="text-xs text-white/50 font-mono">
              المرحلة {activeSectionIndex + 1} من {guideSections.length}
            </div>

            <button
              onClick={() =>
                setActiveSectionIndex((prev) => Math.min(guideSections.length - 1, prev + 1))
              }
              disabled={activeSectionIndex === guideSections.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSectionIndex === guideSections.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-white/5 text-white/40'
                  : 'bg-amber-400 text-stone-950 hover:bg-amber-300'
              }`}
            >
              <span>المرحلة التالية</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
