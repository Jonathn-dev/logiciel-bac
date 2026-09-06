import React from 'react';
import { motion } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { GapMetricItem } from '../../types';

interface ComparisonBarsProps {
  metrics: GapMetricItem[];
}

export const ComparisonBars: React.FC<ComparisonBarsProps> = ({ metrics }) => {
  return (
    <div className="atlas-glass rounded-2xl p-5 border border-[#59dad1]/25">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <BarChart3 className="w-4 h-4 text-[#59dad1]" />
        <h4 className="text-sm font-bold text-white">
          أعمدة المطابقة والشمولية (Curriculum Coverage Bars)
        </h4>
      </div>

      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={metric.category || idx} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-bold">{metric.category}</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#a2a6d0] font-mono">
                  {metric.currentCount} / {metric.requiredCount} عنصر
                </span>
                <span
                  className="font-mono font-bold text-xs"
                  style={{ color: metric.color }}
                >
                  {metric.coveragePercentage}%
                </span>
              </div>
            </div>

            {/* Comparison progress track */}
            <div className="w-full bg-[#090f38] h-3 rounded-full overflow-hidden p-[1px] border border-white/10 relative">
              {/* Benchmark Reference Marker at 100% */}
              <div className="absolute top-0 bottom-0 right-full -mr-[1px] w-[2px] bg-white/30 z-10" />

              <motion.div
                className="h-full rounded-full transition-all"
                style={{
                  backgroundColor: metric.color,
                  boxShadow: `0 0 10px ${metric.color}66`,
                }}
                initial={{ width: '0%' }}
                animate={{ width: `${metric.coveragePercentage}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
