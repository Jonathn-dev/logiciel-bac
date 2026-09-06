import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  ChevronDown,
  RotateCcw,
  Check,
  ShieldCheck,
  Send,
  Timer,
  Eye,
  FileText,
  HelpCircle,
  Lightbulb,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowRight,
  TrendingUp,
  Download,
  Share2,
  ListOrdered,
  Flame,
  CheckCheck,
} from 'lucide-react';
import {
  EXPANDED_BAC_ESSAY_TOPICS,
  EnhancedEssayTopic,
} from '../../data/essayTopicsData';
import {
  evaluateFullEssay,
  DetailedEssayEvaluation,
} from '../../utils/essayEvaluator';

interface EssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number, reason: string) => void;
  initialTopicId?: string;
}

export const EssayModal: React.FC<EssayModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  initialTopicId,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    initialTopicId || EXPANDED_BAC_ESSAY_TOPICS[0].id
  );
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'history' | 'geography'>('all');
  const [mobileView, setMobileView] = useState<'topic' | 'editor'>('editor');

  const activeTopic =
    EXPANDED_BAC_ESSAY_TOPICS.find((t) => t.id === selectedTopicId) ||
    EXPANDED_BAC_ESSAY_TOPICS[0];

  // User input states
  const [introText, setIntroText] = useState('');
  const [bodyPart1, setBodyPart1] = useState('');
  const [bodyPart2, setBodyPart2] = useState('');
  const [conclusionText, setConclusionText] = useState('');

  // Active view tab
  const [activeTab, setActiveTab] = useState<'builder' | 'sample' | 'rubric' | 'tips'>('builder');

  // Evaluation & Results
  const [evaluation, setEvaluation] = useState<DetailedEssayEvaluation | null>(null);
  const [isGrading, setIsGrading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  // Timer mode
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(
    activeTopic.suggestedDurationMinutes * 60
  );
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter topics
  const filteredTopics = EXPANDED_BAC_ESSAY_TOPICS.filter((t) => {
    if (subjectFilter === 'history') return t.subject === 'history';
    if (subjectFilter === 'geography') return t.subject === 'geography';
    return true;
  });

  // Reset fields when topic changes
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setIntroText('');
    setBodyPart1('');
    setBodyPart2('');
    setConclusionText('');
    setEvaluation(null);
    setShowResultModal(false);
    const newTopic = EXPANDED_BAC_ESSAY_TOPICS.find((t) => t.id === topicId);
    if (newTopic) {
      setTimeRemainingSeconds(newTopic.suggestedDurationMinutes * 60);
      setIsTimerRunning(false);
    }
  };

  // Timer Effect
  useEffect(() => {
    if (isTimerRunning && timeRemainingSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeRemainingSeconds]);

  if (!isOpen) return null;

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAddBulletTo = (target: 'body1' | 'body2') => {
    if (target === 'body1') {
      setBodyPart1((prev) => (prev ? `${prev}\n• ` : '• '));
    } else {
      setBodyPart2((prev) => (prev ? `${prev}\n• ` : '• '));
    }
  };

  const handleLoadSampleSolution = () => {
    setIntroText(activeTopic.sampleSolution.intro);
    setBodyPart1(activeTopic.sampleSolution.body[0]);
    setBodyPart2(activeTopic.sampleSolution.body[1]);
    setConclusionText(activeTopic.sampleSolution.conclusion);
    setEvaluation(null);
  };

  const handleClearDraft = () => {
    if (window.confirm('هل تريد إفراغ المسودة والبدء من جديد؟')) {
      setIntroText('');
      setBodyPart1('');
      setBodyPart2('');
      setConclusionText('');
      setEvaluation(null);
    }
  };

  const handleRunEvaluation = () => {
    setIsGrading(true);
    setTimeout(() => {
      const evalResult = evaluateFullEssay(
        introText,
        bodyPart1,
        bodyPart2,
        conclusionText,
        activeTopic
      );
      setEvaluation(evalResult);
      setIsGrading(false);
      setShowResultModal(true);

      // Reward XP based on grade
      if (evalResult.totalScore >= 3.5) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        onRewardXP(150, `علامة ممتازة في مقال البكالوريا (${evalResult.totalScore}/4.0) ⭐`);
      } else if (evalResult.totalScore >= 2.5) {
        onRewardXP(90, `مقال منهجي جيد جداً (${evalResult.totalScore}/4.0) 👍`);
      } else {
        onRewardXP(50, `محاولة كتابة مقال منهجي (${evalResult.totalScore}/4.0) 📝`);
      }
    }, 600);
  };

  const handleCopyFullEssay = () => {
    const fullText = `الموضوع: ${activeTopic.title}\n\n[المقدمة الإشكالية]\n${introText || activeTopic.sampleSolution.intro}\n\n[العرض - العنصر الأول: ${activeTopic.requiredQuestions[0]}]\n${bodyPart1 || activeTopic.sampleSolution.body[0]}\n\n[العرض - العنصر الثاني: ${activeTopic.requiredQuestions[1]}]\n${bodyPart2 || activeTopic.sampleSolution.body[1]}\n\n[الخاتمة والاستنتاج]\n${conclusionText || activeTopic.sampleSolution.conclusion}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySample = () => {
    const sampleText = `موضوع البكالوريا: ${activeTopic.title}\n\n[المقدمة النموذجية]\n${activeTopic.sampleSolution.intro}\n\n[العرض - العنصر 1]\n${activeTopic.sampleSolution.body[0]}\n\n[العرض - العنصر 2]\n${activeTopic.sampleSolution.body[1]}\n\n[الخاتمة النموذجية]\n${activeTopic.sampleSolution.conclusion}`;
    navigator.clipboard.writeText(sampleText);
    setCopiedSample(true);
    setTimeout(() => setCopiedSample(false), 2000);
  };

  // Real-time live validations
  const hasIntroQuestions = introText.includes('؟') || introText.includes('?');
  const countBulletsPart1 = (bodyPart1.match(/[•\-\*]/g) || []).length;
  const countBulletsPart2 = (bodyPart2.match(/[•\-\*]/g) || []).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-6xl rounded-3xl border border-stone-800 bg-[#070d1e] shadow-2xl overflow-hidden flex flex-col h-[94vh] max-h-[950px] relative text-stone-200"
      >
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-stone-800 px-5 py-3.5 bg-[#091126]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-teal-500/20 border border-amber-500/30 text-amber-300 shadow-sm">
              <PenTool className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  استوديو المقالات المنهجية (Bac Essay Studio)
                </h3>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  منهجية 04/04
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                المحرر الذكي والمصحح التلقائي لمقالات التاريخ والجغرافيا وفق معايير لجان تصحيح البكالوريا
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Exam Countdown Timer */}
            <div className="flex items-center gap-2 rounded-xl bg-stone-900/80 border border-stone-800 px-3 py-1.5 text-xs">
              <Timer className={`h-4 w-4 ${isTimerRunning ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
              <span className="font-mono font-bold text-stone-200">{formatTimer(timeRemainingSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-all ${
                  isTimerRunning ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30' : 'bg-teal-500/20 text-teal-300 hover:bg-teal-500/30'
                }`}
              >
                {isTimerRunning ? 'إيقاف' : 'بدء المؤقت'}
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-xl border border-stone-800 p-2 text-stone-400 hover:bg-stone-800 hover:text-white transition-all cursor-pointer"
              title="إغلاق الاستوديو"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MOBILE VIEW SWITCHER (Visible on < lg screens) */}
        <div className="lg:hidden flex items-center border-b border-stone-800 bg-[#070e24] p-2 gap-2">
          <button
            onClick={() => setMobileView('topic')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'topic'
                ? 'bg-teal-500 text-stone-950 shadow-md shadow-teal-500/20'
                : 'bg-stone-900/80 text-stone-400 border border-stone-800'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>1. اختيار الموضوع والسند</span>
          </button>
          <button
            onClick={() => setMobileView('editor')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              mobileView === 'editor'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'bg-stone-900/80 text-stone-400 border border-stone-800'
            }`}
          >
            <PenTool className="h-3.5 w-3.5" />
            <span>2. محرر المقال والتصحيح</span>
          </button>
        </div>

        {/* MAIN SPLIT CONTENT */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* LEFT / SIDEBAR: Topic Picker & Details (4 cols) */}
          <div
            className={`${
              mobileView === 'topic' ? 'flex' : 'hidden lg:flex'
            } lg:col-span-4 border-l border-stone-800 bg-[#060b1b] p-4 flex-col overflow-y-auto space-y-4`}
          >
            {/* Filter Toggle */}
            <div className="flex gap-1.5 p-1 rounded-2xl bg-stone-900/80 border border-stone-800 text-xs">
              <button
                onClick={() => setSubjectFilter('all')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  subjectFilter === 'all' ? 'bg-amber-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setSubjectFilter('history')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  subjectFilter === 'history' ? 'bg-teal-500 text-stone-950 shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                التاريخ
              </button>
              <button
                onClick={() => setSubjectFilter('geography')}
                className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  subjectFilter === 'geography' ? 'bg-indigo-500 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                الجغرافيا
              </button>
            </div>

            {/* Topics List */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-stone-400 block">مواضيع البكالوريا المعتمدة:</span>
              {filteredTopics.map((topic) => {
                const isSelected = topic.id === selectedTopicId;
                return (
                  <button
                    key={topic.id}
                    onClick={() => {
                      handleSelectTopic(topic.id);
                      setMobileView('editor');
                    }}
                    className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 relative ${
                      isSelected
                        ? 'border-amber-500/60 bg-amber-500/10 shadow-md shadow-amber-500/10'
                        : 'border-stone-800/80 bg-stone-900/40 hover:bg-stone-900 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          topic.subject === 'history'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {topic.subject === 'history' ? '📜 تاريخ' : '🌍 جغرافيا'}
                      </span>
                      <span className="text-[10px] text-amber-300 font-mono font-bold">
                        {topic.bacYearReference || 'دورة رسمية'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-relaxed">
                      {topic.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-white/5">
                      <span>{topic.stream}</span>
                      <span>⏱️ {topic.suggestedDurationMinutes} دقيقة</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Topic Context Card */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950/60 p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  السند والتعليمة الوزارية:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">04 نقاط</span>
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px] whitespace-pre-line bg-stone-900/60 p-2.5 rounded-xl border border-stone-800">
                {activeTopic.contextText}
              </p>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-teal-300 block">المطلوب في المقال:</span>
                {activeTopic.requiredQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 p-2 rounded-xl bg-teal-500/5 border border-teal-500/20 text-[11px] text-teal-200"
                  >
                    <span className="font-mono font-bold text-teal-400">{idx + 1}.</span>
                    <p className="leading-snug">{q.replace(/^\d+\.\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT / MAIN PANE: Editor & Tabs (8 cols) */}
          <div
            className={`${
              mobileView === 'editor' ? 'flex' : 'hidden lg:flex'
            } lg:col-span-8 flex-col overflow-hidden bg-[#070d1e]`}
          >
            {/* Nav Tabs */}
            <div className="flex items-center justify-between border-b border-stone-800 px-5 py-2.5 bg-[#081024]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'builder'
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  محرر المقال الذكي
                </button>

                <button
                  onClick={() => setActiveTab('sample')}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'sample'
                      ? 'bg-teal-500 text-stone-950 shadow-md shadow-teal-500/20'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800'
                  }`}
                >
                  <Award className="h-3.5 w-3.5" />
                  الحل النموذجي المعتمد (04/04)
                </button>

                <button
                  onClick={() => setActiveTab('rubric')}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'rubric'
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  سلم التنقيط الوزاري
                </button>

                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'tips'
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 border border-stone-800'
                  }`}
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  محاذير التقييم
                </button>
              </div>

              {/* Utility Quick Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadSampleSolution}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                  title="استيراد الإجابة النموذجية في الخانات للتعديل عليها"
                >
                  استيراد النموذج
                </button>
                <button
                  onClick={handleClearDraft}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800 transition-all cursor-pointer"
                  title="تفريغ المسودة"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* TAB CONTENT PANE */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
              {/* TAB 1: BUILDER EDITOR */}
              {activeTab === 'builder' && (
                <div className="space-y-5">
                  {/* SECTION 1: INTRO */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 sm:p-5 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-xs font-mono font-bold text-teal-300 border border-teal-500/30">
                          1
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            المقدمة الإشكالية (0.5 نقطة)
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            تمهيد وإحاطة بالموضوع (الإطار الزماني والمكاني) + طرح التساؤلين بدقة
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setIntroText((prev) => `${prev}؟`)}
                          className="rounded-lg bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold text-teal-300 cursor-pointer"
                          title="إدراج علامة استفهام"
                        >
                          + علامة ؟
                        </button>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                            hasIntroQuestions
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {hasIntroQuestions ? '✓ تم طرح الإشكالية (؟)' : '⚠️ لا تنسَ طرح التساؤلين (؟)'}
                        </span>
                      </div>
                    </div>

                    <textarea
                      value={introText}
                      onChange={(e) => setIntroText(e.target.value)}
                      placeholder="اكتب تمهيداً وظيفياً يحدد السياق التاريخي/الجغرافي، ثم اطرح التساؤلين المطلوبين في نهاية المقدمة (لا تنسَ علامتي الاستفهام ؟)..."
                      rows={3}
                      className="w-full rounded-xl border border-stone-800 bg-[#050b1c] p-3.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed min-h-[90px]"
                    />
                  </div>

                  {/* SECTION 2: BODY PART 1 */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 sm:p-5 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-mono font-bold text-amber-300 border border-amber-500/30">
                          2.1
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            العرض - العنصر الأول (1.5 نقطة)
                          </h4>
                          <p className="text-[10px] text-amber-300 font-bold">
                            {activeTopic.requiredQuestions[0]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-stone-900 border border-stone-800 px-2.5 py-0.5 text-[10px] font-bold text-stone-300">
                          المطّات: {countBulletsPart1} / 4 على الأقل
                        </span>
                        <button
                          onClick={() => handleAddBulletTo('body1')}
                          className="rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2 py-1 text-[10px] font-bold text-amber-300 cursor-pointer"
                        >
                          + إضافة مطّة (•)
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-400 bg-amber-500/5 p-2 rounded-xl border border-amber-500/15">
                      💡 <strong>قاعدة البكالوريا الذهبية:</strong> لا تكتب فقرة إنشائية مدمجة! اكتب كل فكرة أو حجة في مطّة مستقلة (•).
                    </div>

                    <textarea
                      value={bodyPart1}
                      onChange={(e) => setBodyPart1(e.target.value)}
                      placeholder="• الفكرة الأولى...&#10;• الفكرة الثانية...&#10;• الفكرة الثالثة...&#10;• الفكرة الرابعة..."
                      rows={5}
                      className="w-full rounded-xl border border-stone-800 bg-[#050b1c] p-3.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans min-h-[120px]"
                    />
                  </div>

                  {/* SECTION 3: BODY PART 2 */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 sm:p-5 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-xs font-mono font-bold text-amber-300 border border-amber-500/30">
                          2.2
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            العرض - العنصر الثاني (1.5 نقطة)
                          </h4>
                          <p className="text-[10px] text-amber-300 font-bold">
                            {activeTopic.requiredQuestions[1]}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-stone-900 border border-stone-800 px-2.5 py-0.5 text-[10px] font-bold text-stone-300">
                          المطّات: {countBulletsPart2} / 4 على الأقل
                        </span>
                        <button
                          onClick={() => handleAddBulletTo('body2')}
                          className="rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 px-2 py-1 text-[10px] font-bold text-amber-300 cursor-pointer"
                        >
                          + إضافة مطّة (•)
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={bodyPart2}
                      onChange={(e) => setBodyPart2(e.target.value)}
                      placeholder="• الفكرة الأولى...&#10;• الفكرة الثانية...&#10;• الفكرة الثالثة...&#10;• الفكرة الرابعة..."
                      rows={5}
                      className="w-full rounded-xl border border-stone-800 bg-[#050b1c] p-3.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed font-sans min-h-[120px]"
                    />
                  </div>

                  {/* SECTION 4: CONCLUSION */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 sm:p-5 space-y-3 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/80 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/30">
                          3
                        </span>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            الخاتمة والامتداد (0.5 نقطة)
                          </h4>
                          <span className="text-[10px] text-stone-400">
                            استنتاج تركيبي شامل غير مكرر للعرض يخرج بحوصلة ويفتح آفاقاً جديدة
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setConclusionText('ختاماً، نستنتج أن ')}
                          className="rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 cursor-pointer"
                        >
                          صيغة البدء
                        </button>
                        <span className="text-[10px] text-emerald-400 font-bold">
                          {conclusionText.trim().length > 30 ? '✓ استنتاج وافٍ' : 'استنتاج من سطرين إلى 3'}
                        </span>
                      </div>
                    </div>

                    <textarea
                      value={conclusionText}
                      onChange={(e) => setConclusionText(e.target.value)}
                      placeholder="ختاماً، نستنتج أن..."
                      rows={3}
                      className="w-full rounded-xl border border-stone-800 bg-[#050b1c] p-3.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed min-h-[90px]"
                    />
                  </div>

                  {/* SUBMIT ACTION BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-[#0a1329] to-stone-900 border border-stone-800">
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <ShieldCheck className="h-5 w-5 text-teal-400" />
                      <span>يتم التحليل الفوري للمطّات، الكلمات المفتاحية، واستيفاء الإشكالية</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyFullEssay}
                        className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800/80 px-4 py-2.5 text-xs font-bold text-stone-200 hover:bg-stone-800 cursor-pointer"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                        <span>{copied ? 'تم النسخ' : 'نسخ المسودة'}</span>
                      </button>

                      <button
                        onClick={handleRunEvaluation}
                        disabled={isGrading}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-teal-400 px-6 py-2.5 text-xs font-black text-stone-950 shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                      >
                        {isGrading ? (
                          <Sparkles className="h-4 w-4 animate-spin text-stone-950" />
                        ) : (
                          <Send className="h-4 w-4 text-stone-950" />
                        )}
                        <span>{isGrading ? 'جاري الفحص المنهجي...' : 'تصحيح المقال واحتساب العلامة (04/04)'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: OFFICIAL SAMPLE SOLUTION */}
              {activeTab === 'sample' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                    <div>
                      <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        الإجابة النموذجية المعتمدة رسمياً في مراكز التصحيح (العلامة 04/04)
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        مبنية وفق شبكة التقويم الرسمية لمفتشية التربية الوطنية
                      </p>
                    </div>

                    <button
                      onClick={handleCopySample}
                      className="flex items-center gap-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/30 cursor-pointer"
                    >
                      {copiedSample ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      <span>{copiedSample ? 'تم النسخ بنجاح' : 'نسخ النموذج الكامل'}</span>
                    </button>
                  </div>

                  {/* Intro Box */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-teal-300">1. المقدمة النموذجية (0.5 ن):</span>
                      <span className="text-[10px] text-stone-400">تمهيد + طرح الإشكالية</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed bg-[#050b1c] p-3.5 rounded-xl border border-stone-800/80 whitespace-pre-line">
                      {activeTopic.sampleSolution.intro}
                    </p>
                  </div>

                  {/* Body Part 1 */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-300">2.1. العرض - العنصر الأول (1.5 ن):</span>
                      <span className="text-[10px] text-amber-300">نظام المطّات المستقلة</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed bg-[#050b1c] p-3.5 rounded-xl border border-stone-800/80 whitespace-pre-line font-sans">
                      {activeTopic.sampleSolution.body[0]}
                    </p>
                  </div>

                  {/* Body Part 2 */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-300">2.2. العرض - العنصر الثاني (1.5 ن):</span>
                      <span className="text-[10px] text-amber-300">نظام المطّات المستقلة</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed bg-[#050b1c] p-3.5 rounded-xl border border-stone-800/80 whitespace-pre-line font-sans">
                      {activeTopic.sampleSolution.body[1]}
                    </p>
                  </div>

                  {/* Conclusion */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-emerald-300">3. الخاتمة الاستنتاجية (0.5 ن):</span>
                      <span className="text-[10px] text-stone-400">حوصلة تركيبية + فتح آفاق</span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed bg-[#050b1c] p-3.5 rounded-xl border border-stone-800/80 whitespace-pre-line">
                      {activeTopic.sampleSolution.conclusion}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: RUBRIC DETAILS */}
              {activeTab === 'rubric' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                    <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      سلم التنقيط الوزاري وشبكة تفريغ العلامات (04/04)
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      توزيع النقاط الدقيق المعتمد في مداولات وتصحيح البكالوريا
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#091128] border border-stone-800 space-y-1.5">
                      <span className="text-teal-300 font-extrabold block">المقدمة (0.5 ن)</span>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        • 0.25 ن للإحاطة بالموضوع والسياق الزمني والمكاني.<br />
                        • 0.25 ن لطرح التساؤلين بعلامات استفهام صريحة.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#091128] border border-stone-800 space-y-1.5">
                      <span className="text-amber-300 font-extrabold block">العرض (3.0 ن)</span>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        • 1.5 ن للعنصر الأول (4 إلى 6 مطّات بمعدل 0.25 إلى 0.3 ن لكل فكرة).<br />
                        • 1.5 ن للعنصر الثاني (4 إلى 6 مطّات بالمثل).
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#091128] border border-stone-800 space-y-1.5">
                      <span className="text-emerald-300 font-extrabold block">الخاتمة (0.5 ن)</span>
                      <p className="text-[11px] text-stone-400 leading-relaxed">
                        • 0.5 ن لاستنتاج تركيبي يربط عناصر الموضوع ويفتح آفاقاً جديدة للمستقبل.
                      </p>
                    </div>
                  </div>

                  {/* Expected Elements Breakdown */}
                  <div className="rounded-2xl border border-stone-800 bg-[#091128] p-4 space-y-3">
                    <h5 className="text-xs font-bold text-white">العناصر الإلزامية في دليل التصحيح:</h5>
                    <div className="space-y-3 text-xs">
                      {activeTopic.officialRubric.expectedElements.map((elem, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-[#050b1c] border border-stone-800/80 space-y-2">
                          <span className="font-bold text-amber-300 block">
                            السؤال {idx + 1}: {activeTopic.requiredQuestions[idx]}
                          </span>
                          <ul className="list-disc list-inside text-[11px] text-stone-300 space-y-1 pr-1">
                            {elem.expectedPoints.map((pt, pIdx) => (
                              <li key={pIdx} className="leading-relaxed">{pt}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: METHODOLOGY TIPS & PITFALLS */}
              {activeTab === 'tips' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                    <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      الأخطاء القاتلة والمحاذير المنهجية التي تخصم العلامات
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      توجيهات أساتذة التصحيح لتجنب فقدان النقاط المجانية
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-4 rounded-2xl bg-[#091128] border border-stone-800 space-y-2">
                      <span className="font-extrabold text-teal-300 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-teal-400" />
                        ما يجب عليك فعله (نصائح التفوق):
                      </span>
                      <ul className="text-[11px] text-stone-300 space-y-1.5 leading-relaxed">
                        <li>• صياغة تساؤلين صريحين ينتهيان بـ (؟) في المقدمة.</li>
                        <li>• كتابة العرض في شكل مطّات واضحة مسبوقة بـ (•).</li>
                        <li>• دعم الأفكار بالتواريخ والاتفاقيات والمفاهيم الرسمية.</li>
                        <li>• كتابة خاتمة كاستنتاج مستقل لا يكرر ما ورد في العرض.</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#091128] border border-rose-500/30 bg-rose-500/5 space-y-2">
                      <span className="font-extrabold text-rose-300 flex items-center gap-1.5">
                        <AlertCircle className="h-4 w-4 text-rose-400" />
                        أخطاء شائعة تؤدي لخصم العلامات:
                      </span>
                      <ul className="text-[11px] text-rose-200/90 space-y-1.5 leading-relaxed">
                        {activeTopic.methodologyTips.forbiddenErrors.map((err, i) => (
                          <li key={i}>• {err}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* EVALUATION RESULTS MODAL OVERLAY */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {showResultModal && evaluation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-2xl rounded-3xl border border-stone-700 bg-[#091128] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
                      <Award className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-white">
                        تقرير التصحيح والتقييم المنهجي للمقال
                      </h3>
                      <p className="text-xs text-stone-400">{activeTopic.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Score Big Banner */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-[#0e1b3d] to-stone-900 border border-amber-500/30">
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-stone-400 block mb-0.5">العلامة الإجمالية التقديرية</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-amber-300 font-mono">
                        {evaluation.totalScore.toFixed(1)}
                      </span>
                      <span className="text-base text-stone-400 font-bold">/ 04.0 نقاط</span>
                    </div>
                    <span className="text-xs font-bold text-teal-300 block mt-1">
                      {evaluation.verdict}
                    </span>
                  </div>

                  <div className="flex flex-col items-center sm:items-end gap-1">
                    <div className="h-14 w-14 rounded-full border-4 border-amber-400 flex items-center justify-center font-mono font-black text-base text-white bg-amber-500/10">
                      {evaluation.gradePercentage}%
                    </div>
                    <span className="text-[10px] text-stone-400">نسبة التطابق المنهجي</span>
                  </div>
                </div>

                {/* Section-by-Section Breakdown */}
                <div className="space-y-2.5 text-xs">
                  <h4 className="font-bold text-white">تفصيل النقاط حسب المحاور:</h4>

                  {/* Intro Breakdown */}
                  <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-teal-300">1. المقدمة الإشكالية:</span>
                      <p className="text-[11px] text-stone-400">
                        {evaluation.introResult.feedback.join(' ')}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {evaluation.introResult.score.toFixed(2)} / 0.50
                    </span>
                  </div>

                  {/* Body 1 Breakdown */}
                  <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300">2.1. العرض (العنصر 1):</span>
                      <p className="text-[11px] text-stone-400">
                        {evaluation.body1Result.feedback.join(' ')}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {evaluation.body1Result.score.toFixed(2)} / 1.50
                    </span>
                  </div>

                  {/* Body 2 Breakdown */}
                  <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300">2.2. العرض (العنصر 2):</span>
                      <p className="text-[11px] text-stone-400">
                        {evaluation.body2Result.feedback.join(' ')}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {evaluation.body2Result.score.toFixed(2)} / 1.50
                    </span>
                  </div>

                  {/* Conclusion Breakdown */}
                  <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-emerald-300">3. الخاتمة والاستنتاج:</span>
                      <p className="text-[11px] text-stone-400">
                        {evaluation.conclusionResult.feedback.join(' ')}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {evaluation.conclusionResult.score.toFixed(2)} / 0.50
                    </span>
                  </div>
                </div>

                {/* Suggestions & Improvements */}
                {evaluation.suggestedImprovements.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                    <span className="font-bold text-amber-300 block">نصائح فورية لرفع العلامة إلى 04/04:</span>
                    <ul className="text-[11px] text-stone-300 space-y-1 list-disc list-inside pr-1">
                      {evaluation.suggestedImprovements.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Bottom Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-800">
                  <button
                    onClick={() => {
                      setShowResultModal(false);
                      setActiveTab('sample');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-200 cursor-pointer"
                  >
                    مقارنة مع الحل النموذجي
                  </button>
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-black text-xs hover:bg-amber-400 cursor-pointer shadow-md"
                  >
                    متابعة التعديل والتدريب
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
