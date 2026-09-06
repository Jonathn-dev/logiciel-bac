import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Layers,
  HelpCircle,
  Clock,
  Flame,
} from 'lucide-react';
import { ChronoChallengeItem } from '../../../types';
import { ALGERIAN_BAC_CHRONO_CHALLENGES } from '../../../data/studyHubData';

interface DateSortChallengeProps {
  onAwardXP: (xp: number, reason: string) => void;
}

export const DateSortChallenge: React.FC<DateSortChallengeProps> = ({ onAwardXP }) => {
  const [activeDeckIndex, setActiveDeckIndex] = useState(0);
  const activeChallenge = ALGERIAN_BAC_CHRONO_CHALLENGES[activeDeckIndex];

  const [currentItems, setCurrentItems] = useState<ChronoChallengeItem[]>([]);
  const [isChecked, setIsChecked] = useState(false);
  const [isPerfect, setIsPerfect] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Initialize and shuffle items when challenge changes
  useEffect(() => {
    shuffleItems();
  }, [activeDeckIndex]);

  const shuffleItems = () => {
    const shuffled = [...activeChallenge.items].sort(() => Math.random() - 0.5);
    setCurrentItems(shuffled);
    setIsChecked(false);
    setIsPerfect(false);
    setScore(null);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (isChecked) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const updated = [...currentItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCurrentItems(updated);
  };

  const handleVerify = () => {
    let correctCount = 0;
    currentItems.forEach((item, index) => {
      if (item.order === index + 1) {
        correctCount++;
      }
    });

    const isAllCorrect = correctCount === activeChallenge.items.length;
    setIsChecked(true);
    setIsPerfect(isAllCorrect);
    setScore(correctCount);

    if (isAllCorrect) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
      onAwardXP(120, `إتقان ترتيب التسلسل الزمني: ${activeChallenge.title}`);
    } else {
      onAwardXP(correctCount * 15, `مكافأة جزئية على ترتيب التواريخ (${correctCount} صحيحة)`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Challenge Switcher */}
      <div className="atlas-glass rounded-2xl p-5 border border-[#ffe16d]/25 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffe16d]/20 text-[#ffe16d] flex items-center justify-center border border-[#ffe16d]/40">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              حلبة الترتيب الزمني للأحداث (Chronology Sort Challenge)
            </h4>
            <p className="text-xs text-[#a2a6d0]">
              قم بإعادة ترتيب الأحداث من الأقدم إلى الأحدث تاريخياً
            </p>
          </div>
        </div>

        {/* Deck Switcher Tabs */}
        <div className="flex items-center gap-2">
          {ALGERIAN_BAC_CHRONO_CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => setActiveDeckIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeDeckIndex === idx
                  ? 'bg-[#ffe16d] text-[#3a3000] shadow-md shadow-[#ffe16d]/20'
                  : 'bg-[#090f38] text-[#a2a6d0] hover:text-white border border-white/5'
              }`}
            >
              {ch.category === 'revolution' ? '🇩🇿 الثورة التحريرية' : '🌐 الحرب الباردة'}
            </button>
          ))}
        </div>
      </div>

      {/* Description and Instruction Card */}
      <div className="flex items-center justify-between px-2 text-xs">
        <span className="text-white font-bold">{activeChallenge.description}</span>
        <span className="text-[#a2a6d0] hidden sm:inline">
          استخدم الأسهم ⬆️ و ⬇️ لتغيير ترتيب البطاقات
        </span>
      </div>

      {/* Challenge Reorderable Cards List */}
      <div className="space-y-3">
        {currentItems.map((item, index) => {
          const isCorrectPosition = isChecked && item.order === index + 1;
          const isWrongPosition = isChecked && item.order !== index + 1;

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                isCorrectPosition
                  ? 'bg-[#4ade80]/15 border-[#4ade80] shadow-md shadow-[#4ade80]/10'
                  : isWrongPosition
                  ? 'bg-rose-500/15 border-rose-500 shadow-md shadow-rose-500/10'
                  : 'atlas-glass border-white/10 hover:border-[#59dad1]/40'
              }`}
            >
              {/* Order Number & Content */}
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 ${
                    isCorrectPosition
                      ? 'bg-[#4ade80] text-[#080d3b]'
                      : isWrongPosition
                      ? 'bg-rose-500 text-white'
                      : 'bg-[#0a0f38] text-[#59dad1] border border-[#59dad1]/30'
                  }`}
                >
                  {index + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                      {item.title}
                    </h5>
                    {isChecked && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d] font-bold">
                        📅 {item.dateStr}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#a2a6d0] line-clamp-1">{item.description}</p>
                </div>
              </div>

              {/* Position Verification Badge or Movement Controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isChecked ? (
                  isCorrectPosition ? (
                    <div className="flex items-center gap-1 text-xs text-[#4ade80] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="hidden sm:inline">صحيح</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-rose-400 font-bold">
                      <XCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">الموقع الصحيح: {item.order}</span>
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-xl bg-[#090f38] hover:bg-[#151f5c] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-white/10"
                      title="تحريك لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === currentItems.length - 1}
                      className="p-2 rounded-xl bg-[#090f38] hover:bg-[#151f5c] text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border border-white/10"
                      title="تحريك لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Result Evaluation & Next Action Controls */}
      <div className="atlas-glass rounded-2xl p-5 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div>
          {score !== null ? (
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#ffe16d]" />
              <span className="text-xs sm:text-sm font-bold text-white">
                النتيجة: {score} من {activeChallenge.items.length} تواريخ صحيحة{' '}
                {isPerfect ? '🎉 (علامة كاملة!)' : '💪'}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#a2a6d0]">
              اضغط على "تحقق من الترتيب" لعرض التواريخ وسلم التصحيح
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={shuffleItems}
            className="px-4 py-2.5 rounded-xl bg-[#090f38] hover:bg-[#151f5c] border border-white/10 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إعادة الخلط
          </button>

          {!isChecked ? (
            <button
              onClick={handleVerify}
              className="px-6 py-2.5 rounded-xl bg-[#ffe16d] hover:bg-[#ffe16d]/90 text-[#3a3000] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#ffe16d]/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              تحقق من الترتيب
            </button>
          ) : (
            <button
              onClick={shuffleItems}
              className="px-6 py-2.5 rounded-xl bg-[#4ade80] hover:bg-[#4ade80]/90 text-[#080d3b] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#4ade80]/20"
            >
              <Sparkles className="w-4 h-4" />
              محاولة جديدة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
