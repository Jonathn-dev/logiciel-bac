import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Printer,
  Download,
  Share2,
  Sparkles,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { StudentAnalyticsReport } from '../../utils/analyticsTracker';
import { UserStats } from '../../types';

interface DiagnosticReportCardProps {
  report: StudentAnalyticsReport;
  userStats: UserStats;
  onNavigateAction?: (route: string) => void;
}

export const DiagnosticReportCard: React.FC<DiagnosticReportCardProps> = ({
  report,
  userStats,
  onNavigateAction,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `📊 تقرير جاهزية البكالوريا 2026 - التاريخ والجغرافيا\nالطالب: ${userStats.name}\nمؤشر الجاهزية: ${report.overallReadiness}%\nالعلامة المتوقعة: ${report.predictedGrade}/20\nالمصطلحات المحفوظة: ${report.termsMastered}/${report.totalTerms}\nالتواريخ المتقنة: ${report.datesMastered}/${report.totalDates}\n#بكالوريا_2026 #أطلس_المعرفة`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* AI Smart Recommendations Box */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-[#0a1435] to-teal-500/10 p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                التوصيات الذكية لرفع المعدل إلى 16+ (AI Action Plan)
              </h4>
              <p className="text-[11px] text-[#a2a6d0]">
                خطة فورية موجهة لمعالجة الثغرات وحصد النقاط المضمونة
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {report.keyRecommendations.map((rec, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-[#091338]/80 p-4 flex flex-col justify-between gap-3 hover:border-amber-500/40 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.urgency === 'high'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {rec.urgency === 'high' ? 'أولوية قصوى' : 'أولوية موصى بها'}
                  </span>
                  <span className="text-[10px] text-[#a2a6d0] font-mono">0{i + 1}</span>
                </div>
                <h5 className="text-xs font-bold text-white">{rec.title}</h5>
                <p className="text-[11px] text-[#a2a6d0] leading-relaxed">{rec.description}</p>
              </div>

              {onNavigateAction && (
                <button
                  onClick={() => onNavigateAction(rec.actionRoute)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-amber-500 hover:text-stone-950 text-amber-300 text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{rec.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform -rotate-180" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official Diagnostic Summary Card */}
      <div
        id="bac-printable-report"
        className="rounded-3xl border border-white/15 bg-[#08102d] p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 print:bg-white print:text-black print:border-black"
      >
        {/* Card Official Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-black text-white font-serif">
                  بطاقة التشخيص المعرفي والجاهزية للبكالوريا
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
                  BAC 2026
                </span>
              </div>
              <p className="text-xs text-[#a2a6d0]">
                الجمهورية الجزائرية الديمقراطية الشعبية — مادة التاريخ والجغرافيا
              </p>
            </div>
          </div>

          {/* Action buttons (hidden on print) */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end print:hidden">
            <button
              onClick={handleShare}
              className="flex-1 sm:flex-initial p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#dfe0ff] border border-white/10 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-300" />
              <span>{copied ? 'تم النسخ!' : 'مشاركة'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الكشف</span>
            </button>
          </div>
        </div>

        {/* Student Bio Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#050a1e]/60 p-4 rounded-2xl border border-white/5 text-xs">
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">اسم الطالب المترشح</span>
            <span className="font-bold text-white text-sm">{userStats.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">المستوى والرتبة</span>
            <span className="font-bold text-amber-300 text-sm">{userStats.levelTitle}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">رصيد نقاط الخبرة</span>
            <span className="font-mono font-bold text-teal-300 text-sm">{userStats.totalXP} XP</span>
          </div>
          <div>
            <span className="text-[10px] text-[#a2a6d0] block">تاريخ الفحص والتحليل</span>
            <span className="font-mono text-white text-sm">{new Date().toLocaleDateString('ar-DZ')}</span>
          </div>
        </div>

        {/* Core Indicators Table */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">المصطلحات</span>
            <span className="font-mono text-base font-black text-amber-300">
              {report.termsMastered}/{report.totalTerms}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">التواريخ</span>
            <span className="font-mono text-base font-black text-teal-300">
              {report.datesMastered}/{report.totalDates}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">الخرائط</span>
            <span className="font-mono text-base font-black text-purple-300">
              {report.mapsMastered}/{report.totalMaps}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">المقالات المنهجية</span>
            <span className="font-mono text-base font-black text-emerald-300">
              {report.essaysWritten} مقالات
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">دقة الاختبارات</span>
            <span className="font-mono text-base font-black text-rose-300">
              {report.quizAccuracyPercentage}%
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#091338] border border-white/5 text-center">
            <span className="text-[10px] text-[#a2a6d0] block">ساعات المذاكرة</span>
            <span className="font-mono text-base font-black text-white">
              {report.totalStudyHours}h
            </span>
          </div>
        </div>

        {/* Footer Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/10 text-[11px] text-[#a2a6d0]">
          <span>معتمد وفق الإطار المرجعي الوزاري لشهادة البكالوريا — نظام Flash RAG 4D</span>
          <span className="font-mono text-amber-400 font-bold">كود الفحص: BAC2026-DIAG-{(userStats.totalXP * 7).toString(16).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
