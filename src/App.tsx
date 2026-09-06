import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { PlanGenerator } from './components/DailyPlan/PlanGenerator';
import { BacProfessionalMap } from './components/StudyHub/MapsStudio/BacProfessionalMap';
import { InteractiveEssayBuilder } from './components/StudyHub/EssayStudio/InteractiveEssayBuilder';
import { QuizArena } from './components/StudyHub/QuizArena/QuizArena';
import { InteractiveTimeline } from './components/StudyHub/Timeline/InteractiveTimeline';
import { FlashcardDeck } from './components/StudyHub/Flashcards/FlashcardDeck';
import { SettingsModal } from './components/SettingsHub/SettingsModal';
import { DailyTask } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plan' | 'maps' | 'essays' | 'quizzes' | 'timeline' | 'flashcards'>('plan');
  
  // Progress & Gamification
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('bac_xp');
    return saved ? parseInt(saved, 10) : 340;
  });
  const [streakDays, setStreakDays] = useState<number>(() => {
    const saved = localStorage.getItem('bac_streak');
    return saved ? parseInt(saved, 10) : 7;
  });

  // Settings
  const [strictMode, setStrictMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bac_strict_mode');
    return saved !== null ? saved === 'true' : true;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Daily Plan state
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [focusTheme, setFocusTheme] = useState<string>('الخطة اليومية الموزعة حسب الوقت (60 دقيقة)');
  const [motivationalQuote, setMotivationalQuote] = useState<string>('«إن الثورة الجزائرية لم تكن معجزة، بل كانت ثمرة إرادة شعب وتخطيط محكم وعزيمة لا تلين»');
  const [sourcesUsed, setSourcesUsed] = useState<string[]>(['المنهاج الرسمي لوزارة التربية الوطنية 2026']);
  const [isLoadingPlan, setIsLoadingPlan] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('bac_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('bac_streak', streakDays.toString());
  }, [streakDays]);

  useEffect(() => {
    localStorage.setItem('bac_strict_mode', strictMode.toString());
  }, [strictMode]);

  // Initial plan load
  useEffect(() => {
    fetchDailyPlan('', 60);
  }, [strictMode]);

  const fetchDailyPlan = async (customPrompt?: string, timeBudgetMinutes: number = 60) => {
    setIsLoadingPlan(true);
    try {
      const res = await fetch('/api/ai/daily-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer demo-token',
        },
        body: JSON.stringify({
          customPrompt,
          timeBudgetMinutes,
          strictMode,
        }),
      });

      const data = await res.json();
      setTasks(data.tasks || []);
      setFocusTheme(data.focusTheme || `الخطة اليومية (${timeBudgetMinutes} دقيقة)`);
      setMotivationalQuote(data.motivationalQuote || '');
      setSourcesUsed(data.sourcesUsed || []);
    } catch (err) {
      console.error('Error fetching plan:', err);
    } finally {
      setIsLoadingPlan(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            setXp((curr) => curr + (t.xpReward || 50));
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleEarnXp = (amount: number) => {
    setXp((curr) => curr + amount);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#05081f] text-[#dfe0ff] flex flex-col selection:bg-amber-400 selection:text-black font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        xp={xp}
        streakDays={streakDays}
        strictMode={strictMode}
        onToggleStrictMode={() => setStrictMode(!strictMode)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'plan' && (
          <PlanGenerator
            tasks={tasks}
            focusTheme={focusTheme}
            motivationalQuote={motivationalQuote}
            sourcesUsed={sourcesUsed}
            isLoading={isLoadingPlan}
            strictMode={strictMode}
            onGeneratePlan={(prompt, timeBudget) => fetchDailyPlan(prompt, timeBudget)}
            onToggleTask={handleToggleTask}
            onToggleStrictMode={() => setStrictMode(!strictMode)}
          />
        )}

        {activeTab === 'maps' && <BacProfessionalMap />}

        {activeTab === 'essays' && <InteractiveEssayBuilder />}

        {activeTab === 'quizzes' && <QuizArena onEarnXp={handleEarnXp} />}

        {activeTab === 'timeline' && <InteractiveTimeline />}

        {activeTab === 'flashcards' && <FlashcardDeck />}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#030514] py-6 text-center text-xs text-[#a2a6d0]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 أطلس وموجه بكالوريا الجزائر • مخصص لجميع الشعب وفق المنهاج الوزاري الرسمي</p>
          <p className="text-[11px] text-amber-400/80">وزارة التربية الوطنية • التاريخ والجغرافيا</p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        strictMode={strictMode}
        onToggleStrictMode={() => setStrictMode(!strictMode)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
      />
    </div>
  );
};
