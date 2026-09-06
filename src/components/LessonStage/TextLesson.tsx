import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonData, ExpandableTerm } from '../../types';
import {
  BookOpen,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  Info,
  ChevronDown,
  Bookmark,
  Award,
  Layers,
} from 'lucide-react';

interface TextLessonProps {
  lesson: LessonData;
  masteredTermIds: string[];
  completedSectionIds: string[];
  onToggleTermMastered: (termId: string) => void;
  onCheckpointAnswer: (sectionId: string, isCorrect: boolean) => void;
  onSelectConceptForAI: (concept: string) => void;
}

export const TextLesson: React.FC<TextLessonProps> = ({
  lesson,
  masteredTermIds,
  completedSectionIds,
  onToggleTermMastered,
  onCheckpointAnswer,
  onSelectConceptForAI,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<ExpandableTerm | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [sectionId: string]: number }>({});
  const [checkedResults, setCheckedResults] = useState<{ [sectionId: string]: boolean }>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleSelectOption = (sectionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [sectionId]: optionIdx }));
  };

  const handleVerifyAnswer = (sectionId: string, correctIdx: number) => {
    const chosen = selectedAnswers[sectionId];
    if (chosen === undefined) return;
    const isCorrect = chosen === correctIdx;
    setCheckedResults((prev) => ({ ...prev, [sectionId]: isCorrect }));
    onCheckpointAnswer(sectionId, isCorrect);
  };

  const handlePlayAudioSnippet = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(
        lesson.audioNarrationSnippet || lesson.summary
      );
      utterance.lang = 'ar-SA';
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-16">
      {/* Audio Narration Bar & Key Meta */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#121c35] via-[#0d162a] to-[#121c35] p-4.5 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            id="btn-narration-audio"
            onClick={handlePlayAudioSnippet}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
              isPlayingAudio
                ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/30 animate-pulse'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
            }`}
            title="استمع إلى التقديم الصوتي للدرس"
            aria-label="التقديم الصوتي"
          >
            <Volume2 className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-400">التقديم البيداغوجي الصوتي</span>
              <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                الإطار المرجعي 2026
              </span>
            </div>
            <p className="text-xs text-stone-300 max-w-xl line-clamp-1">
              {lesson.audioNarrationSnippet || lesson.summary}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-400 font-medium">المفاهيم المرجعية:</span>
          <div className="flex flex-wrap gap-1.5">
            {lesson.expandableTerms.map((term) => (
              <button
                key={term.id}
                id={`chip-term-${term.id}`}
                onClick={() => setSelectedTerm(term)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  masteredTermIds.includes(term.id)
                    ? 'border border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                    : 'border border-stone-700 bg-stone-900/60 text-stone-300 hover:border-amber-500/50 hover:text-amber-300'
                }`}
              >
                {term.term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Text Content Sections */}
      <div className="flex flex-col gap-8">
        {lesson.sections.map((section, idx) => {
          const isCompleted = completedSectionIds.includes(section.id);
          const hasCheckpoint = !!section.checkpointQuestion;
          const checkpointState = checkedResults[section.id];

          return (
            <motion.article
              key={section.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-3xl border p-6 md:p-8 transition-all ${
                isCompleted
                  ? 'border-emerald-500/30 bg-[#0c1626]/90 shadow-lg shadow-emerald-500/5'
                  : 'border-stone-800/80 bg-[#09101d]/90 shadow-xl'
              }`}
            >
              {/* Section Header */}
              <div className="mb-4 flex items-start justify-between gap-4 border-b border-stone-800/80 pb-4">
                <div>
                  <span className="inline-block rounded-md bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 mb-1.5">
                    القسم {idx + 1}
                  </span>
                  <h2 className="text-lg md:text-xl font-extrabold text-stone-100 leading-snug">
                    {section.title}
                  </h2>
                  {section.subheading && (
                    <p className="text-xs md:text-sm font-medium text-stone-400 mt-1">
                      {section.subheading}
                    </p>
                  )}
                </div>

                {isCompleted && (
                  <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>تم الإتقان</span>
                  </div>
                )}
              </div>

              {/* Formatted Text Content with Interactive Term Triggers */}
              <div className="prose prose-invert max-w-none text-stone-200 leading-relaxed text-sm md:text-base font-normal space-y-4 whitespace-pre-line">
                {section.content}
              </div>

              {/* Interactive Terms Action Bar */}
              {section.highlightedTerms && section.highlightedTerms.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-stone-800 bg-stone-900/50 p-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Sparkles className="h-3.5 w-3.5" />
                    استكشف مفاهيم هذا القسم:
                  </span>
                  {section.highlightedTerms.map((tName) => {
                    const matched = lesson.expandableTerms.find(
                      (item) => item.term.includes(tName) || tName.includes(item.term)
                    );
                    return (
                      <button
                        key={tName}
                        id={`btn-explore-${tName}`}
                        onClick={() => {
                          if (matched) {
                            setSelectedTerm(matched);
                          } else {
                            onSelectConceptForAI(tName);
                          }
                        }}
                        className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300 transition-colors hover:bg-amber-500/20"
                      >
                        <span>{tName}</span>
                        <Info className="h-3 w-3" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Embedded Checkpoint Question */}
              {hasCheckpoint && section.checkpointQuestion && (
                <div className="mt-6 rounded-2xl border border-teal-500/30 bg-[#091522] p-5 shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold text-teal-200">
                      نقطة تفتيش بيداغوجية: {section.checkpointQuestion.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 my-3">
                    {section.checkpointQuestion.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[section.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          id={`opt-cp-${section.id}-${optIdx}`}
                          onClick={() => handleSelectOption(section.id, optIdx)}
                          className={`flex items-center justify-between rounded-xl border p-3 text-right text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-teal-400 bg-teal-500/20 text-teal-100 shadow-md'
                              : 'border-stone-700/80 bg-stone-900/60 text-stone-300 hover:border-stone-600 hover:bg-stone-800/60'
                          }`}
                        >
                          <span>{opt}</span>
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                              isSelected
                                ? 'border-teal-400 bg-teal-400'
                                : 'border-stone-500'
                            }`}
                          >
                            {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-stone-950" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-800">
                    <button
                      id={`btn-verify-${section.id}`}
                      onClick={() =>
                        handleVerifyAnswer(
                          section.id,
                          section.checkpointQuestion!.correctIndex
                        )
                      }
                      disabled={selectedAnswers[section.id] === undefined}
                      className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
                        selectedAnswers[section.id] !== undefined
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-stone-950 shadow-lg shadow-teal-500/20 hover:brightness-110 cursor-pointer'
                          : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                      }`}
                    >
                      تحقق من الإجابة (+25 XP)
                    </button>

                    {checkpointState !== undefined && (
                      <div
                        className={`flex items-center gap-2 text-xs font-bold ${
                          checkpointState ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {checkpointState ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <span>إجابة صحيحة ومطابقة للإطار المرجعي!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            <span>إجابة غير دقيقة. حاول مرة أخرى.</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {checkpointState !== undefined && (
                    <p className="mt-3 text-xs text-stone-400 bg-stone-900/60 p-3 rounded-lg border border-stone-800">
                      💡 {section.checkpointQuestion.explanation}
                    </p>
                  )}
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      {/* Expandable Term Detail Modal / Drawer */}
      <AnimatePresence>
        {selectedTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-xl rounded-3xl border border-amber-500/40 bg-[#0d1628] p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between border-b border-stone-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                      {selectedTerm.category === 'concept'
                        ? 'مفهوم مرجعي'
                        : selectedTerm.category === 'personality'
                        ? 'علم تاريخي'
                        : selectedTerm.category === 'event'
                        ? 'حدث وواقعة'
                        : 'مجال جغرافي'}
                    </span>
                    <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-300">
                      تردد في الوطني: {selectedTerm.examFrequency}
                    </span>
                    {selectedTerm.associatedYear && (
                      <span className="rounded-md bg-teal-500/15 px-2 py-0.5 text-xs font-mono font-bold text-teal-300">
                        {selectedTerm.associatedYear}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-black text-stone-100 mt-2">
                    {selectedTerm.term}
                  </h3>
                </div>
                <button
                  id="btn-close-term-modal"
                  onClick={() => setSelectedTerm(null)}
                  className="rounded-xl border border-stone-700 bg-stone-800 p-2 text-stone-400 hover:text-stone-100"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="my-5 space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-amber-400 mb-1">التعريف الرسمي المعتمد في الباك:</h5>
                  <p className="text-sm text-stone-200 leading-relaxed bg-stone-900/70 p-4 rounded-xl border border-stone-800">
                    {selectedTerm.officialDefinition}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs font-bold text-teal-400 mb-1">السياق في أسئلة الامتحان الوطني:</h5>
                  <p className="text-xs text-stone-300 bg-teal-950/30 p-3 rounded-xl border border-teal-500/20">
                    {selectedTerm.examContext}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-stone-800 pt-4">
                <button
                  id="btn-toggle-mastery"
                  onClick={() => onToggleTermMastered(selectedTerm.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    masteredTermIds.includes(selectedTerm.id)
                      ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  {masteredTermIds.includes(selectedTerm.id)
                    ? 'تم الحفظ في المفاهيم المتقنة'
                    : 'حفظ كـ "مفهوم متقن"'}
                </button>

                <button
                  id="btn-ask-ai-about-term"
                  onClick={() => {
                    onSelectConceptForAI(`اشرح لي سياق ومصطلح «${selectedTerm.term}» وطريقة توظيفه في الامتحان الوطني`);
                    setSelectedTerm(null);
                  }}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-stone-950 shadow-md hover:brightness-110"
                >
                  <Sparkles className="h-4 w-4" />
                  اسأل الرفيق الذكي
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
