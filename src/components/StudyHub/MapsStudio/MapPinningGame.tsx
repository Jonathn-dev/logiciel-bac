import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Compass,
  CheckCircle2,
  XCircle,
  Sparkles,
  RotateCcw,
  Award,
  Layers,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Eye,
  EyeOff,
  Flame,
  HelpCircle,
  FileCheck,
  Printer,
} from 'lucide-react';
import {
  BAC_MAP_PRESETS,
  OFFICIAL_BAC_MAP_QUESTIONS,
  MapPreset,
  MapPinQuestion,
} from '../../../data/bacCartographyData';
import { BacProfessionalMap } from './BacProfessionalMap';

interface MapPinningGameProps {
  onAwardXP: (xp: number, reason: string) => void;
  onSelectConceptForAI?: (concept: string) => void;
}

export const MapPinningGame: React.FC<MapPinningGameProps> = ({
  onAwardXP,
  onSelectConceptForAI,
}) => {
  // Studio View Mode: 'arena' (Pinning challenge) | 'atlas' (Interactive explorer) | 'rubric' (Official BAC Guide)
  const [studioMode, setStudioMode] = useState<'arena' | 'atlas' | 'rubric'>('arena');

  // Selected Preset Map
  const [selectedPresetId, setSelectedPresetId] = useState<string>('algeria-revolution-1956');
  const activePreset =
    BAC_MAP_PRESETS.find((p) => p.id === selectedPresetId) || BAC_MAP_PRESETS[0];

  // Active Layers for current preset
  const [activeLayers, setActiveLayers] = useState<string[]>(
    activePreset.layers.map((l) => l.id)
  );

  // Blank Map Exam Mode
  const [isBlankMapMode, setIsBlankMapMode] = useState<boolean>(true);

  // Questions for active preset
  const presetQuestions = OFFICIAL_BAC_MAP_QUESTIONS.filter(
    (q) => q.presetId === activePreset.id
  );
  const fallbackQuestions = OFFICIAL_BAC_MAP_QUESTIONS;
  const questionsToUse = presetQuestions.length > 0 ? presetQuestions : fallbackQuestions;

  // Active Question Index & State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questionsToUse[currentQuestionIndex] || questionsToUse[0];

  const handleSelectPreset = (presetId: string) => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    setSelectedPresetId(presetId);
    const newPreset = BAC_MAP_PRESETS.find((p) => p.id === presetId) || BAC_MAP_PRESETS[0];
    setActiveLayers(newPreset.layers.map((l) => l.id));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleToggleLayer = (layerId: string) => {
    setActiveLayers((prev) =>
      prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]
    );
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered || !currentQuestion) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      onAwardXP(50 + nextStreak * 10, `توطين صحيح على الخريطة الرسمية: ${currentQuestion.name}`);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
      });
    } else {
      setStreak(0);
    }

    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleNextQuestion = () => {
    if (autoAdvanceRef.current) {
      clearTimeout(autoAdvanceRef.current);
      autoAdvanceRef.current = null;
    }
    if (currentQuestionIndex < questionsToUse.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const isCurrentCorrect = selectedOption && currentQuestion && selectedOption === currentQuestion.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Top Header Bar & Mode Navigation */}
      <div className="atlas-glass rounded-3xl p-5 border border-[#59dad1]/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#59dad1]/20 to-[#ffe16d]/20 text-[#59dad1] flex items-center justify-center border border-[#59dad1]/40 shadow-inner">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-serif font-black text-white">
                استوديو الخرائط وأطلس البكالوريا (BAC Cartography Studio)
              </h4>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
                خرائط رسمية تفاعلية
              </span>
            </div>
            <p className="text-xs text-[#a2a6d0]">
              تدرب على أسئلة التوقيع على الخرائط الصماء، واستكشف أطلس التاريخ والجغرافيا الرسمي للبكالوريا
            </p>
          </div>
        </div>

        {/* Studio Sub-Tab Switcher */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#060b28] border border-white/10">
          <button
            onClick={() => setStudioMode('arena')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              studioMode === 'arena'
                ? 'bg-[#59dad1] text-[#080d3b] shadow-md shadow-[#59dad1]/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>حلبة التوطين (Quiz Arena)</span>
          </button>

          <button
            onClick={() => {
              setStudioMode('atlas');
              setIsBlankMapMode(false);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              studioMode === 'atlas'
                ? 'bg-[#ffe16d] text-[#3a3000] shadow-md shadow-[#ffe16d]/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>أطلس الخرائط والطبقات</span>
          </button>

          <button
            onClick={() => setStudioMode('rubric')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              studioMode === 'rubric'
                ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>دليل التوقيع المنهجي (2/2)</span>
          </button>
        </div>
      </div>

      {/* Preset Map Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {BAC_MAP_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedPresetId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer border shrink-0 ${
                isSelected
                  ? 'bg-gradient-to-r from-[#59dad1]/20 to-[#ffe16d]/20 border-[#59dad1] text-white shadow-lg shadow-[#59dad1]/15'
                  : 'bg-[#090f38]/80 border-white/10 text-[#a2a6d0] hover:text-white hover:border-white/20'
              }`}
            >
              <span>{preset.title.split('(')[0]}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  preset.category === 'history'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-teal-500/20 text-teal-300'
                }`}
              >
                {preset.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: ARENA PINNING GAME (Interactive Blank Map Challenge)               */}
      {/* ========================================================================= */}
      {studioMode === 'arena' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left / Center: Professional Vector Canvas */}
          <div className="lg:col-span-8 space-y-3">
            <BacProfessionalMap
              preset={activePreset}
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              activePinQuestion={currentQuestion}
              isBlankMapMode={isBlankMapMode}
              onToggleBlankMapMode={() => setIsBlankMapMode(!isBlankMapMode)}
            />
          </div>

          {/* Right: Question Card & Pedagogical Hints Panel */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
            {/* Clue Prompt Card */}
            <div className="atlas-glass rounded-3xl p-5 border border-[#ffe16d]/30 space-y-3.5 bg-[#060c2b]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30">
                    سؤال التوطين {currentQuestionIndex + 1} / {questionsToUse.length}
                  </span>
                </div>
                <span className="text-xs text-orange-400 font-black flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  الستريك: {streak} 🔥
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
                ما هو الموقع أو المعلم التاريخي/الجغرافي المحدد بالنقطة الصفراء النابضة؟
              </h4>

              <div className="p-3.5 rounded-2xl bg-[#090f38] border border-white/10 text-xs text-[#dfe0ff] leading-relaxed">
                <strong className="text-[#ffe16d] block mb-1">💡 التلميح البيداغوجي:</strong>
                {currentQuestion.clue}
              </div>
            </div>

            {/* Multiple Choice Options Grid */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((opt, idx) => {
                const isChosen = selectedOption === opt;
                const isCorrectOpt = opt === currentQuestion.correctAnswer;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-2xl border text-right transition-all font-bold text-xs flex items-center justify-between cursor-pointer ${
                      isAnswered
                        ? isCorrectOpt
                          ? 'bg-[#4ade80]/20 border-[#4ade80] text-[#4ade80] shadow-md shadow-[#4ade80]/20 ring-1 ring-[#4ade80]'
                          : isChosen
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-[#090f38] border-white/5 text-[#a2a6d0] opacity-50'
                        : 'bg-[#090f38] border-white/10 hover:border-[#59dad1] text-white hover:bg-[#111a56]'
                    }`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />}
                    {isAnswered && isChosen && !isCorrectOpt && <XCircle className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {/* Historical Significance Feedback Box */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="p-4 rounded-2xl bg-[#080d3b] border border-[#59dad1]/30 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#ffe16d]" />
                      الأهمية المنهجية في البكالوريا:
                    </h5>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCurrentCorrect ? 'bg-[#4ade80]/20 text-[#4ade80]' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {isCurrentCorrect ? 'إجابة نموذجية (+50 XP)' : 'إجابة غير صحيحة'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#dfe0ff] leading-relaxed">
                    {currentQuestion.historicalSignificance}
                  </p>

                  <div className="p-2 rounded-xl bg-black/30 border border-white/5 text-[10px] text-amber-300">
                    <strong>📌 نصيحة المصحح:</strong> {currentQuestion.officialBacTip}
                  </div>

                  {currentQuestion.keyFiguresOrData && (
                    <div className="text-[10px] text-[#59dad1] font-mono">
                      <strong>عناصر إضافية:</strong> {currentQuestion.keyFiguresOrData.join(' • ')}
                    </div>
                  )}

                  <button
                    onClick={handleNextQuestion}
                    className="w-full mt-2 py-2.5 rounded-xl bg-[#59dad1] hover:bg-[#59dad1]/90 text-[#080d3b] font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#59dad1]/20"
                  >
                    <span>السؤال التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE ATLAS & LAYERS EXPLORER                                */}
      {/* ========================================================================= */}
      {studioMode === 'atlas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <BacProfessionalMap
              preset={activePreset}
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              isBlankMapMode={false}
            />
          </div>

          {/* Atlas Inspection & Details Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="atlas-glass rounded-3xl p-5 border border-white/10 space-y-4 bg-[#060c2b]">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <div className="w-8 h-8 rounded-xl bg-[#59dad1]/20 text-[#59dad1] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">بيانات الخريطة والطبقات</h4>
                  <p className="text-[11px] text-[#a2a6d0]">{activePreset.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                {activePreset.description}
              </p>

              {/* Layer Cards */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-[#ffe16d]">الطبقات الجغرافية المضمنة:</h5>
                {activePreset.layers.map((l) => (
                  <div
                    key={l.id}
                    className="p-3 rounded-2xl bg-[#090f38] border border-white/5 flex items-start gap-2.5 text-xs"
                  >
                    <div
                      className="w-3 h-3 rounded-full mt-0.5 shrink-0"
                      style={{ backgroundColor: l.color }}
                    />
                    <div>
                      <div className="font-bold text-white">{l.label}</div>
                      <div className="text-[10px] text-[#a2a6d0]">{l.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {onSelectConceptForAI && (
                <button
                  onClick={() =>
                    onSelectConceptForAI(
                      `اشرح لي تحليلاً منهجياً مفصلاً لخريطة «${activePreset.officialExamTitle}» مع ذكر أهم التواريخ والشخصيات والمصطلحات المرتبطة بها وكيفية توقيعها في البكالوريا.`
                    )
                  }
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#59dad1] to-[#ffe16d] text-[#080d3b] font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#59dad1]/20 hover:brightness-105 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>طلب تحليل الخريطة بالذكاء الاصطناعي</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: OFFICIAL CARTOGRAPHY RULES & RUBRIC GUIDE (2/2)                    */}
      {/* ========================================================================= */}
      {studioMode === 'rubric' && (
        <div className="atlas-glass rounded-3xl p-6 sm:p-8 border border-[#59dad1]/30 space-y-6 bg-[#060c2b]">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#59dad1]/20 to-[#ffe16d]/20 border border-[#59dad1]/30 flex items-center justify-center text-[#59dad1]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-black text-white">
                القواعد الذهبية الأربع للعلامة الكاملة (2.0 / 2.0) في سؤال الخريطة
              </h3>
              <p className="text-xs text-[#a2a6d0]">
                شبكة التصحيح الوزاري الرسمية المعتمدة في مراكز تصحيح البكالوريا لمادتي التاريخ والجغرافيا
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rule 1: Title */}
            <div className="p-5 rounded-2xl bg-[#090f38] border border-[#59dad1]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#59dad1] px-2 py-0.5 rounded bg-[#59dad1]/15 font-mono">
                  المعيار 01 (0.50 ن)
                </span>
                <span className="text-xs">🏷️</span>
              </div>
              <h4 className="text-sm font-bold text-white">العنوان الكامل والشامل</h4>
              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                كتابة عنوان رسمي أعلى أو أسفل الخريطة يحدد موضوعها ومجالها الزمني والمكاني بدقة (مثال: «خريطة الدول المؤسسة لمنظمة أوبك 1960»).
              </p>
            </div>

            {/* Rule 2: Legend */}
            <div className="p-5 rounded-2xl bg-[#090f38] border border-[#ffe16d]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#ffe16d] px-2 py-0.5 rounded bg-[#ffe16d]/15 font-mono">
                  المعيار 02 (0.50 ن)
                </span>
                <span className="text-xs">📑</span>
              </div>
              <h4 className="text-sm font-bold text-white">المفتاح الاصطلاحي الواضح</h4>
              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                تخصيص علبة مفتاح منظمة تشرح الألوان والرموز النقطية أو الخطية أو الأرقام والحروف المستعملة في التوقيع.
              </p>
            </div>

            {/* Rule 3: Frame & Direction */}
            <div className="p-5 rounded-2xl bg-[#090f38] border border-sky-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-sky-400 px-2 py-0.5 rounded bg-sky-400/15 font-mono">
                  المعيار 03 (0.50 ن)
                </span>
                <span className="text-xs">📐</span>
              </div>
              <h4 className="text-sm font-bold text-white">الإطار وتوجيه الشمال</h4>
              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                رسم إطار يحيط بالخريطة كاملة مع وضع سهم الشمال الجغرافي (N) لإعطاء الطابع الكارتوغرافي الهندسي الأنيق.
              </p>
            </div>

            {/* Rule 4: Accurate Pinning */}
            <div className="p-5 rounded-2xl bg-[#090f38] border border-[#4ade80]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#4ade80] px-2 py-0.5 rounded bg-[#4ade80]/15 font-mono">
                  المعيار 04 (0.50 ن)
                </span>
                <span className="text-xs">🎯</span>
              </div>
              <h4 className="text-sm font-bold text-white">دقة التوقيع الجغرافي</h4>
              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                وضع النقطة أو التظليل أو الرقم داخل الحدود الجغرافية الحقيقية للدولة أو الولاية أو الممر المائي دون تشويه الخريطة.
              </p>
            </div>
          </div>

          {/* Common Mistakes Warning */}
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-3">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              أخطاء متكررة تؤدي لخصم النقاط في البكالوريا (تجنبها حتماً):
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-[#fca5a5]">
              <li className="flex items-center gap-2">
                <span>❌ نسيان كتابة العنوان الرسمي للخريطة.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>❌ توقيع الدول بكتابة أسمائها بخط عريض مشوه يغطي مساحات الدول المجاورة.</span>
              </li>
              <li className="flex items-center gap-2">
                <span>❌ الخلط بين حقل حاسي مسعود (بترول) وحقل حاسي الرمل (غاز).</span>
              </li>
              <li className="flex items-center gap-2">
                <span>❌ الخلط بين موقع مضيق هرمز (الخليج العربي) ومضيق باب المندب (البحر الأحمر).</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
