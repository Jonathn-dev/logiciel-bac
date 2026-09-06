import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Layers,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { UnitMasteryData } from '../../utils/analyticsTracker';

interface UnitMasteryGridProps {
  units: UnitMasteryData[];
  onOpenUnitStudy?: (unitId: string) => void;
}

export const UnitMasteryGrid: React.FC<UnitMasteryGridProps> = ({ units, onOpenUnitStudy }) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'history' | 'geography'>('all');
  const [expandedUnitId, setExpandedUnitId] = useState<string | null>(null);

  const filteredUnits = units.filter((u) => {
    if (selectedSubject === 'all') return true;
    return u.subject === selectedSubject;
  });

  return (
    <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-5 sm:p-6 shadow-xl space-y-4">
      {/* Header with Subject Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white">
              تشخيص استيعاب الوحدات الدراسية (Unit Breakdown)
            </h4>
            <p className="text-[11px] text-[#a2a6d0]">
              نسب الإتقان التفصيلية لكل وحدة تعليمية في المنهاج الرسمي للبكالوريا
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#091338] border border-white/10 text-xs">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedSubject === 'all'
                ? 'bg-[#59dad1] text-stone-950 shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            الكل (All)
          </button>
          <button
            onClick={() => setSelectedSubject('history')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedSubject === 'history'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            التاريخ 📜
          </button>
          <button
            onClick={() => setSelectedSubject('geography')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              selectedSubject === 'geography'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
          >
            الجغرافيا 🌍
          </button>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-3">
        {filteredUnits.map((unit) => {
          const isExpanded = expandedUnitId === unit.id;
          const isHistory = unit.subject === 'history';

          let statusBadge = (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> تمكن ممتاز ({unit.masteryPercentage}%)
            </span>
          );

          if (unit.status === 'needs_work') {
            statusBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> بحاجة لتركيز ({unit.masteryPercentage}%)
              </span>
            );
          } else if (unit.status === 'good') {
            statusBadge = (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> مستوى جيد ({unit.masteryPercentage}%)
              </span>
            );
          }

          return (
            <div
              key={unit.id}
              className="rounded-2xl border border-white/5 bg-[#091338]/60 overflow-hidden transition-all hover:border-white/15"
            >
              {/* Unit Summary Row */}
              <div
                onClick={() => setExpandedUnitId(isExpanded ? null : unit.id)}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border text-xs font-black ${
                      isHistory
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                    }`}
                  >
                    {isHistory ? 'تاريخ' : 'جغرافيا'}
                  </div>

                  <div>
                    <h5 className="text-sm font-black text-white">{unit.unitName}</h5>
                    <p className="text-[11px] text-[#a2a6d0]">
                      تم استيعاب {unit.masteredConcepts} من أصل {unit.totalConcepts} مفهوماً وعنصراً أساسياً
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  {statusBadge}
                  <ChevronDown
                    className={`w-4 h-4 text-[#a2a6d0] transform transition-transform ${
                      isExpanded ? 'rotate-180 text-amber-300' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Progress Line */}
              <div className="h-1.5 w-full bg-[#050a1e]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${unit.masteryPercentage}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full ${
                    unit.masteryPercentage >= 75
                      ? 'bg-emerald-400'
                      : unit.masteryPercentage >= 50
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                />
              </div>

              {/* Expanded Diagnostic Sub-view */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-[#050a1e]/80 border-t border-white/5 space-y-3"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {/* Strong concepts */}
                      <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 space-y-1.5">
                        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          نقاط القوة المحسومة (تمكن عالي):
                        </span>
                        <ul className="space-y-1 text-[#dfe0ff] text-[11px]">
                          {unit.strongPoints.map((pt, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weak concepts */}
                      <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 space-y-1.5">
                        <span className="text-[11px] font-bold text-rose-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          عناصر تتطلب التدعيم والمراجعة:
                        </span>
                        <ul className="space-y-1 text-[#dfe0ff] text-[11px]">
                          {unit.weakPoints.map((pt, i) => (
                            <li key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
