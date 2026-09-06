import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3,
  X,
  Sparkles,
  Award,
  Layers,
  Calendar,
  FileText,
  TrendingUp,
  RefreshCw,
  Compass,
  ArrowRight,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { UserStats } from '../../types';
import { getStudentAnalytics, StudentAnalyticsReport } from '../../utils/analyticsTracker';
import { ReadinessGauge } from './ReadinessGauge';
import { DimensionRadar } from './DimensionRadar';
import { StudyActivityChart } from './StudyActivityChart';
import { UnitMasteryGrid } from './UnitMasteryGrid';
import { DiagnosticReportCard } from './DiagnosticReportCard';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onNavigateToTool?: (route: string) => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onNavigateToTool,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'activity' | 'simulator' | 'report'>('overview');

  // Simulator state
  const [simTerms, setSimTerms] = useState<number>(0);
  const [simDates, setSimDates] = useState<number>(0);
  const [simEssay, setSimEssay] = useState<number>(0);

  // Compute live analytics from user stats
  const analytics: StudentAnalyticsReport = useMemo(() => {
    return getStudentAnalytics(userStats);
  }, [userStats]);

  if (!isOpen) return null;

  // Simulated Grade calculation
  const simPredictedGrade = Math.min(
    20,
    parseFloat(
      (
        analytics.predictedGrade +
        (simTerms / 180) * 2.5 +
        (simDates / 75) * 1.8 +
        (simEssay / 4) * 2.0
      ).toFixed(1)
    )
  );

  const handleActionClick = (route: string) => {
    onClose();
    if (onNavigateToTool) {
      onNavigateToTool(route);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl border border-white/10 bg-[#04081c] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden text-[#dfe0ff]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-[#070e28]/90 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-teal-500/20 border border-amber-500/30 text-amber-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-serif">
                  لوحة التحليلات والتتبع الذكي (Analytics Hub)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  مؤشر البكالوريا
                </span>
              </div>
              <p className="text-xs text-[#a2a6d0]">
                تقييم شامل لمستوى الجاهزية، كشف الثغرات المعرفية، وتوقعات علامة التاريخ والجغرافيا
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a2a6d0] hover:text-white transition-all cursor-pointer border border-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex items-center gap-2 px-5 sm:px-7 py-2.5 bg-[#060b22] border-b border-white/5 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>النظرة الشاملة والجاهزية</span>
          </button>

          <button
            onClick={() => setActiveTab('units')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'units'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>استيعاب الوحدات (Unit Mastery)</span>
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>سجل الساعات والنشاط</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>محاكي رفع المعدل (Simulator)</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'report'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>كشف الجاهزية والتوصيات</span>
          </button>
        </div>

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <ReadinessGauge
                score={analytics.overallReadiness}
                predictedGrade={analytics.predictedGrade}
                confidenceLevel={analytics.confidenceLevel}
                historyGrade={analytics.predictedGradeHistory}
                geoGrade={analytics.predictedGradeGeography}
              />

              <DimensionRadar
                dimensions={analytics.dimensions}
                onActionClick={handleActionClick}
              />

              <StudyActivityChart
                days={analytics.recentDaysActivity}
                totalHours={analytics.totalStudyHours}
                currentStreak={analytics.currentStreak}
              />
            </div>
          )}

          {/* TAB 2: UNIT MASTERY */}
          {activeTab === 'units' && (
            <UnitMasteryGrid
              units={analytics.units}
              onOpenUnitStudy={(unitId) => {
                handleActionClick('learning_space');
              }}
            />
          )}

          {/* TAB 3: ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <StudyActivityChart
                days={analytics.recentDaysActivity}
                totalHours={analytics.totalStudyHours}
                currentStreak={analytics.currentStreak}
              />

              {/* Weekly Details Table */}
              <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-black text-white">
                    جدول الإنجاز اليومي المفصل
                  </h4>
                  <span className="text-[10px] text-[#a2a6d0] font-mono">آخر 7 أيام</span>
                </div>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-xs text-right border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/10 text-[#a2a6d0]">
                        <th className="py-2.5 px-3">اليوم والتاريخ</th>
                        <th className="py-2.5 px-3">ساعات التركيز</th>
                        <th className="py-2.5 px-3">المهام المنجزة</th>
                        <th className="py-2.5 px-3">اختبارات السرعة</th>
                        <th className="py-2.5 px-3">الخبرة المكتسبة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[#dfe0ff]">
                      {analytics.recentDaysActivity.map((day) => (
                        <tr key={day.date} className="hover:bg-white/5 transition-all">
                          <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                            <span>{day.dayName}</span>
                            <span className="text-[10px] text-[#a2a6d0] font-mono">({day.date})</span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-amber-300 font-bold">
                            {day.hoursSpent} ساعة
                          </td>
                          <td className="py-2.5 px-3 font-mono text-teal-300">
                            {day.tasksDone} مهام
                          </td>
                          <td className="py-2.5 px-3 font-mono text-rose-300">
                            {day.quizzesTaken} اختبارات
                          </td>
                          <td className="py-2.5 px-3 font-mono text-indigo-300 font-bold">
                            +{day.xpGained} XP
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SCORE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-4 sm:p-7 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white">
                      محاكي رفع معدل البكالوريا التفاعلي (BAC Score Simulator)
                    </h4>
                    <p className="text-xs text-[#a2a6d0]">
                      جرّب زيادة حصيلتك في المصطلحات والتواريخ والمقال لمعرفة القفزة المتوقعة في علامتك
                    </p>
                  </div>
                </div>

                <div className="text-right sm:text-left self-end sm:self-auto bg-amber-500/10 sm:bg-transparent p-2 sm:p-0 rounded-xl border border-amber-500/20 sm:border-0">
                  <span className="text-[10px] text-[#a2a6d0] block">العلامة المحاكية المتوقعة</span>
                  <span className="font-mono text-2xl sm:text-3xl font-black text-amber-400">
                    {simPredictedGrade} <span className="text-xs text-[#a2a6d0]">/ 20</span>
                  </span>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="space-y-6">
                {/* Terms Slider */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#091338] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">إضافة مصطلحات ومفاهيم جديدة للحفظ:</span>
                    <span className="text-amber-300 font-mono">+{simTerms} مصطلح إضافي</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={simTerms}
                    onChange={(e) => setSimTerms(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#a2a6d0]">
                    <span>0</span>
                    <span>+30 مصطلح</span>
                    <span>+60 مصطلح (+2.5 نقطة)</span>
                  </div>
                </div>

                {/* Dates Slider */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#091338] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">تثبيت معالم وتواريخ كرونولوجية إضافية:</span>
                    <span className="text-teal-300 font-mono">+{simDates} تاريخ معلَم</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={simDates}
                    onChange={(e) => setSimDates(parseInt(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#a2a6d0]">
                    <span>0</span>
                    <span>+15 تاريخ</span>
                    <span>+30 تاريخ (+1.8 نقطة)</span>
                  </div>
                </div>

                {/* Essay Score Slider */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#091338] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-white">تحسين علامة المقال المنهجي (المقدمة والعرض والخاتمة):</span>
                    <span className="text-emerald-300 font-mono">+{simEssay.toFixed(1)} درجة في المقال</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={simEssay}
                    onChange={(e) => setSimEssay(parseFloat(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#a2a6d0]">
                    <span>0</span>
                    <span>+0.75 درجة</span>
                    <span>+1.5 درجة (+2.0 نقاط في المجموع)</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Callout */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <p className="text-xs text-[#dfe0ff]">
                    عند إتقان هذه العناصر الإضافية، سيرتفع معدلك التقديري من{' '}
                    <strong className="text-white">{analytics.predictedGrade}</strong> إلى{' '}
                    <strong className="text-amber-400 text-sm">{simPredictedGrade}/20</strong> مع زيادة نسبة نجاحك إلى{' '}
                    <strong className="text-teal-300">96%</strong>.
                  </p>
                </div>

                <button
                  onClick={() => handleActionClick('terms')}
                  className="py-2 px-4 rounded-xl bg-amber-500 text-stone-950 font-black text-xs hover:brightness-110 transition-all shrink-0 cursor-pointer"
                >
                  بدء خطة التعزيز 🚀
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: OFFICIAL DIAGNOSTIC REPORT CARD */}
          {activeTab === 'report' && (
            <DiagnosticReportCard
              report={analytics}
              userStats={userStats}
              onNavigateAction={handleActionClick}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};
