import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Clock, 
  RotateCw, 
  Sliders, 
  CheckCircle, 
  Flame, 
  BookOpen, 
  Calendar, 
  Award,
  ChevronRight
} from 'lucide-react';
import { TaskCard } from './TaskCard';
import { DailyTask } from '../../types';

interface PlanGeneratorProps {
  tasks: DailyTask[];
  focusTheme: string;
  motivationalQuote: string;
  sourcesUsed: string[];
  isLoading: boolean;
  strictMode: boolean;
  onGeneratePlan: (customPrompt?: string, timeBudgetMinutes?: number) => void;
  onToggleTask: (taskId: string) => void;
  onToggleStrictMode: () => void;
}

export const PlanGenerator: React.FC<PlanGeneratorProps> = ({
  tasks,
  focusTheme,
  motivationalQuote,
  sourcesUsed,
  isLoading,
  strictMode,
  onGeneratePlan,
  onToggleTask,
  onToggleStrictMode,
}) => {
  const [selectedTimeBudget, setSelectedTimeBudget] = useState<number>(60);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalMinutes = tasks.reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0);
  const totalXp = tasks.reduce((sum, t) => sum + (t.xpReward || 0), 0);
  const earnedXp = tasks.filter((t) => t.completed).reduce((sum, t) => sum + (t.xpReward || 0), 0);

  const timeOptions = [
    { value: 30, label: '30 دقيقة', sub: 'استرجاع سريع ومصطلحات' },
    { value: 60, label: '60 دقيقة', sub: 'جلسة متوازنة (فهم + تطبيق)' },
    { value: 90, label: '90 دقيقة', sub: 'جلسة معمقة (درس + مقال)' },
    { value: 120, label: '120 دقيقة', sub: 'ماراثون بكالوريا شامل' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Time Budget Selector */}
      <div className="atlas-glass rounded-3xl p-5 sm:p-7 space-y-6 border border-amber-400/20 shadow-2xl">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-200 text-black shadow-lg shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  الموجه البيداغوجي والخطة اليومية الذكية
                </h2>
                {strictMode && (
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    المنهاج الصارم 2026
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#a2a6d0] mt-1">
                توزيع ذكي لمهام الحفظ والفهم والتدريب المنهجي في كتل زمنية (Time Blocks) مخصصة
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="px-3.5 py-2 rounded-xl bg-[#121743] hover:bg-[#1a215b] text-[#a2a6d0] hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>تخصيص الخطة</span>
            </button>

            <button
              disabled={isLoading}
              onClick={() => onGeneratePlan(customPrompt, selectedTimeBudget)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(251,191,36,0.3)] flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'جارٍ التوليد...' : 'توليد خطة اليوم'}</span>
            </button>
          </div>
        </div>

        {/* Time Budget Selector Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#dfe0ff]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>اختر وقت المذاكرة المتاح لديك اليوم:</span>
            </span>
            <span className="text-amber-300 font-mono">{selectedTimeBudget} دقيقة</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = selectedTimeBudget === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedTimeBudget(opt.value)}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                      : 'bg-[#090e2e]/70 hover:bg-[#121743] border-white/10 text-[#a2a6d0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black">{opt.label}</span>
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-transparent'}`} />
                  </div>
                  <p className="text-[10px] mt-1 text-[#a2a6d0] truncate">{opt.sub}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Topic Prompt */}
        {showOptions && (
          <div className="p-4 rounded-2xl bg-[#090d2e] border border-white/10 space-y-3 animate-fadeIn">
            <label className="text-xs font-bold text-[#dfe0ff] block">
              هل ترغب في التركيز على وحدة معينة اليوم؟ (مثال: هجومات الشمال القسنطيني، منظمة أوبك، الاتحاد الأوروبي)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="اكتب اسم الدرس أو المحور المطلوب هنا..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#05081f] border border-white/15 text-white text-xs placeholder:text-[#a2a6d0]/50 focus:outline-none focus:border-amber-400"
            />
          </div>
        )}

        {/* Motivational Quote & Focus */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#0e143c] border border-amber-400/20 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400/10 text-amber-300 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-xs sm:text-sm text-[#dfe0ff] italic leading-relaxed">
            {motivationalQuote || '«إن الثورة الجزائرية لم تكن معجزة، بل كانت ثمرة إرادة شعب وتخطيط محكم وعزيمة لا تلين»'}
          </p>
        </div>

        {/* Daily Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#080c29]/90 rounded-2xl p-4 border border-white/5">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <div>
              <p className="text-[10px] text-[#a2a6d0]">المهام المنجزة</p>
              <p className="text-xs sm:text-sm font-bold text-white font-mono">{completedCount} / {tasks.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-[#a2a6d0]">الزمن الإجمالي</p>
              <p className="text-xs sm:text-sm font-bold text-white font-mono">{totalMinutes} دقيقة</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Award className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-[#a2a6d0]">نقاط XP المكتسبة</p>
              <p className="text-xs sm:text-sm font-bold text-amber-300 font-mono">+{earnedXp} / {totalXp}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-[10px] text-[#a2a6d0]">المصدر المعتمد</p>
              <p className="text-[11px] font-bold text-[#dfe0ff] truncate">المنهاج الرسمي 2026</p>
            </div>
          </div>
        </div>

      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
            <span>الكتل الزمنية لليوم (Time Blocks)</span>
            <span className="text-xs text-amber-400 font-mono">({tasks.length} مهام)</span>
          </h3>
          <span className="text-xs text-[#a2a6d0]">اضغط على أي مهمة لوضع علامة الإنجاز</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={onToggleTask} />
          ))}
        </div>
      </div>

    </div>
  );
};
