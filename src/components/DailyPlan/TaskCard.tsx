import React from 'react';
import { CheckCircle2, Circle, Clock, Award, BookOpen, ChevronLeft } from 'lucide-react';
import { DailyTask } from '../../types';

interface TaskCardProps {
  task: DailyTask;
  onToggle: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'history':
        return 'border-amber-400/30 bg-amber-950/20 text-amber-300';
      case 'geography':
        return 'border-teal-400/30 bg-teal-950/20 text-teal-300';
      case 'terminology':
        return 'border-indigo-400/30 bg-indigo-950/20 text-indigo-300';
      default:
        return 'border-purple-400/30 bg-purple-950/20 text-purple-300';
    }
  };

  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`group relative rounded-2xl p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
        task.completed
          ? 'bg-[#080d29]/60 border-green-500/30 opacity-75'
          : 'bg-[#0e1438]/80 hover:bg-[#131b48] border-white/10 hover:border-amber-400/40 shadow-lg'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        
        {/* Checkbox and Content */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
            className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-400 fill-green-950" />
            ) : (
              <Circle className="w-5 h-5 text-[#a2a6d0] group-hover:text-amber-400" />
            )}
          </button>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(task.category)}`}>
                {task.categoryLabel}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#1c2357] text-[#dfe0ff] border border-white/10">
                {task.phaseLabel}
              </span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                {task.timeSlot}
              </span>
            </div>

            <h3 className={`text-sm sm:text-base font-bold leading-snug transition-colors ${
              task.completed ? 'line-through text-[#a2a6d0]' : 'text-white group-hover:text-amber-300'
            }`}>
              {task.title}
            </h3>

            <p className="text-xs text-[#a2a6d0] leading-relaxed">
              {task.notes}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {task.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a2a6d0] border border-white/5">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* XP and Time Badge */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold font-mono">
            <Award className="w-3.5 h-3.5" />
            <span>+{task.xpReward} XP</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-[#a2a6d0]">
            <Clock className="w-3 h-3 text-[#a2a6d0]" />
            <span>{task.estimatedMinutes} د</span>
          </div>
        </div>
      </div>
    </div>
  );
};
