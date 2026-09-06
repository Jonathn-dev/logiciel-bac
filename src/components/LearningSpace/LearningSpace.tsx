import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LessonData, LessonContentType } from '../../types';
import { ALGERIAN_BAC_LESSONS } from '../../data/algerianBacLessons';
import { useLessonProgress } from '../../hooks/useLessonProgress';
import { useAICompanion } from '../../hooks/useAICompanion';
import { useFocusMode } from '../../hooks/useFocusMode';

// Subcomponents
import { ParallaxShelves } from '../LibraryBackground/ParallaxShelves';
import { FloatingLanterns } from '../LibraryBackground/FloatingLanterns';
import { DustParticles } from '../LibraryBackground/DustParticles';
import { ContentMorph } from '../LessonStage/ContentMorph';
import { FloatingOrb } from '../AICompanion/FloatingOrb';
import { ChatBubble } from '../AICompanion/ChatBubble';
import { ContextAwareGlow } from '../AICompanion/ContextAwareGlow';
import { MagicNotebook } from '../NoteSidebar/MagicNotebook';
import { ConnectionLines } from '../NoteSidebar/ConnectionLines';
import { FocusToggle } from '../FocusMode/FocusToggle';

import {
  ArrowRight,
  BookOpen,
  BookMarked,
  Sparkles,
  Award,
  Flame,
  ChevronDown,
  Layers,
  Search,
  Compass,
  Swords,
} from 'lucide-react';
import { StudyHubModal } from '../StudyHub/StudyHubModal';
import { QuizModal } from '../Modals/QuizModal';
import { EssayModal } from '../Modals/EssayModal';
import { ThemeToggle } from '../Theme/ThemeToggle';
import { PenTool } from 'lucide-react';

interface LearningSpaceProps {
  onBackToDashboard: () => void;
  onAwardXP: (amount: number, reason: string) => void;
  strictMode: boolean;
  initialLessonId?: string;
}

export const LearningSpace: React.FC<LearningSpaceProps> = ({
  onBackToDashboard,
  onAwardXP,
  strictMode,
  initialLessonId,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || ALGERIAN_BAC_LESSONS[0].id
  );
  const activeLesson: LessonData =
    ALGERIAN_BAC_LESSONS.find((l) => l.id === activeLessonId) || ALGERIAN_BAC_LESSONS[0];

  const [activeMode, setActiveMode] = useState<LessonContentType>('text');
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [isStudyHubOpen, setIsStudyHubOpen] = useState(false);
  const [isQuizArenaOpen, setIsQuizArenaOpen] = useState(false);
  const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
  const [studyHubTab, setStudyHubTab] = useState<'flashcards' | 'chrono' | 'maps' | 'essay'>('flashcards');
  const [injectedNoteText, setInjectedNoteText] = useState<string | null>(null);

  // Hooks
  const {
    progress,
    markSectionCompleted,
    toggleTermMastered,
    handleCheckpointAnswer,
    claimCompletionXP,
  } = useLessonProgress(activeLesson, onAwardXP);

  const {
    status: aiStatus,
    messages: aiMessages,
    isOpen: isAIOpen,
    setIsOpen: setIsAIOpen,
    askAI,
    clearHistory: clearAIHistory,
  } = useAICompanion(activeLesson, strictMode);

  const {
    focusState,
    reducedMotion,
    toggleFocusMode,
    togglePomodoro,
    resetPomodoro,
    setAmbientSound,
    setVolume,
  } = useFocusMode();

  const handleSelectConceptForAI = (concept: string) => {
    setIsAIOpen(true);
    askAI(`وضح لي بإيجاز وبشكل مطابق للإطار المرجعي: ${concept}`);
  };

  const handleAddNoteAtTimestamp = (timestampStr: string, concept: string) => {
    setIsNotebookOpen(true);
    setInjectedNoteText(`[توقيت ${timestampStr}]: ملاحظة حول «${concept}» في درس ${activeLesson.title}`);
  };

  const handleInsertNoteFromAI = (text: string) => {
    setIsNotebookOpen(true);
    setInjectedNoteText(text);
  };

  return (
    <div className="relative min-h-screen bg-[#040814] text-stone-100 font-sans selection:bg-amber-400 selection:text-stone-950 overflow-x-hidden">
      {/* 1. Immersive Library Background Elements */}
      <ParallaxShelves reducedMotion={reducedMotion} />
      <FloatingLanterns reducedMotion={reducedMotion} />
      <DustParticles reducedMotion={reducedMotion} />
      <ConnectionLines activeCount={activeLesson.expandableTerms.length} />

      {/* 2. Top Navigation Bar */}
      <header
        className={`sticky top-0 z-30 border-b border-stone-800/80 bg-[#060c19]/80 backdrop-blur-xl px-4 py-3.5 md:px-8 transition-opacity ${
          focusState.isActive ? 'opacity-30 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="btn-back-dashboard"
              onClick={onBackToDashboard}
              className="flex items-center gap-2 rounded-2xl border border-stone-700/80 bg-stone-900/80 px-3.5 py-2 text-xs font-black text-stone-200 hover:border-amber-400 hover:text-amber-300 transition-all shadow-md"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة للوحة القيادة</span>
            </button>

            {/* Lesson Switcher Dropdown */}
            <div className="relative">
              <select
                id="select-active-lesson"
                value={activeLessonId}
                onChange={(e) => {
                  setActiveLessonId(e.target.value);
                  setActiveMode('text');
                }}
                className="appearance-none rounded-2xl border border-amber-500/30 bg-[#0b1426] py-2 pr-4 pl-9 text-xs font-black text-amber-300 focus:border-amber-400 focus:outline-none shadow-lg cursor-pointer"
              >
                {ALGERIAN_BAC_LESSONS.map((les) => (
                  <option key={les.id} value={les.id}>
                    {les.subject === 'history' ? '📜 تاريخ: ' : '🌍 جغرافيا: '}
                    {les.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2.5">
            {/* Open Quiz Arena Button */}
            <button
              onClick={() => setIsQuizArenaOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-2 text-xs font-black text-white shadow-md shadow-amber-500/20 hover:brightness-110 transition-all cursor-pointer"
              title="فتح ساحة التحدي والمعارك الحماسية"
            >
              <Swords className="h-4 w-4 text-white" />
              <span className="hidden sm:inline">ساحة التحدي</span>
            </button>

            {/* Open Essay Studio Button */}
            <button
              onClick={() => setIsEssayModalOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-xs font-black text-stone-950 shadow-md shadow-emerald-500/20 hover:brightness-110 transition-all cursor-pointer"
              title="فتح صانع ومصحح المقالات المنهجية (04/04)"
            >
              <PenTool className="h-4 w-4 text-stone-950" />
              <span className="hidden sm:inline">صانع المقالات</span>
            </button>

            {/* Open Study Hub Button */}
            <button
              onClick={() => setIsStudyHubOpen(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-[#59dad1] to-[#4ade80] px-3 py-2 text-xs font-black text-[#080d3b] shadow-md shadow-[#59dad1]/20 hover:brightness-110 transition-all cursor-pointer"
              title="فتح مركز المراجعة النشطة"
            >
              <Compass className="h-4 w-4 text-[#080d3b]" />
              <span className="hidden sm:inline">المراجعة النشطة</span>
            </button>

            {/* Open Magic Notebook Button */}
            <button
              id="btn-toggle-notebook"
              onClick={() => setIsNotebookOpen(!isNotebookOpen)}
              className={`flex items-center gap-2 rounded-2xl px-3.5 py-2 text-xs font-black transition-all ${
                isNotebookOpen
                  ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/20'
                  : 'border border-stone-700 bg-stone-900/80 text-stone-300 hover:border-stone-600 hover:text-stone-100'
              }`}
            >
              <BookMarked className="h-4 w-4" />
              <span className="hidden sm:inline">الدفتر الذكي</span>
            </button>

            {/* Focus Mode & Pomodoro Toggle */}
            <FocusToggle
              focusState={focusState}
              onToggleFocusMode={toggleFocusMode}
              onTogglePomodoro={togglePomodoro}
              onResetPomodoro={resetPomodoro}
              onSelectAmbientSound={setAmbientSound}
              onVolumeChange={setVolume}
            />

            {/* Night / Day Mode Toggle */}
            <ThemeToggle variant="compact" />
          </div>
        </div>
      </header>

      {/* 3. Main Stage Container */}
      <main
        className={`relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-8 transition-all ${
          focusState.isActive ? 'scale-[1.01]' : ''
        }`}
      >
        <ContentMorph
          lesson={activeLesson}
          activeMode={activeMode}
          onModeChange={setActiveMode}
          masteredTermIds={progress.masteredTermIds}
          completedSectionIds={progress.completedSectionIds}
          progressPercentage={progress.progressPercentage}
          hasClaimedXP={progress.hasClaimedXP}
          onToggleTermMastered={toggleTermMastered}
          onCheckpointAnswer={handleCheckpointAnswer}
          onClaimXP={claimCompletionXP}
          onSelectConceptForAI={handleSelectConceptForAI}
          onAddNoteAtTimestamp={handleAddNoteAtTimestamp}
        />
      </main>

      {/* 4. AI Companion Interactive Orb & Drawer */}
      <ContextAwareGlow status={aiStatus} />
      <FloatingOrb
        status={aiStatus}
        isOpen={isAIOpen}
        onClick={() => setIsAIOpen(!isAIOpen)}
      />
      <ChatBubble
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        messages={aiMessages}
        status={aiStatus}
        lesson={activeLesson}
        onAskQuestion={(q) => askAI(q)}
        onClearChat={clearAIHistory}
        onInsertNoteFromAI={handleInsertNoteFromAI}
      />

      {/* 5. Magic Notebook Sidebar Drawer */}
      <MagicNotebook
        lesson={activeLesson}
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        onAskAIAboutNote={(noteText) => {
          setIsAIOpen(true);
          askAI(`حلل ووسع هذه الملاحظة التي دونتها في دفتري: "${noteText}"`);
        }}
        injectedNoteText={injectedNoteText}
        onClearInjectedNote={() => setInjectedNoteText(null)}
      />

      {/* 6. Active Study Hub Modal */}
      <StudyHubModal
        isOpen={isStudyHubOpen}
        onClose={() => setIsStudyHubOpen(false)}
        userStats={{
          userId: 'student-session',
          name: 'المترشح',
          avatarUrl: '',
          streakDays: 14,
          streakActive: true,
          freezesRemaining: 2,
          totalXP: 1450,
          currentLevel: 4,
          levelTitle: 'رتبة النخبة',
          xpToNextLevel: 550,
          currentLevelBaseXP: 1000,
          nextLevelXP: 2000,
          strictMode: strictMode,
          activeNotebookId: 'nb-1',
          examTargetDate: '2026-06-10T08:00:00.000Z',
        }}
        initialTab={studyHubTab}
        onAwardXP={onAwardXP}
      />

      {/* 7. Quiz Arena Modal */}
      <QuizModal
        isOpen={isQuizArenaOpen}
        onClose={() => setIsQuizArenaOpen(false)}
        onRewardXP={(xp) => onAwardXP(xp, 'معركة ساحة التحدي ⚔️')}
      />

      {/* 8. Essay Studio Modal */}
      <EssayModal
        isOpen={isEssayModalOpen}
        onClose={() => setIsEssayModalOpen(false)}
        onRewardXP={(xp, reason) => onAwardXP(xp, reason)}
      />
    </div>
  );
};
