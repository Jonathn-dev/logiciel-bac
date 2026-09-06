import React, { useState } from 'react';
import { Clock, Calendar, Search, Filter, Sparkles, BookOpen } from 'lucide-react';
import { BAC_DATES } from '../../../data/bacCurriculum';
import { BacDateItem } from '../../../types';

export const InteractiveTimeline: React.FC = () => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'national' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDates = BAC_DATES.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.dateStr.toLowerCase().includes(q) ||
        item.event.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-amber-400/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Clock className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              شريط التواريخ والأحداث المفصلية لبكالوريا الجزائر
            </h2>
          </div>
          <p className="text-xs text-[#a2a6d0] mt-1">
            جميع المحطات التاريخية المقررة (1945 - 1989 والحركة الوطنية وثورة التحرير 1954 - 1962)
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-[#121743] text-[#a2a6d0] border-white/10'
            }`}
          >
            جميع التواريخ ({BAC_DATES.length})
          </button>
          <button
            onClick={() => setFilterCategory('national')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filterCategory === 'national'
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-[#121743] text-[#a2a6d0] border-white/10'
            }`}
          >
            تاريخ الثورة الجزائرية
          </button>
          <button
            onClick={() => setFilterCategory('international')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              filterCategory === 'international'
                ? 'bg-amber-400 text-black border-amber-400'
                : 'bg-[#121743] text-[#a2a6d0] border-white/10'
            }`}
          >
            العلاقات الدولية والحرب الباردة
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute right-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#a2a6d0]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن تاريخ، حدث، أو مؤتمر (مثال: 20 أوت، الصومام، مارشال)..."
          className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[#080d2f] border border-white/10 text-xs text-white placeholder:text-[#a2a6d0]/50 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Timeline Stream */}
      <div className="relative border-r-2 border-amber-400/30 mr-4 sm:mr-8 space-y-6 pr-6 sm:pr-8 py-2">
        {filteredDates.map((item) => (
          <div key={item.id} className="relative group">
            
            {/* Timeline Node Point */}
            <div className="absolute -right-[31px] sm:-right-[39px] top-4 w-4 h-4 rounded-full bg-[#05081f] border-2 border-amber-400 group-hover:scale-125 group-hover:bg-amber-400 transition-all shadow-[0_0_10px_rgba(251,191,36,0.5)]" />

            {/* Event Card */}
            <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-white/10 hover:border-amber-400/40 transition-all space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black font-mono px-3 py-1 rounded-xl bg-amber-400 text-black shadow-md">
                    {item.dateStr}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#a2a6d0]">
                    {item.category === 'national' ? 'الجزائر' : 'دولي'}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#a2a6d0]">سنة {item.year}</span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>

              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                {item.event}
              </p>

              <div className="p-3 rounded-xl bg-[#070a2b] border border-white/5 text-xs space-y-1">
                <span className="font-bold text-amber-400">الأهمية التاريخية وسياق الامتحان:</span>
                <p className="text-[#a2a6d0]">{item.significance}</p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a2a6d0]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
