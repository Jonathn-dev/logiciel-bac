import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  MapPin,
  Clock,
  PenTool,
  Layers,
  Sparkles,
  Award,
  Flame,
  ChevronRight,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { LeitnerDeck } from './Flashcards/LeitnerDeck';
import { DateSortChallenge } from './TimelineArena/DateSortChallenge';
import { MapPinningGame } from './MapsStudio/MapPinningGame';
import { InteractiveEssayBuilder } from './EssayStudio/InteractiveEssayBuilder';
import { UserStats } from '../../types';

interface StudyHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onAwardXP: (xp: number, reason: string) => void;
  initialTab?: 'flashcards' | 'chrono' | 'maps' | 'essay';
}

export const StudyHubModal: React.FC<StudyHubModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onAwardXP,
  initialTab = 'flashcards',
}) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'chrono' | 'maps' | 'essay'>(initialTab);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#030617]/85 backdrop-blur-xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl my-auto rounded-3xl bg-[#060b2b]/95 border border-[#59dad1]/30 shadow-[0_0_60px_rgba(89,218,209,0.15)] flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#040822] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#59dad1]/20 to-[#ffe16d]/20 border border-[#59dad1]/40 flex items-center justify-center text-[#59dad1]">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-black text-white">
                    مركز المراجعة النشطة (Study Hub)
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffe16d]/20 text-[#ffe16d] border border-[#ffe16d]/30 font-mono">
                    BAC 2025/2026
                  </span>
                </div>
                <p className="text-xs text-[#a2a6d0]">
                  حلبات التدريب التفاعلي على المصطلحات، التواريخ، الخرائط، والمقال المنهجي
                </p>
              </div>
            </div>

            {/* User XP & Streak Quick Pill */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#090f38] border border-white/10 text-xs">
                <span className="text-[#ffe16d] font-black">{userStats.totalXP} XP</span>
                <span className="text-[#a2a6d0]">•</span>
                <span className="text-orange-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  {userStats.streakDays} أيام
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-[#a2a6d0] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hub Tool Navigation Tabs */}
          <div className="px-6 py-2.5 bg-[#070d33] border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'flashcards'
                  ? 'bg-[#59dad1] text-[#080d3b] shadow-lg shadow-[#59dad1]/20'
                  : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>بطاقات لايتنر (Leitner Flashcards)</span>
            </button>

            <button
              onClick={() => setActiveTab('chrono')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'chrono'
                  ? 'bg-[#ffe16d] text-[#3a3000] shadow-lg shadow-[#ffe16d]/20'
                  : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>حلبة الترتيب الزمني (Timeline Arena)</span>
            </button>

            <button
              onClick={() => setActiveTab('maps')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'maps'
                  ? 'bg-[#4ade80] text-[#080d3b] shadow-lg shadow-[#4ade80]/20'
                  : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>استوديو التوطين والخرائط (Maps Studio)</span>
            </button>

            <button
              onClick={() => setActiveTab('essay')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === 'essay'
                  ? 'bg-[#a78bfa] text-[#080d3b] shadow-lg shadow-[#a78bfa]/20'
                  : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>صانع المقال المنهجي (Essay Studio)</span>
            </button>
          </div>

          {/* Active Tool Body (Scrollable) */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'flashcards' && (
              <LeitnerDeck onAwardXP={onAwardXP} strictMode={userStats.strictMode} />
            )}

            {activeTab === 'chrono' && (
              <DateSortChallenge onAwardXP={onAwardXP} />
            )}

            {activeTab === 'maps' && (
              <MapPinningGame onAwardXP={onAwardXP} />
            )}

            {activeTab === 'essay' && (
              <InteractiveEssayBuilder onAwardXP={onAwardXP} />
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
