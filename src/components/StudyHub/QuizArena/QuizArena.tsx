import React, { useState, useEffect } from 'react';
import { Flame, CheckCircle, XCircle, Clock, Trophy, RotateCcw, ArrowLeft, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BAC_QUIZZES } from '../../../data/bacCurriculum';
import { QuizQuestion } from '../../../types';

interface QuizArenaProps {
  onEarnXp: (amount: number) => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({ onEarnXp }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ: QuizQuestion = BAC_QUIZZES[currentIndex] || BAC_QUIZZES[0];

  // 15-second countdown timer per question
  useEffect(() => {
    if (isAnswered || isFinished) return;

    if (timeLeft <= 0) {
      handleSelectOption(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished]);

  const handleSelectOption = (optIndex: number) => {
    if (isAnswered) return;

    setSelectedOption(optIndex);
    setIsAnswered(true);

    const isCorrect = optIndex === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      onEarnXp(25);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < BAC_QUIZZES.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onEarnXp(50);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(15);
    setIsFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-amber-400/20 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-950/40 border border-orange-500/30 text-orange-400">
            <Flame className="w-6 h-6 fill-orange-400" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">حلبة الاختبارات السريعة (Quiz Arena)</h2>
            <p className="text-xs text-[#a2a6d0]">15 ثانية لكل سؤال • أسئلة مفصلية من مواضيع البكالوريا الرسمية</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 font-mono">
            {currentIndex + 1} / {BAC_QUIZZES.length}
          </span>
        </div>
      </div>

      {!isFinished ? (
        <div className="atlas-glass rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 shadow-2xl">
          
          {/* Timer and Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#a2a6d0]">{currentQ.curriculumChapter}</span>
              <div className="flex items-center gap-1.5 text-amber-300 font-mono">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{timeLeft} ثانية</span>
              </div>
            </div>

            <div className="w-full h-2 rounded-full bg-[#080c2b] overflow-hidden">
              <div
                style={{ width: `${(timeLeft / 15) * 100}%` }}
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-amber-200'
                }`}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2">
            <h3 className="text-base sm:text-lg font-black text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let optionStyle = 'bg-[#090e2f]/80 hover:bg-[#12194d] border-white/10 text-white';

              if (isAnswered) {
                if (isCorrect) {
                  optionStyle = 'bg-green-950/40 border-green-500 text-green-200 font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)]';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-red-950/40 border-red-500 text-red-200';
                } else {
                  optionStyle = 'bg-[#080d29]/40 border-white/5 text-[#a2a6d0] opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                >
                  <span className="text-xs sm:text-sm font-medium">{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Pedagogical Explanation */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-[#090d2e] border border-amber-400/20 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span>الشرح البيداغوجي المعتمد:</span>
              </div>
              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentIndex + 1 < BAC_QUIZZES.length ? 'السؤال التالي' : 'عرض النتيجة النهائية'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results Screen */
        <div className="atlas-glass rounded-3xl p-8 sm:p-10 border border-amber-400/30 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400">
            <Trophy className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">أحسنت يا بطل! أنهيت الاختبار بنجاح</h3>
            <p className="text-xs sm:text-sm text-[#a2a6d0] mt-1">الاستمرار اليومي في الاختبارات يثبت المعلومات في الذاكرة طويلة المدى</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <div className="px-5 py-3 rounded-2xl bg-[#090d2e] border border-white/10">
              <p className="text-xs text-[#a2a6d0]">الإجابات الصحيحة</p>
              <p className="text-lg font-black text-amber-300 font-mono">{score} / {BAC_QUIZZES.length}</p>
            </div>

            <div className="px-5 py-3 rounded-2xl bg-[#090d2e] border border-white/10">
              <p className="text-xs text-[#a2a6d0]">النقاط المكتسبة</p>
              <p className="text-lg font-black text-amber-300 font-mono">+{score * 25 + 50} XP</p>
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-300 text-black font-black text-xs sm:text-sm flex items-center gap-2 mx-auto cursor-pointer shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة الاختبار</span>
          </button>
        </div>
      )}

    </div>
  );
};
