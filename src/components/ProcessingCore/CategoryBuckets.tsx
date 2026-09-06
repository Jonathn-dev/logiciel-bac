import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, User, Calendar, MapPin, Search } from 'lucide-react';
import { ExtractedConceptItem } from '../../types';

interface CategoryBucketsProps {
  concepts: ExtractedConceptItem[];
}

type TabType = 'all' | 'term' | 'personality' | 'date' | 'concept';

export const CategoryBuckets: React.FC<CategoryBucketsProps> = ({ concepts }) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const terms = concepts.filter((c) => c.type === 'term');
  const personalities = concepts.filter((c) => c.type === 'personality');
  const dates = concepts.filter((c) => c.type === 'date');
  const geoConcepts = concepts.filter((c) => c.type === 'concept');

  const filtered = concepts.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.officialDefinition && item.officialDefinition.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <div className="atlas-glass rounded-2xl p-5 border border-[#59dad1]/20">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            سلات التصنيف المنهجي (Category Buckets)
          </h4>
          <p className="text-xs text-[#a2a6d0]">
            توزيع الكيانات المستخلصة حسب معايير التصحيح في البكالوريا
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المفاهيم..."
            className="w-full md:w-52 bg-[#090f38] border border-white/15 rounded-xl px-3 py-1.5 pl-8 text-xs text-white placeholder:text-[#6b729f] focus:outline-none focus:border-[#59dad1]"
          />
          <Search className="w-3.5 h-3.5 text-[#6b729f] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-[#59dad1] text-[#080d3b] shadow-md shadow-[#59dad1]/20 font-bold'
              : 'bg-[#0b103b] text-[#a2a6d0] hover:text-white border border-white/5'
          }`}
        >
          الكل ({concepts.length})
        </button>
        <button
          onClick={() => setActiveTab('term')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'term'
              ? 'bg-[#59dad1] text-[#080d3b] font-bold'
              : 'bg-[#0b103b] text-[#a2a6d0] hover:text-white border border-white/5'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          مصطلحات ({terms.length})
        </button>
        <button
          onClick={() => setActiveTab('personality')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'personality'
              ? 'bg-[#ffe16d] text-[#080d3b] font-bold'
              : 'bg-[#0b103b] text-[#a2a6d0] hover:text-white border border-white/5'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          شخصيات ({personalities.length})
        </button>
        <button
          onClick={() => setActiveTab('date')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'date'
              ? 'bg-[#4ade80] text-[#080d3b] font-bold'
              : 'bg-[#0b103b] text-[#a2a6d0] hover:text-white border border-white/5'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          تواريخ ({dates.length})
        </button>
        <button
          onClick={() => setActiveTab('concept')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'concept'
              ? 'bg-[#f43f5e] text-white font-bold'
              : 'bg-[#0b103b] text-[#a2a6d0] hover:text-white border border-white/5'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          جغرافيا ({geoConcepts.length})
        </button>
      </div>

      {/* Grid of items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full py-8 text-center text-xs text-[#6b729f]">
              لا توجد عناصر مطابقة للبحث في هذا التصنيف.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#090e38]/70 border border-white/10 hover:border-[#ffe16d]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-[#ffe16d] font-bold">
                      {item.category === 'history' ? 'تاريخ' : 'جغرافيا'}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[#a2a6d0]">
                      {item.importance === 'critical' ? 'مهم جداً' : 'مهم'}
                    </span>
                  </div>
                  <h6 className="text-xs font-bold text-white mb-1">{item.name}</h6>
                  {item.officialDefinition && (
                    <p className="text-[11px] text-[#a2a6d0] leading-relaxed line-clamp-3">
                      {item.officialDefinition}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
