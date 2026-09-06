import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonContentType, LessonData } from '../../types';
import { contentMorphVariants } from '../../utils/contentMorph';
import { TextLesson } from './TextLesson';
import { VideoLesson } from './VideoLesson';
import { InteractiveMap } from './InteractiveMap';
import { TimelineView } from './TimelineView';
import {
  BookOpen,
  PlayCircle,
  Map,
  GitCommit,
  Award,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface ContentMorphProps {
  lesson: LessonData;
  activeMode: LessonContentType;
  onModeChange: (mode: LessonContentType) => void;
  masteredTermIds: string[];
  completedSectionIds: string[];
  progressPercentage: number;
  hasClaimedXP: boolean;
  onToggleTermMastered: (termId: string) => void;
  onCheckpointAnswer: (sectionId: string, isCorrect: boolean) => void;
  onClaimXP: () => void;
  onSelectConceptForAI: (concept: string) => void;
  onAddNoteAtTimestamp: (timestampStr: string, concept: string) => void;
}

export const ContentMorph: React.FC<ContentMorphProps> = ({
  lesson,
  activeMode,
  onModeChange,
  masteredTermIds,
  completedSectionIds,
  progressPercentage,
  hasClaimedXP,
  onToggleTermMastered,
  onCheckpointAnswer,
  onClaimXP,
  onSelectConceptForAI,
  onAddNoteAtTimestamp,
}) => {
  const tabs = [
    { id: 'text' as LessonContentType, label: 'الدرس النصي والمصطلحات', icon: BookOpen },
    { id: 'video' as LessonContentType, label: 'شرح الفيديو والمحطات', icon: PlayCircle },
    { id: 'map' as LessonContentType, label: 'الخريطة التفاعلية', icon: Map },
    { id: 'timeline' as LessonContentType, label: 'الخط الزمني الكرونولوجي', icon: GitCommit },
  ];

  const getTabIndex = (mode: LessonContentType) => {
    return tabs.findIndex((t) => t.id === mode);
  };

  const [direction, setDirection] = useState(0);

  const handleTabClick = (newMode: LessonContentType) => {
    const oldIdx = getTabIndex(activeMode);
    const newIdx = getTabIndex(newMode);
    setDirection(newIdx > oldIdx ? 1 : -1);
    onModeChange(newMode);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Lesson Header & Morph Mode Switcher */}
      <div className="rounded-3xl border border-stone-800 bg-[#09101d]/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-stone-800 pb-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="rounded-md bg-amber-500/20 px-2.5 py-0.5 text-xs font-black text-amber-400">
                {lesson.subject === 'history' ? 'مقرر التاريخ' : 'مقرر الجغرافيا'}
              </span>
              <span className="rounded-md bg-teal-500/20 px-2.5 py-0.5 text-xs font-bold text-teal-300">
                {lesson.unit}
              </span>
              <span className="rounded-md bg-stone-800 px-2.5 py-0.5 text-xs font-medium text-stone-300">
                ⏱ {lesson.estimatedMinutes} دقيقة مراجعة
              </span>
            </div>

            <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-stone-100 leading-tight">
              {lesson.title}
            </h1>
            <p className="text-xs md:text-sm font-medium text-stone-400 mt-2">
              {lesson.subtitle}
            </p>
          </div>

          {/* XP & Progress Badge */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-2">
              <Sparkles className="h-5 w-5 text-amber-400" />
              <div className="text-right">
                <div className="text-[11px] font-bold text-stone-400">مكافأة الوحدة</div>
                <div className="text-base font-black text-amber-300">+{lesson.totalXP} XP</div>
              </div>
            </div>

            {progressPercentage >= 80 && !hasClaimedXP && (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                id="btn-claim-lesson-xp"
                onClick={onClaimXP}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-4 py-1.5 text-xs font-black text-stone-950 shadow-lg shadow-amber-500/30 animate-pulse"
              >
                <Award className="h-4 w-4" />
                <span>استلم المكافأة الآن!</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold text-stone-400 mb-1.5">
              <span>نسبة الإنجاز والاستيعاب</span>
              <span className="text-amber-400 font-mono">{progressPercentage}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* 4-Way Morph Switcher Tabs */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-stone-800/80 pt-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-morph-${tab.id}`}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs md:text-sm font-extrabold transition-all ${
                  isActive
                    ? 'text-stone-950 shadow-lg'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-900/60 hover:bg-stone-800'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="morph-active-pill"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 shadow-md shadow-amber-400/20"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Morph Animated Stage Content */}
      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeMode}
            custom={direction}
            variants={contentMorphVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full"
          >
            {activeMode === 'text' && (
              <TextLesson
                lesson={lesson}
                masteredTermIds={masteredTermIds}
                completedSectionIds={completedSectionIds}
                onToggleTermMastered={onToggleTermMastered}
                onCheckpointAnswer={onCheckpointAnswer}
                onSelectConceptForAI={onSelectConceptForAI}
              />
            )}

            {activeMode === 'video' && (
              <VideoLesson
                lesson={lesson}
                onAddNoteAtTimestamp={onAddNoteAtTimestamp}
                onSelectConceptForAI={onSelectConceptForAI}
              />
            )}

            {activeMode === 'map' && (
              <InteractiveMap
                lesson={lesson}
                onSelectConceptForAI={onSelectConceptForAI}
              />
            )}

            {activeMode === 'timeline' && (
              <TimelineView
                lesson={lesson}
                onSelectConceptForAI={onSelectConceptForAI}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
