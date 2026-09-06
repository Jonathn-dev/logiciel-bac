import React from 'react';
import { motion } from 'motion/react';
import { Trophy, TrendingUp, Sparkles, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReadinessGaugeProps {
  score: number; // 0 to 100
  predictedGrade: number; // 0 to 20
  confidenceLevel: string;
  historyGrade: number;
  geoGrade: number;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  predictedGrade,
  confidenceLevel,
  historyGrade,
  geoGrade,
}) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let gradeColor = 'text-amber-400';
  let strokeColor = '#ffe16d';
  let badgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';

  if (score >= 80) {
    gradeColor = 'text-emerald-400';
    strokeColor = '#4ade80';
    badgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  } else if (score >= 60) {
    gradeColor = 'text-teal-400';
    strokeColor = '#59dad1';
    badgeBg = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
  } else if (score < 45) {
    gradeColor = 'text-rose-400';
    strokeColor = '#f43f5e';
    badgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#070e28] via-[#091338] to-[#04081c] p-5 sm:p-6 shadow-2xl">
      {/* Background Ambient Glow */}
      <div
        className="absolute -top-12 -left-12 h-40 w-40 rounded-full blur-3xl opacity-25"
        style={{ backgroundColor: strokeColor }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Gauge Circle Left */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="#17224d"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress Arc */}
              <motion.circle
                cx="72"
                cy="72"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-black text-white">{score}%</span>
              <span className="text-[10px] font-bold text-[#a2a6d0] uppercase tracking-wider">
                مؤشر الجاهزية
              </span>
            </div>
          </div>

          {/* Core Descriptive Text */}
          <div className="space-y-2 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${badgeBg}`}>
                مستوى الاستعداد: {confidenceLevel}
              </span>
              <span className="text-[11px] text-amber-300 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                توقع الخوارزمية
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white font-serif">
              مؤشر التفوق في التاريخ والجغرافيا
            </h3>
            <p className="text-xs text-[#a2a6d0] max-w-md leading-relaxed">
              يتم احتساب هذا المؤشر استناداً إلى 6 محاور منهجية تشمل حفظ المصطلحات، ضبط التواريخ، التوقيع على الخرائط، إتقان مقال البكالوريا ودقة ساحة التحدي.
            </p>
          </div>
        </div>

        {/* Predicted Grade Box Right */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 min-w-[210px]">
          <div className="flex-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-center sm:text-right">
            <div className="flex items-center justify-between text-xs text-amber-300 font-bold mb-1">
              <span>العلامة المتوقعة للبكالوريا</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline justify-center sm:justify-start gap-1.5 font-mono">
              <span className={`text-3xl sm:text-4xl font-black ${gradeColor}`}>
                {predictedGrade.toFixed(1)}
              </span>
              <span className="text-xs text-[#a2a6d0] font-bold">/ 20.0</span>
            </div>

            {/* History / Geo Sub split */}
            <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-[#dfe0ff]">
              <span>التاريخ: <strong className="text-teal-300 font-mono">{historyGrade}/10</strong></span>
              <span>الجغرافيا: <strong className="text-indigo-300 font-mono">{geoGrade}/10</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
