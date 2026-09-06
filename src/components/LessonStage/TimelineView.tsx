import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonData, TimelineEventItem } from '../../types';
import {
  GitCommit,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  ArrowDown,
  FileCheck,
  CheckCircle,
  Flag,
} from 'lucide-react';

interface TimelineViewProps {
  lesson: LessonData;
  onSelectConceptForAI: (concept: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  lesson,
  onSelectConceptForAI,
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    lesson.timeline.filter((e) => e.isMilestone).map((e) => e.id)
  );
  const [filterCategory, setFilterCategory] = useState<'all' | 'milestones'>('all');

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const displayedEvents =
    filterCategory === 'milestones'
      ? lesson.timeline.filter((e) => e.isMilestone)
      : lesson.timeline;

  return (
    <div className="flex flex-col gap-6 pb-16">
      {/* Timeline Header & Filter Options */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-800 bg-[#09101d] p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-100">
              الخط الزمني التفاعلي للوحدة
            </h3>
            <p className="text-xs text-stone-400">
              تسلسل كرونولوجي يربط الأسباب بالنتائج وفق ما يتطلبه النهج التاريخي في الامتحان الوطني
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-filter-all-timeline"
            onClick={() => setFilterCategory('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterCategory === 'all'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'border border-stone-700 bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            جميع المحطات ({lesson.timeline.length})
          </button>
          <button
            id="btn-filter-milestones"
            onClick={() => setFilterCategory('milestones')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
              filterCategory === 'milestones'
                ? 'bg-amber-400 text-stone-950 shadow-md'
                : 'border border-stone-700 bg-stone-900 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>المحطات المفصلية فقط ({lesson.timeline.filter((e) => e.isMilestone).length})</span>
          </button>
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative border-r-2 border-stone-800 mr-4 md:mr-8 pr-6 md:pr-10 space-y-8">
        {displayedEvents.map((event, idx) => {
          const isExpanded = expandedIds.includes(event.id);

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {/* Node Marker on vertical line */}
              <div
                className={`absolute -right-[31px] md:-right-[47px] top-4 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                  event.isMilestone
                    ? 'border-amber-400 bg-[#09101d] text-amber-400 shadow-lg shadow-amber-400/20 ring-4 ring-amber-400/10'
                    : 'border-teal-500 bg-[#09101d] text-teal-400'
                }`}
              >
                {event.isMilestone ? (
                  <Star className="h-4 w-4 fill-amber-400" />
                ) : (
                  <GitCommit className="h-4 w-4" />
                )}
              </div>

              {/* Event Card Container */}
              <div
                className={`rounded-3xl border transition-all ${
                  event.isMilestone
                    ? 'border-amber-500/40 bg-[#0c1527] shadow-xl'
                    : 'border-stone-800 bg-[#09101d] shadow-lg hover:border-stone-700'
                }`}
              >
                <div
                  onClick={() => toggleExpand(event.id)}
                  className="flex items-center justify-between p-5 cursor-pointer select-none"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base md:text-lg font-black text-amber-400 bg-amber-950/40 border border-amber-500/30 px-3 py-1 rounded-xl">
                      {event.year}
                    </span>
                    {event.exactDate && (
                      <span className="text-xs text-stone-400 font-medium">
                        ({event.exactDate})
                      </span>
                    )}
                    <h4 className="text-base font-extrabold text-stone-100">
                      {event.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.isMilestone && (
                      <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                        <Flag className="h-3 w-3" />
                        محطة مفصلية
                      </span>
                    )}
                    <button
                      id={`btn-toggle-event-${event.id}`}
                      className="rounded-lg p-1 text-stone-400 hover:text-stone-100"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsible Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-stone-800/80 px-6 pb-6 pt-4 space-y-4"
                    >
                      <div>
                        <h5 className="text-xs font-bold text-stone-300 mb-1">الحدث وسياقه:</h5>
                        <p className="text-xs md:text-sm text-stone-200 leading-relaxed bg-stone-900/60 p-3.5 rounded-xl border border-stone-800">
                          {event.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-xl border border-teal-500/20 bg-teal-950/20 p-3">
                          <h6 className="text-[11px] font-bold text-teal-300 mb-1 flex items-center gap-1">
                            <ArrowDown className="h-3 w-3" />
                            النتائج والانعكاسات التاريخية:
                          </h6>
                          <p className="text-xs text-stone-300">{event.impact}</p>
                        </div>

                        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3">
                          <h6 className="text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                            <FileCheck className="h-3 w-3" />
                            الأهمية في الامتحان الوطني:
                          </h6>
                          <p className="text-xs text-stone-300">{event.examRelevance}</p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          id={`btn-ask-timeline-${event.id}`}
                          onClick={() =>
                            onSelectConceptForAI(
                              `كيف أوظف محطة «${event.title}» (${event.year}) في كتابة موضوع مقالي تاريخي؟`
                            )
                          }
                          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          <span>سؤال المساعد حول هذا التاريخ</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
