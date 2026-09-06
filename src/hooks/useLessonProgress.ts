import { useState, useEffect, useCallback } from 'react';
import { LessonData } from '../types';

export interface LessonProgress {
  lessonId: string;
  completedSectionIds: string[];
  masteredTermIds: string[];
  quizScore: number;
  totalCheckpoints: number;
  progressPercentage: number;
  hasClaimedXP: boolean;
  notesCount: number;
}

export function useLessonProgress(lesson: LessonData, onAwardXP?: (amount: number, reason: string) => void) {
  const storageKey = `bac_atlas_progress_${lesson.id}`;

  const [progress, setProgress] = useState<LessonProgress>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return {
      lessonId: lesson.id,
      completedSectionIds: [],
      masteredTermIds: [],
      quizScore: 0,
      totalCheckpoints: lesson.sections.filter((s) => !!s.checkpointQuestion).length,
      progressPercentage: 0,
      hasClaimedXP: false,
      notesCount: 0,
    };
  });

  // Persist progress changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      console.warn('Failed to save progress to localStorage', e);
    }
  }, [progress, storageKey]);

  const markSectionCompleted = useCallback((sectionId: string) => {
    setProgress((prev) => {
      if (prev.completedSectionIds.includes(sectionId)) return prev;
      const updated = [...prev.completedSectionIds, sectionId];
      const totalItems = lesson.sections.length + (lesson.expandableTerms.length > 0 ? 1 : 0);
      const percentage = Math.min(100, Math.round((updated.length / totalItems) * 100));
      return {
        ...prev,
        completedSectionIds: updated,
        progressPercentage: percentage,
      };
    });
  }, [lesson.sections.length, lesson.expandableTerms.length]);

  const toggleTermMastered = useCallback((termId: string) => {
    setProgress((prev) => {
      const isMastered = prev.masteredTermIds.includes(termId);
      const updated = isMastered
        ? prev.masteredTermIds.filter((id) => id !== termId)
        : [...prev.masteredTermIds, termId];
      return {
        ...prev,
        masteredTermIds: updated,
      };
    });
  }, []);

  const handleCheckpointAnswer = useCallback(
    (sectionId: string, isCorrect: boolean) => {
      if (isCorrect) {
        markSectionCompleted(sectionId);
        if (onAwardXP) {
          onAwardXP(25, 'إجابة صحيحة في نقطة التفتيش البيداغوجية');
        }
      }
    },
    [markSectionCompleted, onAwardXP]
  );

  const claimCompletionXP = useCallback(() => {
    if (!progress.hasClaimedXP && onAwardXP) {
      onAwardXP(lesson.totalXP, `إتمام دراسة وحدة: ${lesson.title}`);
      setProgress((prev) => ({ ...prev, hasClaimedXP: true, progressPercentage: 100 }));
    }
  }, [lesson.totalXP, lesson.title, onAwardXP, progress.hasClaimedXP]);

  return {
    progress,
    markSectionCompleted,
    toggleTermMastered,
    handleCheckpointAnswer,
    claimCompletionXP,
  };
}
