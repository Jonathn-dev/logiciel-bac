import React from 'react';
import { motion } from 'motion/react';
import { GripVertical, ArrowUp, ArrowDown, BookOpen, Globe2 } from 'lucide-react';

interface DraggableRankProps {
  items: ('history' | 'geography')[];
  onChange: (items: ('history' | 'geography')[]) => void;
}

export const DraggableRank: React.FC<DraggableRankProps> = ({ items, onChange }) => {
  const swapItems = () => {
    onChange([items[1], items[0]]);
  };

  const getLabel = (type: 'history' | 'geography') => {
    if (type === 'history') {
      return {
        title: 'مادة التاريخ (الوحدات، الشخصيات، التواريخ)',
        desc: 'أولوية قصوى لمراجعة أزمات الحرب الباردة والثورة التحريرية',
        icon: BookOpen,
        color: 'border-amber-400/40 bg-amber-500/10 text-amber-300',
      };
    }
    return {
      title: 'مادة الجغرافيا (المبادلات، القوى، والخرائط)',
      desc: 'أولوية أولى لأسواق الطاقة ورسم وتوقيع الجداول الإحصائية',
      icon: Globe2,
      color: 'border-teal-400/40 bg-teal-500/10 text-teal-300',
    };
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-white">ترتيب الأولوية الدراسية اليومية:</span>
        <button
          type="button"
          onClick={swapItems}
          className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer text-[11px]"
        >
          <span>عكس الترتيب</span>
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => {
          const info = getLabel(item);
          const Icon = info.icon;
          return (
            <motion.div
              key={item}
              layout
              className={`flex items-center justify-between p-3 sm:p-4 rounded-2xl border ${info.color} bg-[#081133] transition-all`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-xl bg-stone-950/50 flex items-center justify-center font-mono font-bold text-xs text-white border border-white/10">
                  #{index + 1}
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-white">{info.title}</h5>
                  <p className="text-[11px] text-[#a2a6d0]">{info.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={swapItems}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white cursor-pointer"
                  title="تبديل الأسبقية"
                >
                  {index === 0 ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
