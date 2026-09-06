import React, { useState } from 'react';
import { BookOpen, User, RotateCw, CheckCircle, Search, Sparkles, HelpCircle } from 'lucide-react';
import { BAC_TERMS, BAC_CHARACTERS } from '../../../data/bacCurriculum';

export const FlashcardDeck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terms' | 'characters'>('terms');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredTerms = BAC_TERMS.filter((t) =>
    t.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.officialDefinition.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCharacters = BAC_CHARACTERS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="atlas-glass rounded-3xl p-5 sm:p-6 border border-amber-400/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white">
              المعجم المرجعي للمصطلحات والشخصيات المعتمدة
            </h2>
          </div>
          <p className="text-xs text-[#a2a6d0] mt-1">
            بطاقات استرجاع ذكية وتعاريف نموذجية دقيقة وفق عناصر الإجابة الرسمية للبكالوريا
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-[#121743] text-[#a2a6d0] border-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>المصطلحات الرسمية ({BAC_TERMS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'characters'
                ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                : 'bg-[#121743] text-[#a2a6d0] border-white/10'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>الشخصيات التاريخية ({BAC_CHARACTERS.length})</span>
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
          placeholder="ابحث عن مصطلح، شخصية، أو بلد..."
          className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[#080d2f] border border-white/10 text-xs text-white placeholder:text-[#a2a6d0]/50 focus:outline-none focus:border-amber-400"
        />
      </div>

      {/* Grid of Flashcards */}
      {activeTab === 'terms' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term) => {
            const isFlipped = !!flippedCards[term.id];

            return (
              <div
                key={term.id}
                onClick={() => toggleFlip(term.id)}
                className="atlas-glass rounded-3xl p-5 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer space-y-3 min-h-[220px] flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      {term.subject === 'history' ? 'تاريخ' : 'جغرافيا'}
                    </span>
                    <span className="text-[11px] text-[#a2a6d0] flex items-center gap-1">
                      <RotateCw className="w-3 h-3 text-amber-400" />
                      <span>انقر للقلب</span>
                    </span>
                  </div>

                  <h3 className="text-base font-black text-white">
                    {term.term}
                  </h3>

                  {!isFlipped ? (
                    <div className="space-y-2">
                      <p className="text-xs text-[#dfe0ff] leading-relaxed">
                        {term.officialDefinition}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="p-3 rounded-xl bg-[#090e33] border border-white/5 space-y-1">
                        <span className="text-[11px] font-bold text-amber-400">الشرح المبسط:</span>
                        <p className="text-xs text-[#dfe0ff]">{term.simplifiedExplanation}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-[11px] text-red-200">
                        ⚠️ خطأ شائع: {term.commonMistakes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
                  {term.keywords.map((kw, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a2a6d0]">
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCharacters.map((char) => (
            <div
              key={char.id}
              className="atlas-glass rounded-3xl p-5 border border-white/10 hover:border-amber-400/40 transition-all space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {char.nationality}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-[#a2a6d0]">
                  شخصية وزارية
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-white">{char.name}</h3>
                <p className="text-xs text-amber-400 font-medium">{char.title}</p>
              </div>

              <p className="text-xs text-[#dfe0ff] leading-relaxed">
                {char.bio}
              </p>

              <div className="p-3 rounded-2xl bg-[#080d2e] border border-white/5 space-y-1.5">
                <span className="text-[11px] font-bold text-white">أهم الإنجازات والأعمال:</span>
                {char.crucialAchievements.map((ach, idx) => (
                  <p key={idx} className="text-[11px] text-[#a2a6d0] leading-relaxed">• {ach}</p>
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-400/20 text-[11px] text-amber-200">
                💡 {char.examTips}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
