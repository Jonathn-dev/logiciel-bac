import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Award, ArrowUpRight, Check, AlertCircle } from 'lucide-react';
import { ComprehensiveGapReport } from '../../types';

interface GapReportProps {
  report: ComprehensiveGapReport;
  onExportReport?: () => void;
  onOpenLearningSpace?: () => void;
}

export const GapReport: React.FC<GapReportProps> = ({
  report,
  onExportReport,
  onOpenLearningSpace,
}) => {
  const isOptimal = report.status === 'optimal';
  const isModerate = report.status === 'moderate_gaps';

  const badgeColor = isOptimal
    ? 'text-[#4ade80] bg-[#4ade80]/15 border-[#4ade80]/30'
    : isModerate
    ? 'text-[#ffe16d] bg-[#ffe16d]/15 border-[#ffe16d]/30'
    : 'text-rose-400 bg-rose-500/15 border-rose-500/30';

  const verdictLabel =
    report.strictModeVerdict === 'PASS_OFFICIAL'
      ? 'مطابق رسمياً للإطار المرجعي (Pass)'
      : report.strictModeVerdict === 'REQUIRES_REVISION'
      ? 'يتطلب مراجعة واستدراك ثغرات (Revision Needed)'
      : 'غير مكتمل - يحتاج لإعادة تحضير (Incomplete)';

  return (
    <div className="atlas-glass rounded-2xl p-6 border border-[#ffe16d]/25 space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
              isOptimal
                ? 'bg-[#4ade80]/20 text-[#4ade80] border-[#4ade80]/40'
                : 'bg-[#ffe16d]/20 text-[#ffe16d] border-[#ffe16d]/40'
            }`}
          >
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-white">
                تقرير المطابقة والجاهزية للبكالوريا
              </h4>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                {report.overallScore}%
              </span>
            </div>
            <p className="text-xs text-[#a2a6d0] mt-0.5">{report.summary}</p>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-2">
          {report.strictModeVerdict === 'PASS_OFFICIAL' ? (
            <ShieldCheck className="w-5 h-5 text-[#4ade80]" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-[#ffe16d]" />
          )}
          <span className="text-xs font-bold text-white">{verdictLabel}</span>
        </div>
      </div>

      {/* Stats counter strip */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-[#090f38] border border-white/5 text-center">
          <span className="text-[10px] text-[#a2a6d0] block">المفاهيم المطابقة</span>
          <span className="text-lg font-mono font-bold text-[#4ade80]">
            {report.matchedCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#090f38] border border-white/5 text-center">
          <span className="text-[10px] text-[#a2a6d0] block">الثغرات المرصودة</span>
          <span className="text-lg font-mono font-bold text-rose-400">
            {report.missingCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#090f38] border border-white/5 text-center">
          <span className="text-[10px] text-[#a2a6d0] block">درجة الجاهزية</span>
          <span className="text-lg font-mono font-bold text-[#59dad1]">
            {report.overallScore >= 80 ? 'ممتاز A' : report.overallScore >= 50 ? 'متوسط B' : 'بحاجة دعم C'}
          </span>
        </div>
      </div>

      {/* Recommendations List */}
      <div>
        <h5 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-[#59dad1]" />
          التوصيات البيداغوجية للاستدراك الفوري:
        </h5>
        <div className="space-y-2">
          {report.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-lg bg-[#0b123d] border border-white/5 text-xs text-[#dfe0ff] flex items-start gap-2"
            >
              <span className="w-4 h-4 rounded-full bg-[#59dad1]/20 text-[#59dad1] text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-white/10">
        {onOpenLearningSpace && (
          <button
            onClick={onOpenLearningSpace}
            className="px-4 py-2 rounded-xl bg-[#ffe16d] hover:bg-[#ffe16d]/90 text-[#3a3000] font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,225,109,0.3)] transition-all cursor-pointer"
          >
            الانتقال لفضاء الدروس للمراجعة
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
