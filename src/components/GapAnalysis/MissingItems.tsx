import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, PlusCircle, CheckCircle2, BookmarkPlus, Lightbulb } from 'lucide-react';
import { MissingConceptItem } from '../../types';

interface MissingItemsProps {
  missingItems: MissingConceptItem[];
  resolvedItemIds?: Set<string>;
  onToggleResolved?: (id: string) => void;
  onAddNoteSnippet?: (item: MissingConceptItem) => void;
}

export const MissingItems: React.FC<MissingItemsProps> = ({
  missingItems,
  resolvedItemIds = new Set(),
  onToggleResolved,
  onAddNoteSnippet,
}) => {
  if (missingItems.length === 0) {
    return (
      <div className="atlas-glass rounded-2xl p-6 border border-[#4ade80]/30 text-center">
        <div className="w-12 h-12 rounded-full bg-[#4ade80]/15 text-[#4ade80] flex items-center justify-center mx-auto mb-2">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">
          تهانينا! ملخصك شامل لكافة متطلبات الإطار المرجعي
        </h4>
        <p className="text-xs text-[#a2a6d0]">
          لا توجد ثغرات معرفية مرصودة في هذا المحور. أنت جاهز للامتحان الوطني!
        </p>
      </div>
    );
  }

  return (
    <div className="atlas-glass rounded-2xl p-5 border border-rose-500/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-rose-500/20 pb-3">
        <div className="flex items-center gap-2">
          {/* Red Pulsing Beacon */}
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 relative" />
          </div>
          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
            الثغرات المعرفية الواجب استدراكها (Critical Gaps)
          </h4>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 font-mono border border-rose-500/30">
          {missingItems.length} عناصر ناقصة
        </span>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {missingItems.map((item, idx) => {
          const isResolved = resolvedItemIds.has(item.id);

          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-[#091730]/60 border-[#4ade80]/40 opacity-70'
                  : 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.08)]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40">
                      {item.frequency === 'عالي جداً' ? 'تردد مرتفع جداً في البكالوريا' : item.frequency}
                    </span>
                    <span className="text-[10px] text-[#a2a6d0] font-mono">
                      {item.chapter}
                    </span>
                  </div>
                  <h5
                    className={`text-sm font-bold ${
                      isResolved ? 'line-through text-[#a2a6d0]' : 'text-white'
                    }`}
                  >
                    {item.title}
                  </h5>
                </div>

                {/* Resolve / Action Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {onToggleResolved && (
                    <button
                      onClick={() => onToggleResolved(item.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                        isResolved
                          ? 'bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/40'
                          : 'bg-[#121c45] text-[#a2a6d0] hover:text-white border border-white/10'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {isResolved ? 'تم الاستدراك' : 'وضع علامة تم'}
                    </button>
                  )}
                  {onAddNoteSnippet && (
                    <button
                      onClick={() => onAddNoteSnippet(item)}
                      className="p-1.5 rounded-lg bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30 hover:bg-[#ffe16d]/25 transition-all cursor-pointer"
                      title="إضافة بطاقة استدراكية للدفتر"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Why Critical */}
              <div className="bg-[#060b29]/70 rounded-lg p-2.5 border border-white/5 space-y-1 mt-2 text-xs">
                <div className="flex items-start gap-1.5 text-rose-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-[11px] leading-relaxed">
                    سبب الأهمية: {item.whyCritical}
                  </span>
                </div>
                <div className="flex items-start gap-1.5 text-[#59dad1]">
                  <Lightbulb className="w-3.5 h-3.5 text-[#ffe16d] shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    خطة المعالجة: {item.suggestedAction}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
