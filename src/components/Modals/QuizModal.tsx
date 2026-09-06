import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  Trophy,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Swords,
  Timer,
  Heart,
  Volume2,
  VolumeX,
  HelpCircle,
  Clock,
  BookOpen,
  Flame,
  Award,
  ChevronRight,
  BookmarkPlus,
  Compass,
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  BAC_QUIZ_DATABASE,
  QuizArenaQuestion,
  AI_RIVALS,
  AIRival,
} from '../../data/quizArenaData';
import {
  playQuizSound,
  toggleQuizSoundMute,
  getQuizSoundMuted,
} from '../../utils/quizAudio';

type QuizMode = 'blitz' | 'rival' | 'unit_focus' | 'official_bac';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardXP: (xp: number) => void;
  initialMode?: QuizMode;
}

interface UserAnswerRecord {
  question: QuizArenaQuestion;
  selectedIdx: number;
  isCorrect: boolean;
  timeSpentSec: number;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onRewardXP,
  initialMode = 'blitz',
}) => {
  // Navigation & Mode
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'result'>('lobby');
  const [selectedMode, setSelectedMode] = useState<QuizMode>(initialMode);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<'all' | 'history' | 'geography'>('all');
  const [selectedRival, setSelectedRival] = useState<AIRival>(AI_RIVALS[0]);

  // Questions Queue
  const [questionQueue, setQuestionQueue] = useState<QuizArenaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);

  // Stats & Progress
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<UserAnswerRecord[]>([]);

  // AI Rival State
  const [rivalScore, setRivalScore] = useState(0);
  const [rivalDialogue, setRivalDialogue] = useState<string>('');

  // Audio state
  const [isMuted, setIsMuted] = useState(getQuizSoundMuted());

  // Toast / Feedback in Result
  const [savedNotesToast, setSavedNotesToast] = useState(false);

  // Lifelines availability
  const [lifeline5050Used, setLifeline5050Used] = useState(false);
  const [lifelineTimeUsed, setLifelineTimeUsed] = useState(false);
  const [lifelineHintUsed, setLifelineHintUsed] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Setup game on start
  const handleStartGame = (mode: QuizMode) => {
    setSelectedMode(mode);

    // Filter and shuffle questions
    let pool = [...BAC_QUIZ_DATABASE];
    if (selectedSubjectFilter !== 'all') {
      pool = pool.filter((q) => q.subject === selectedSubjectFilter);
    }
    if (mode === 'official_bac') {
      pool = pool.filter((q) => !!q.bacYear);
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const finalQuestions = shuffled.slice(0, mode === 'blitz' ? 10 : 8);

    setQuestionQueue(finalQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setEliminatedOptions([]);
    setHintRevealed(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setAnswersHistory([]);
    setRivalScore(0);
    setLifeline5050Used(false);
    setLifelineTimeUsed(false);
    setLifelineHintUsed(false);

    if (mode === 'rival') {
      setRivalDialogue(`مستعد يا بطل؟ لنرى من يحصد الدرجة النهائية في البكالوريا! 🎯`);
    }

    setGameState('playing');
    setTimeLeft(mode === 'blitz' ? 15 : 25);
    setIsTimerActive(true);
  };

  // Timer Tick Hook
  useEffect(() => {
    if (gameState !== 'playing' || !isTimerActive || isAnswered) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        if (prev <= 4) {
          playQuizSound('tick');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isTimerActive, isAnswered, currentIndex]);

  // When time expires on current question
  const handleTimeExpired = () => {
    if (isAnswered) return;
    setIsAnswered(true);
    playQuizSound('wrong');

    const currentQ = questionQueue[currentIndex];
    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedIdx: -1,
        isCorrect: false,
        timeSpentSec: selectedMode === 'blitz' ? 15 : 25,
      },
    ]);

    setCombo(0);

    if (selectedMode === 'blitz') {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => handleFinishGame(), 1500);
      }
    }

    if (selectedMode === 'rival') {
      // Rival answers
      if (Math.random() < selectedRival.accuracy) {
        setRivalScore((r) => r + 1);
        setRivalDialogue(
          selectedRival.dialogueSuccess[
            Math.floor(Math.random() * selectedRival.dialogueSuccess.length)
          ]
        );
      } else {
        setRivalDialogue(`سؤال دقيق جداً يحتاج تركيزاً!`);
      }
    }

    // Auto-advance to next question after 1.5 seconds if time expires
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    autoAdvanceRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 1500);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setIsAnswered(true);
    setIsTimerActive(false);
    setSelectedOption(idx);

    const currentQ = questionQueue[currentIndex];
    const isCorrect = idx === currentQ.correctIndex;
    const timeSpent = (selectedMode === 'blitz' ? 15 : 25) - timeLeft;

    // Record answer
    setAnswersHistory((prev) => [
      ...prev,
      {
        question: currentQ,
        selectedIdx: idx,
        isCorrect,
        timeSpentSec: Math.max(1, timeSpent),
      },
    ]);

    if (isCorrect) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setScore((s) => s + 1);

      if (newCombo >= 3) {
        playQuizSound('streak');
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.65 },
        });
      } else {
        playQuizSound('correct');
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.7 },
        });
      }
    } else {
      setCombo(0);
      playQuizSound('wrong');

      if (selectedMode === 'blitz') {
        const nextLives = lives - 1;
        setLives(nextLives);
        if (nextLives <= 0) {
          setTimeout(() => handleFinishGame(), 1500);
          return;
        }
      }
    }

    // AI Rival Simulation
    if (selectedMode === 'rival') {
      const rivalAnswersCorrectly = Math.random() < selectedRival.accuracy;
      if (rivalAnswersCorrectly) {
        setRivalScore((r) => r + 1);
        if (isCorrect) {
          setRivalDialogue(`أحسنت! إجابتنا معاً صحيحة، التنافس مشتعل! 🔥`);
        } else {
          setRivalDialogue(
            selectedRival.dialogueTaunt[
              Math.floor(Math.random() * selectedRival.dialogueTaunt.length)
            ]
          );
        }
      } else {
        if (isCorrect) {
          setRivalDialogue(`رائع! لقد تفوقت عليّ في هذا السؤال الصعب! 👏`);
        } else {
          setRivalDialogue(`يبدو أن هذا السؤال كان فخاً لنا معاً!`);
        }
      }
    }

    // Auto-advance to next question after 1.5 seconds
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

    if (currentIndex < questionQueue.length - 1 && lives > 0) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setEliminatedOptions([]);
      setHintRevealed(false);
      setTimeLeft(selectedMode === 'blitz' ? 15 : 25);
      setIsTimerActive(true);
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = () => {
    setGameState('result');
    setIsTimerActive(false);

    // Calculate XP
    const baseXP = score * 50;
    const comboBonus = maxCombo * 20;
    const survivalBonus = selectedMode === 'blitz' && lives > 0 ? lives * 30 : 0;
    const victoryBonus = selectedMode === 'rival' && score >= rivalScore ? 100 : 0;
    const totalAwarded = baseXP + comboBonus + survivalBonus + victoryBonus;

    onRewardXP(totalAwarded);
    playQuizSound('victory');

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  // Lifelines Handlers
  const handleUse5050 = () => {
    if (lifeline5050Used || isAnswered) return;
    setLifeline5050Used(true);
    playQuizSound('lifeline');

    const currentQ = questionQueue[currentIndex];
    const wrongIndices = currentQ.options
      .map((_, i) => i)
      .filter((i) => i !== currentQ.correctIndex);
    const shuffledWrong = wrongIndices.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffledWrong.slice(0, 2));
  };

  const handleUseTimeLifeline = () => {
    if (lifelineTimeUsed || isAnswered) return;
    setLifelineTimeUsed(true);
    playQuizSound('lifeline');
    setTimeLeft((t) => t + 15);
  };

  const handleUseHintLifeline = () => {
    if (lifelineHintUsed || isAnswered) return;
    setLifelineHintUsed(true);
    setHintRevealed(true);
    playQuizSound('lifeline');
  };

  const toggleSound = () => {
    const muted = toggleQuizSoundMute();
    setIsMuted(muted);
  };

  const handleSaveMistakesToNotes = () => {
    setSavedNotesToast(true);
    setTimeout(() => setSavedNotesToast(false), 3500);
  };

  if (!isOpen) return null;

  const currentQ = questionQueue[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#080d28] text-white shadow-2xl overflow-hidden relative"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#05081c]/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-[#080d3b] shadow-lg shadow-amber-500/20">
              <Swords className="h-5 w-5 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ساحة التحدي: معركة البكالوريا ⚔️
                </h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
                  BAC QUIZ ARENA
                </span>
              </div>
              <p className="text-xs text-[#a2a6d0]">
                اختبر جاهزيتك واكسب نقاط خبرة مضاعفة وسلاسل إتقان
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-[#dfe0ff] hover:bg-white/10 hover:text-white transition-all cursor-pointer"
              title={isMuted ? 'تفعيل المؤثرات الصوتية' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-[#dfe0ff] hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------
            VIEW 1: LOBBY & MODE SELECTION
        ------------------------------------------------------------- */}
        {gameState === 'lobby' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            {/* Subject Selector Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-[#ffe16d]" />
                <span className="text-xs font-bold text-[#dfe0ff]">اختر نطاق المادة:</span>
              </div>
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                {(
                  [
                    { id: 'all', label: 'كل المنهج (تاريخ + جغرافيا)' },
                    { id: 'history', label: 'التاريخ فقط 📜' },
                    { id: 'geography', label: 'الجغرافيا فقط 🌍' },
                  ] as const
                ).map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubjectFilter(sub.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSubjectFilter === sub.id
                        ? 'bg-[#ffe16d] text-[#3a3000] shadow-md shadow-[#ffe16d]/20 font-black'
                        : 'text-[#a2a6d0] hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Modes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mode 1: Blitz Survival */}
              <div
                onClick={() => handleStartGame('blitz')}
                className="group relative p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#121438] to-[#1c1836] hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/15 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Zap className="h-6 w-6" />
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      <Flame className="h-3 w-3" /> مضاعف الكومبو x3
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                    ⚡ تحدي السرعة والبقاء (Survival Blitz)
                  </h4>
                  <p className="mt-2 text-xs text-[#a2a6d0] leading-relaxed">
                    15 ثانية لكل سؤال، 3 قلوب حياة ❤️، وسلسلة مضاعفات XP عند توالي الإجابات الصحيحة بدون أخطاء.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-amber-400">
                  <span>10 أسئلة سريعة • +500 XP</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>انطلق الآن</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Mode 2: AI Rival Match */}
              <div
                onClick={() => handleStartGame('rival')}
                className="group relative p-6 rounded-3xl border border-[#59dad1]/30 bg-gradient-to-br from-[#0c1a30] to-[#11233d] hover:border-[#59dad1] hover:shadow-xl hover:shadow-[#59dad1]/15 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#59dad1]/10 rounded-full blur-3xl group-hover:bg-[#59dad1]/20 transition-all pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
                      <Swords className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#59dad1]/10 text-[#59dad1] border border-[#59dad1]/20">
                      مواجهة مباشرة 1 VS 1
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-[#59dad1] transition-colors">
                    ⚔️ مبارزة المنافس الذكي (AI Rival Match)
                  </h4>
                  <p className="mt-2 text-xs text-[#a2a6d0] leading-relaxed">
                    نافس خصماً افتراضياً ذكياً (مرشح الامتياز أو الأستاذ المفتش) في الزمن الحي واكسب مكافأة الفوز بالصدارة.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-[#59dad1]">
                  <span>8 جولات حماسية • مكافأة تفوق</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>تحدي الخصم</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Mode 3: Official Past Bac Questions */}
              <div
                onClick={() => handleStartGame('official_bac')}
                className="group relative p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0c221e] to-[#12312b] hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/15 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                      <Award className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/20">
                      مواضيع 2018 - 2024
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                    🎓 بنك أسئلة البكالوريات السابقة (Official Archive)
                  </h4>
                  <p className="mt-2 text-xs text-[#a2a6d0] leading-relaxed">
                    أسئلة حقيقية مقتبسة حرفياً من مواضيع امتحانات البكالوريا الرسمية السابقة مع تفريغ سلم التصحيح.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-emerald-400">
                  <span>تدريب وزاري خالص</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>خوض الامتحان</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {/* Mode 4: Custom Unit Mastery */}
              <div
                onClick={() => handleStartGame('unit_focus')}
                className="group relative p-6 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-[#151238] to-[#201c4a] hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/15 transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-indigo-400/10 text-indigo-300 border border-indigo-400/20">
                      مراجعة بيداغوجية
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white group-hover:text-indigo-300 transition-colors">
                    📚 التثبيت المنهجي للوحدات (Unit Mastery)
                  </h4>
                  <p className="mt-2 text-xs text-[#a2a6d0] leading-relaxed">
                    مراجعة متأنية بدون ضغط زمني عالي مع شروحات بيداغوجية مستفيضة لكل مصطلح وسند.
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-indigo-400">
                  <span>تثبيت المفاهيم والمصطلحات</span>
                  <div className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>بدء المراجعة</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Rival Chooser (if Rival mode) */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{selectedRival.avatar}</span>
                <div>
                  <h5 className="text-xs font-black text-white">الخصم الافتراضي المختار: {selectedRival.name}</h5>
                  <p className="text-[11px] text-[#a2a6d0]">{selectedRival.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {AI_RIVALS.map((rival) => (
                  <button
                    key={rival.id}
                    onClick={() => setSelectedRival(rival)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedRival.id === rival.id
                        ? 'bg-[#59dad1] text-[#080d3b] font-black'
                        : 'bg-white/5 text-[#a2a6d0] hover:bg-white/10'
                    }`}
                  >
                    <span>{rival.avatar}</span>
                    <span>{rival.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 2: ACTIVE GAMEPLAY
        ------------------------------------------------------------- */}
        {gameState === 'playing' && currentQ && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-8 space-y-5">
            {/* Top Game HUD */}
            <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-white/10">
              {/* Question Index & Unit Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-xl bg-white/10 text-xs font-black text-white">
                  السؤال {currentIndex + 1} / {questionQueue.length}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30 text-xs font-bold">
                  {currentQ.unit}
                </span>
                {currentQ.bacYear && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black">
                    {currentQ.bacYear}
                  </span>
                )}
              </div>

              {/* Status Indicators (Combo, Lives, Timer, Score) */}
              <div className="flex items-center gap-3">
                {/* Combo Badge */}
                {combo > 1 && (
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black shadow-md shadow-amber-500/20 animate-pulse"
                  >
                    <Flame className="h-3.5 w-3.5 fill-white" />
                    <span>سلسلة x{combo}</span>
                  </motion.div>
                )}

                {/* Lives (Survival Mode) */}
                {selectedMode === 'blitz' && (
                  <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
                    {[1, 2, 3].map((heartIdx) => (
                      <Heart
                        key={heartIdx}
                        className={`h-4 w-4 ${
                          heartIdx <= lives
                            ? 'text-rose-500 fill-rose-500'
                            : 'text-stone-600'
                        } transition-colors`}
                      />
                    ))}
                  </div>
                )}

                {/* Animated Timer */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-black border transition-colors ${
                    timeLeft <= 4
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-white/5 text-[#ffe16d] border-white/10'
                  }`}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            </div>

            {/* AI Rival Live Banner (If in Rival Mode) */}
            {selectedMode === 'rival' && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0d1e38] to-[#122849] border border-[#59dad1]/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{selectedRival.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">{selectedRival.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#59dad1]/20 text-[#59dad1] font-bold">
                        نقاط الخصم: {rivalScore}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold">
                        نقاطك: {score}
                      </span>
                    </div>
                    {rivalDialogue && (
                      <p className="text-[11px] text-[#dfe0ff] mt-0.5 italic">"{rivalDialogue}"</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Lifelines Bar */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-bold text-[#a2a6d0] hidden sm:inline">
                أدوات المساعدة التكتيكية:
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={lifeline5050Used || isAnswered}
                  onClick={handleUse5050}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    lifeline5050Used
                      ? 'opacity-40 bg-white/5 text-stone-500 cursor-not-allowed'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30'
                  }`}
                  title="حذف إجابتين خاطئتين"
                >
                  <span>💡 50:50</span>
                  {lifeline5050Used && <Check className="h-3 w-3 text-stone-500" />}
                </button>

                <button
                  disabled={lifelineTimeUsed || isAnswered}
                  onClick={handleUseTimeLifeline}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    lifelineTimeUsed
                      ? 'opacity-40 bg-white/5 text-stone-500 cursor-not-allowed'
                      : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-400/30'
                  }`}
                  title="إضافة 15 ثانية إضافية"
                >
                  <span>⏳ +15 ثانية</span>
                  {lifelineTimeUsed && <Check className="h-3 w-3 text-stone-500" />}
                </button>

                <button
                  disabled={lifelineHintUsed || isAnswered}
                  onClick={handleUseHintLifeline}
                  className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                    lifelineHintUsed
                      ? 'opacity-40 bg-white/5 text-stone-500 cursor-not-allowed'
                      : 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/30 hover:bg-indigo-400/30'
                  }`}
                  title="كشف تلميح منهجي وزاري"
                >
                  <span>📜 تلميح البكالوريا</span>
                  {lifelineHintUsed && <Check className="h-3 w-3 text-stone-500" />}
                </button>
              </div>
            </div>

            {/* Revealed Hint Box */}
            {hintRevealed && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                <span><strong>تلميح المصحح:</strong> {currentQ.examTip}</span>
              </motion.div>
            )}

            {/* Question Text */}
            <div className="p-5 rounded-3xl bg-white/5 border border-white/10 shadow-inner">
              <h4 className="text-base sm:text-xl font-black text-white leading-relaxed text-right">
                {currentQ.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentQ.options.map((option, idx) => {
                const isEliminated = eliminatedOptions.includes(idx);
                let btnStyle =
                  'border-white/10 bg-[#0d1233] text-[#dfe0ff] hover:border-[#ffe16d]/50 hover:bg-[#121946]';

                if (isEliminated) {
                  btnStyle = 'opacity-25 border-white/5 bg-black/20 text-stone-600 pointer-events-none line-through';
                } else if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    btnStyle =
                      'border-emerald-500 bg-emerald-950/60 text-emerald-200 shadow-lg shadow-emerald-500/20';
                  } else if (idx === selectedOption) {
                    btnStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
                  } else {
                    btnStyle = 'border-white/5 bg-white/5 text-stone-500 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered || isEliminated}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-2xl border text-right text-xs sm:text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="leading-relaxed">{option}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mr-2" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <XCircle className="h-5 w-5 text-rose-400 shrink-0 mr-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Official Guidance */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-[#0a1f28] to-[#0c2a36] border border-[#59dad1]/30 text-xs space-y-2 text-right"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#59dad1] font-black">
                    <ShieldCheck className="h-4 w-4" />
                    <span>التعليل البيداغوجي المعتمد في البكالوريا:</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#59dad1]/20 text-[#59dad1]">
                    سلم التنقيط الوزاري
                  </span>
                </div>
                <p className="text-[#dfe0ff] leading-relaxed">{currentQ.explanation}</p>
                <div className="pt-2 border-t border-white/10 text-amber-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>نصيحة الامتحان: {currentQ.examTip}</span>
                </div>
              </motion.div>
            )}

            {/* Next Question / Finish Action */}
            {isAnswered && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: 'linear' }}
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400"
                  />
                </div>
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-stone-950 font-black text-xs sm:text-sm hover:brightness-110 shadow-lg shadow-amber-400/25 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>
                    {currentIndex < questionQueue.length - 1 && lives > 0
                      ? 'الانتقال التلقائي (أو اضغط للمتابعة الفورية ⚡)'
                      : 'عرض التقرير النهائي والنقاط 🏆'}
                  </span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------
            VIEW 3: RESULTS & PERFORMANCE BREAKDOWN
        ------------------------------------------------------------- */}
        {gameState === 'result' && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-center">
            {/* Header Trophy & Result Title */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xl shadow-amber-500/20">
                <Trophy className="h-10 w-10 animate-bounce" />
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-white">
                {score >= questionQueue.length * 0.75
                  ? 'أداء بطولي استثنائي! 🎖️'
                  : score >= questionQueue.length * 0.5
                  ? 'نتيجة جيدة ومراجعة مثمرة! 👏'
                  : 'بداية ممتازة، كرر المحاولة لتثبيت الحفظ! 💪'}
              </h4>
              <p className="text-xs sm:text-sm text-[#a2a6d0]">
                أحرزت <strong className="text-amber-400 font-black">{score}</strong> إجابات صحيحة من أصل{' '}
                <strong className="text-white">{questionQueue.length}</strong> أسئلة
              </p>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[11px] text-[#a2a6d0]">نسبة الدقة</p>
                <p className="text-lg font-black text-emerald-400 mt-1">
                  {Math.round((score / Math.max(1, questionQueue.length)) * 100)}%
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[11px] text-[#a2a6d0]">أعلى سلسلة (Combo)</p>
                <p className="text-lg font-black text-amber-400 mt-1">x{maxCombo}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[11px] text-[#a2a6d0]">نقاط XP المكتسبة</p>
                <p className="text-lg font-black text-[#59dad1] mt-1">
                  +{score * 50 + maxCombo * 20} XP
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-[11px] text-[#a2a6d0]">النمط</p>
                <p className="text-xs font-black text-indigo-300 mt-1">
                  {selectedMode === 'blitz'
                    ? '⚡ السرعة والبقاء'
                    : selectedMode === 'rival'
                    ? '⚔️ مبارزة الذكاء'
                    : selectedMode === 'official_bac'
                    ? '🎓 أرشيف البكالوريا'
                    : '📚 تثبيت المفاهيم'}
                </p>
              </div>
            </div>

            {/* Detailed Question Review List */}
            <div className="text-right space-y-3 pt-4 border-t border-white/10">
              <h5 className="text-sm font-black text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#ffe16d]" />
                <span>مراجعة وتصحيح الأسئلة النموذجية:</span>
              </h5>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {answersHistory.map((rec, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-2xl border text-xs text-right space-y-1.5 ${
                      rec.isCorrect
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-rose-500/30 bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white">
                        {i + 1}. {rec.question.question}
                      </span>
                      {rec.isCorrect ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> صحيحة (+50 XP)
                        </span>
                      ) : (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="h-4 w-4" /> إجابة خاطئة
                        </span>
                      )}
                    </div>
                    <div className="text-[#a2a6d0]">
                      <strong>الإجابة الصحيحة المعتمدة:</strong>{' '}
                      <span className="text-emerald-300 font-bold">
                        {rec.question.options[rec.question.correctIndex]}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#dfe0ff] italic">
                      {rec.question.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved to Notes Toast */}
            {savedNotesToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold"
              >
                ✅ تم حفظ الأسئلة المستعصية وتلميحاتها في المفكرة السحرية للمراجعة لاحقاً!
              </motion.div>
            )}

            {/* Bottom Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setGameState('lobby')}
                className="px-5 py-3 rounded-2xl border border-white/10 bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-all cursor-pointer flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                <span>خوض تحدٍ آخر</span>
              </button>

              <button
                onClick={handleSaveMistakesToNotes}
                className="px-5 py-3 rounded-2xl border border-[#59dad1]/40 bg-[#59dad1]/10 text-xs font-bold text-[#59dad1] hover:bg-[#59dad1]/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <BookmarkPlus className="h-4 w-4" />
                <span>حفظ الأخطاء في المفكرة</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3 rounded-2xl bg-amber-400 text-stone-950 text-xs font-black hover:brightness-110 shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                إنهاء والعودة للوحة التحكم
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
