import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RotateCw,
  Check,
  X,
  Layers,
  Award,
  BookMarked,
  Filter,
  Lightbulb,
  Flame,
  ArrowRight,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { FlashcardItem } from '../../../types';
import { ALGERIAN_BAC_FLASHCARDS } from '../../../data/studyHubData';

interface LeitnerDeckProps {
  onAwardXP: (xp: number, reason: string) => void;
  strictMode?: boolean;
}

export const LeitnerDeck: React.FC<LeitnerDeckProps> = ({ onAwardXP, strictMode = true }) => {
  const [cards, setCards] = useState<FlashcardItem[]>(ALGERIAN_BAC_FLASHCARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'history' | 'geography'>('all');
  const [filterType, setFilterType] = useState<'all' | 'term' | 'personality' | 'date' | 'concept'>('all');
  const [filterBox, setFilterBox] = useState<number | 'all'>('all');
  const [showHint, setShowHint] = useState(false);
  const [masteryStreak, setMasteryStreak] = useState(0);

  // Filtered Cards
  const filteredCards = cards.filter((c) => {
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (filterBox !== 'all' && c.box !== filterBox) return false;
    return true;
  });

  const activeCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleCardMastery = (correct: boolean) => {
    if (!activeCard) return;

    // Update card box in Leitner system
    setCards((prev) =>
      prev.map((c) => {
        if (c.id !== activeCard.id) return c;
        if (correct) {
          const nextBox = Math.min(3, c.box + 1) as 1 | 2 | 3;
          return { ...c, box: nextBox };
        } else {
          return { ...c, box: 1 as 1 | 2 | 3 };
        }
      })
    );

    if (correct) {
      const nextStreak = masteryStreak + 1;
      setMasteryStreak(nextStreak);
      const earnedXP = 15 + nextStreak * 5;
      onAwardXP(earnedXP, `إتقان مصطلح/تاريخ في نظام Leitner (Streak: ${nextStreak})`);

      if (nextStreak % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } else {
      setMasteryStreak(0);
    }

    // Move to next card
    setIsFlipped(false);
    setShowHint(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  // Leitner Boxes Counts
  const box1Count = cards.filter((c) => c.box === 1).length;
  const box2Count = cards.filter((c) => c.box === 2).length;
  const box3Count = cards.filter((c) => c.box === 3).length;

  return (
    <div className="space-y-6">
      {/* Leitner Box System Overview Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Box 1: Daily Focus */}
        <button
          onClick={() => {
            setFilterBox(filterBox === 1 ? 'all' : 1);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
            filterBox === 1
              ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-[#090f38] border-white/10 hover:border-rose-500/50 text-[#dfe0ff]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
              صندوق 1 (يومي)
            </span>
            <span className="text-sm font-black text-rose-400">{box1Count} بطاقة</span>
          </div>
          <p className="text-xs font-bold text-white">بطاقات تحتاج تثبيت فوري</p>
          <p className="text-[10px] text-[#a2a6d0] mt-0.5">تكرار يومي حتى الحفظ</p>
        </button>

        {/* Box 2: Review every 3 days */}
        <button
          onClick={() => {
            setFilterBox(filterBox === 2 ? 'all' : 2);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
            filterBox === 2
              ? 'bg-[#ffe16d]/20 border-[#ffe16d] text-white shadow-lg shadow-[#ffe16d]/20'
              : 'bg-[#090f38] border-white/10 hover:border-[#ffe16d]/50 text-[#dfe0ff]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d]">
              صندوق 2 (مرحلي)
            </span>
            <span className="text-sm font-black text-[#ffe16d]">{box2Count} بطاقة</span>
          </div>
          <p className="text-xs font-bold text-white">مستوى متوسط في التذكر</p>
          <p className="text-[10px] text-[#a2a6d0] mt-0.5">تكرار كل 3 أيام</p>
        </button>

        {/* Box 3: Mastered */}
        <button
          onClick={() => {
            setFilterBox(filterBox === 3 ? 'all' : 3);
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
            filterBox === 3
              ? 'bg-[#4ade80]/20 border-[#4ade80] text-white shadow-lg shadow-[#4ade80]/20'
              : 'bg-[#090f38] border-white/10 hover:border-[#4ade80]/50 text-[#dfe0ff]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4ade80]/20 text-[#4ade80]">
              صندوق 3 (متقن 100%)
            </span>
            <span className="text-sm font-black text-[#4ade80]">{box3Count} بطاقة</span>
          </div>
          <p className="text-xs font-bold text-white">بطاقات راسخة في الذاكرة</p>
          <p className="text-[10px] text-[#a2a6d0] mt-0.5">مراجعة أسبوعية وقبل الامتحان</p>
        </button>
      </div>

      {/* Filter & Category Controls */}
      <div className="atlas-glass rounded-2xl p-4 border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#a2a6d0] flex items-center gap-1 font-bold">
            <Filter className="w-3.5 h-3.5 text-[#59dad1]" />
            المادة:
          </span>
          <button
            onClick={() => {
              setFilterCategory('all');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-[#59dad1] text-[#080d3b]'
                : 'bg-[#090f38] text-[#a2a6d0] hover:text-white'
            }`}
          >
            الكل ({cards.length})
          </button>
          <button
            onClick={() => {
              setFilterCategory('history');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'history'
                ? 'bg-[#ffe16d] text-[#3a3000]'
                : 'bg-[#090f38] text-[#a2a6d0] hover:text-white'
            }`}
          >
            📜 التاريخ
          </button>
          <button
            onClick={() => {
              setFilterCategory('geography');
              setCurrentIndex(0);
            }}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterCategory === 'geography'
                ? 'bg-[#4ade80] text-[#080d3b]'
                : 'bg-[#090f38] text-[#a2a6d0] hover:text-white'
            }`}
          >
            🌍 الجغرافيا
          </button>
        </div>

        {/* Streak & Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black">
            <Flame className="w-4 h-4 fill-orange-400" />
            <span>سلسلة الإتقان: {masteryStreak}</span>
          </div>

          <span className="text-xs text-[#a2a6d0] font-mono">
            {filteredCards.length > 0 ? `${currentIndex + 1} / ${filteredCards.length}` : '0 / 0'}
          </span>
        </div>
      </div>

      {/* Main 3D Flipping Flashcard Canvas */}
      {activeCard ? (
        <div className="relative min-h-[340px] flex flex-col justify-between">
          <div
            onClick={handleFlip}
            className="w-full h-80 cursor-pointer [perspective:1000px] select-none"
          >
            <motion.div
              className="w-full h-full relative [transform-style:preserve-3d] transition-transform duration-500"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              {/* Front Side: Question / Term */}
              <div className="absolute inset-0 w-full h-full rounded-3xl atlas-glass p-8 border border-[#59dad1]/30 [backface-visibility:hidden] flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border ${
                        activeCard.category === 'history'
                          ? 'bg-[#ffe16d]/15 text-[#ffe16d] border-[#ffe16d]/30'
                          : 'bg-[#4ade80]/15 text-[#4ade80] border-[#4ade80]/30'
                      }`}
                    >
                      {activeCard.category === 'history' ? '📜 تاريخ' : '🌍 جغرافيا'} •{' '}
                      {activeCard.type === 'personality'
                        ? 'شخصية وعلم'
                        : activeCard.type === 'date'
                        ? 'تاريخ معلمي'
                        : activeCard.type === 'concept'
                        ? 'مفهوم جغرافي'
                        : 'مصطلح رسمي'}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        activeCard.box === 3
                          ? 'bg-[#4ade80]/20 text-[#4ade80]'
                          : activeCard.box === 2
                          ? 'bg-[#ffe16d]/20 text-[#ffe16d]'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      صندوق {activeCard.box}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#a2a6d0]">
                    <RotateCw className="w-3.5 h-3.5 text-[#59dad1] animate-spin-slow" />
                    <span>انقر للقلب والكشف</span>
                  </div>
                </div>

                {/* Main Card Prompt */}
                <div className="text-center py-4">
                  <h3 className="font-serif text-xl sm:text-2xl font-black text-white leading-relaxed tracking-wide">
                    {activeCard.front}
                  </h3>
                  {showHint && (
                    <motion.p
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs text-[#ffe16d] bg-[#ffe16d]/10 py-1.5 px-3 rounded-xl inline-block border border-[#ffe16d]/30"
                    >
                      💡 تلميح: {activeCard.examHint}
                    </motion.p>
                  )}
                </div>

                {/* Footer tags */}
                <div className="flex items-center justify-between text-xs text-[#a2a6d0]">
                  <div className="flex flex-wrap gap-1.5">
                    {activeCard.tags.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a2a6d0]">
                        #{t}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowHint(!showHint);
                    }}
                    className="flex items-center gap-1 text-[11px] text-[#ffe16d] hover:underline cursor-pointer"
                  >
                    <Lightbulb className="w-3 h-3" />
                    {showHint ? 'إخفاء التلميح' : 'تلميح الامتحان'}
                  </button>
                </div>
              </div>

              {/* Back Side: Definition & Official Reference */}
              <div className="absolute inset-0 w-full h-full rounded-3xl atlas-glass p-8 border border-[#ffe16d]/40 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-[0_10px_35px_rgba(0,0,0,0.5)] bg-[#050a2e]">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[11px] font-bold text-[#ffe16d] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    الإجابة النموذجية المعتمدة (سلم التنقيط الوزاري)
                  </span>
                  <span className="text-[10px] text-[#59dad1] font-mono">مطابق 100%</span>
                </div>

                <div className="py-2 text-right">
                  <p className="text-sm sm:text-base text-white leading-relaxed font-sans">
                    {activeCard.back}
                  </p>
                  <div className="mt-3 p-2.5 rounded-xl bg-[#090f38] border border-[#ffe16d]/20 text-[11px] text-[#ffe16d]">
                    <strong>نصيحة المصحح في البكالوريا:</strong> {activeCard.examHint}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#a2a6d0]">
                  <span>انقر مرة أخرى للعودة للوجه الأول</span>
                  <RotateCw className="w-3.5 h-3.5 text-[#ffe16d]" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Decision Buttons (Mastered vs Repeat) */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => handleCardMastery(false)}
              className="flex-1 sm:flex-initial sm:min-w-[170px] py-3 px-5 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <X className="w-4 h-4" />
              لم أتذكرها (صندوق 1)
            </button>

            <button
              onClick={() => handleFlip()}
              className="py-3 px-4 rounded-2xl bg-[#090f38] hover:bg-[#121c54] border border-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4 text-[#59dad1]" />
              قلب البطاقة
            </button>

            <button
              onClick={() => handleCardMastery(true)}
              className="flex-1 sm:flex-initial sm:min-w-[170px] py-3 px-5 rounded-2xl bg-[#4ade80]/20 hover:bg-[#4ade80]/30 border border-[#4ade80]/50 text-[#4ade80] font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Check className="w-4 h-4" />
              تذكرتها بنجاح (+XP)
            </button>
          </div>
        </div>
      ) : (
        <div className="atlas-glass rounded-2xl p-12 text-center border border-white/10">
          <BookMarked className="w-12 h-12 text-[#59dad1] mx-auto mb-3 opacity-60" />
          <h4 className="text-sm font-bold text-white mb-1">لا توجد بطاقات في هذا التصنيف حالياً</h4>
          <p className="text-xs text-[#a2a6d0] mb-4">اختر تصنيفاً آخر أو قم بإعادة تعيين الفلاتر.</p>
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterBox('all');
              setFilterType('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#59dad1] text-[#080d3b] font-bold text-xs cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}
    </div>
  );
};
