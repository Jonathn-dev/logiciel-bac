import React from 'react';
import { motion } from 'motion/react';
import {
  BookMarked,
  Clock,
  MapPin,
  PenTool,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { SkillDimension } from '../../utils/analyticsTracker';

interface DimensionRadarProps {
  dimensions: SkillDimension[];
  onActionClick?: (route: string) => void;
}

export const DimensionRadar: React.FC<DimensionRadarProps> = ({ dimensions, onActionClick }) => {
  const getIcon = (key: string) => {
    switch (key) {
      case 'terms':
        return <BookMarked className="w-4 h-4 text-amber-300" />;
      case 'dates':
        return <Clock className="w-4 h-4 text-teal-300" />;
      case 'maps':
        return <MapPin className="w-4 h-4 text-purple-300" />;
      case 'essays':
        return <PenTool className="w-4 h-4 text-emerald-300" />;
      case 'quizzes':
        return <Zap className="w-4 h-4 text-rose-300" />;
      case 'consistency':
        return <Flame className="w-4 h-4 text-orange-300" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#59dad1]/20 text-[#59dad1] border border-[#59dad1]/30">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white">
              مصفوفة المهارات والمحاور الوزارية (Skill Matrix)
            </h4>
            <p className="text-[11px] text-[#a2a6d0]">
              تفكيك مستوى التحصيل عبر الأبعاد الستة المعتمدة في التقييم
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-amber-300 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20">
          6 ركائز أساسية
        </span>
      </div>

      {/* Grid of Dimension Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {dimensions.map((dim, idx) => {
          const isHigh = dim.score >= 80;
          const isLow = dim.score < 50;

          return (
            <motion.div
              key={dim.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-white/5 bg-[#091338]/70 p-3.5 space-y-2 hover:border-white/20 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                    {getIcon(dim.key)}
                  </div>
                  <span className="text-xs font-bold text-white">{dim.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#a2a6d0] font-mono">
                    وزن {(dim.weight * 100).toFixed(0)}%
                  </span>
                  <span
                    className="font-mono text-xs font-black px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${dim.color}20`,
                      color: dim.color,
                      border: `1px solid ${dim.color}40`,
                    }}
                  >
                    {dim.score}%
                  </span>
                </div>
              </div>

              {/* Custom Progress Bar */}
              <div className="h-2 w-full rounded-full bg-[#050a1e] overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: dim.color }}
                />
              </div>

              {/* Description Snippet */}
              <div className="flex items-center justify-between text-[11px]">
                <p className="text-[#a2a6d0] line-clamp-1">{dim.description}</p>
                {isLow && (
                  <span className="text-[10px] text-rose-300 font-bold flex items-center gap-1 shrink-0">
                    <AlertCircle className="w-3 h-3" /> يحتاج مراجعة
                  </span>
                )}
                {isHigh && (
                  <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" /> ممتاز
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
