import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart3, Calendar, Clock, Sparkles, Flame, CheckCircle, Brain } from 'lucide-react';
import { DayActivity } from '../../utils/analyticsTracker';

interface StudyActivityChartProps {
  days: DayActivity[];
  totalHours: number;
  currentStreak: number;
}

export const StudyActivityChart: React.FC<StudyActivityChartProps> = ({
  days,
  totalHours,
  currentStreak,
}) => {
  const [activeMetric, setActiveMetric] = useState<'hours' | 'xp' | 'tasks'>('hours');

  const maxHours = Math.max(...days.map((d) => d.hoursSpent), 3.0);
  const maxXP = Math.max(...days.map((d) => d.xpGained), 400);
  const maxTasks = Math.max(...days.map((d) => d.tasksDone), 8);

  const getBarHeight = (day: DayActivity) => {
    if (activeMetric === 'hours') return (day.hoursSpent / maxHours) * 100;
    if (activeMetric === 'xp') return (day.xpGained / maxXP) * 100;
    return (day.tasksDone / maxTasks) * 100;
  };

  const getBarLabel = (day: DayActivity) => {
    if (activeMetric === 'hours') return `${day.hoursSpent}h`;
    if (activeMetric === 'xp') return `+${day.xpGained}`;
    return `${day.tasksDone} مهمة`;
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-5 sm:p-6 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white">
              سجل النشاط وساعات المذاكرة (Weekly Activity Log)
            </h4>
            <p className="text-[11px] text-[#a2a6d0]">
              تتبع وتيرة الجهد اليومي، المهام المنجزة، وتراكم نقاط الخبرة
            </p>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#091338] border border-white/10 text-xs">
          <button
            onClick={() => setActiveMetric('hours')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeMetric === 'hours'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            الساعات (Hours)
          </button>
          <button
            onClick={() => setActiveMetric('tasks')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeMetric === 'tasks'
                ? 'bg-teal-500 text-stone-950 shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            المهام المنجزة
          </button>
          <button
            onClick={() => setActiveMetric('xp')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeMetric === 'xp'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            نقاط الخبرة (XP)
          </button>
        </div>
      </div>

      {/* KPI Mini Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/5 bg-[#091338]/60 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">إجمالي الساعات</span>
            <span className="font-mono text-sm font-black text-white">{totalHours} ساعة</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#091338]/60 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/15 text-orange-300">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">سلسلة الانضباط</span>
            <span className="font-mono text-sm font-black text-orange-300">{currentStreak} أيام متتالية</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#091338]/60 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">المهام المكتملة</span>
            <span className="font-mono text-sm font-black text-emerald-300">
              {days.reduce((acc, d) => acc + d.tasksDone, 0)} مهمة
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#091338]/60 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">معدل الاسترجاع</span>
            <span className="font-mono text-sm font-black text-indigo-300">89% نشط</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="rounded-2xl border border-white/5 bg-[#060b22] p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#a2a6d0] pb-2">
          <span>توزيع النشاط خلال الأيام السبعة الأخيرة:</span>
          <span className="font-mono text-[11px] text-teal-300">اليوم: {days[days.length - 1]?.dayName}</span>
        </div>

        <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-1">
          {days.map((day, idx) => {
            const heightPercent = Math.max(12, getBarHeight(day));
            const isToday = idx === days.length - 1;

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Floating Value Tooltip on top */}
                <span className="text-[10px] font-mono font-bold text-amber-300 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  {getBarLabel(day)}
                </span>

                {/* The Bar */}
                <div className="w-full max-w-[36px] bg-[#0c163b] rounded-xl overflow-hidden p-0.5 relative flex items-end h-full">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.08 }}
                    className={`w-full rounded-lg transition-all ${
                      isToday
                        ? 'bg-gradient-to-t from-amber-500 via-amber-400 to-teal-300 shadow-lg shadow-amber-500/20'
                        : 'bg-gradient-to-t from-indigo-600 to-[#59dad1]/80 hover:brightness-125'
                    }`}
                  />
                </div>

                {/* Day Label Below */}
                <span
                  className={`text-[11px] font-bold transition-all ${
                    isToday ? 'text-amber-300 font-extrabold' : 'text-[#a2a6d0]'
                  }`}
                >
                  {day.shortDay}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
