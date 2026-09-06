import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number;
  unit: string;
  icon: LucideIcon;
  color?: 'amber' | 'teal' | 'purple' | 'rose';
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  label,
  used,
  limit,
  unit,
  icon: Icon,
  color = 'amber',
}) => {
  const percentage = Math.min(100, Math.round((used / limit) * 100));

  const colorStyles = {
    amber: {
      bar: 'bg-gradient-to-r from-amber-500 to-amber-300',
      text: 'text-amber-300',
      bgIcon: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    teal: {
      bar: 'bg-gradient-to-r from-teal-500 to-teal-300',
      text: 'text-teal-300',
      bgIcon: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    },
    purple: {
      bar: 'bg-gradient-to-r from-purple-500 to-purple-300',
      text: 'text-purple-300',
      bgIcon: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
    rose: {
      bar: 'bg-gradient-to-r from-rose-500 to-rose-300',
      text: 'text-rose-300',
      bgIcon: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    },
  }[color];

  return (
    <div className="p-4 rounded-2xl bg-[#091338]/80 border border-white/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${colorStyles.bgIcon}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h6 className="text-xs font-bold text-white">{label}</h6>
            <span className="text-[10px] text-[#a2a6d0]">الاستهلاك الشهري</span>
          </div>
        </div>

        <div className="text-left">
          <span className="text-xs font-black font-mono text-white">
            {used} / {limit} {unit}
          </span>
          <span className={`text-[10px] font-bold block ${colorStyles.text}`}>
            {percentage}% مستخدم
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorStyles.bar}`}
        />
      </div>
    </div>
  );
};
