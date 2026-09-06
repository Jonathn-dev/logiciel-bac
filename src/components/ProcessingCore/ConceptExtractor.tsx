import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, Bookmark, Calendar, User, MapPin } from 'lucide-react';
import { ExtractedConceptItem } from '../../types';

interface ConceptExtractorProps {
  concepts: ExtractedConceptItem[];
  onSelectConcept?: (concept: ExtractedConceptItem) => void;
}

const TYPE_CONFIG = {
  term: { label: 'مصطلح رسمي', color: 'text-[#59dad1] bg-[#59dad1]/10 border-[#59dad1]/30', icon: Bookmark },
  personality: { label: 'علم وشخصية', color: 'text-[#ffe16d] bg-[#ffe16d]/10 border-[#ffe16d]/30', icon: User },
  date: { label: 'تاريخ معلمي', color: 'text-[#4ade80] bg-[#4ade80]/10 border-[#4ade80]/30', icon: Calendar },
  concept: { label: 'مفهوم جغرافي', color: 'text-[#f43f5e] bg-[#f43f5e]/10 border-[#f43f5e]/30', icon: MapPin },
};

export const ConceptExtractor: React.FC<ConceptExtractorProps> = ({
  concepts,
  onSelectConcept,
}) => {
  if (concepts.length === 0) {
    return (
      <div className="atlas-glass rounded-2xl p-6 border border-white/10 text-center">
        <Sparkles className="w-8 h-8 text-[#59dad1] mx-auto mb-2 opacity-50" />
        <p className="text-xs text-[#a2a6d0]">
          قم برفع ملف أو نص للبدء في استخلاص المصطلحات والشخصيات والتواريخ المقررة
        </p>
      </div>
    );
  }

  return (
    <div className="atlas-glass rounded-2xl p-5 border border-[#ffe16d]/25">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ffe16d]" />
          <h4 className="text-sm font-bold text-white">
            المفاهيم المستخلصة (Extracted Concepts)
          </h4>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffe16d]/15 text-[#ffe16d] font-mono border border-[#ffe16d]/30">
          {concepts.length} كيانات مطابقة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1 custom-scrollbar">
        {concepts.map((concept, idx) => {
          const cfg = TYPE_CONFIG[concept.type] || TYPE_CONFIG.term;
          const Icon = cfg.icon;

          return (
            <motion.div
              key={concept.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => onSelectConcept?.(concept)}
              className="p-3 rounded-xl bg-[#090f38]/80 border border-white/10 hover:border-[#59dad1]/50 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${cfg.color}`}>
                  <Icon className="w-3 h-3" />
                  {cfg.label}
                </span>
                <span className="text-[10px] font-mono text-[#4ade80] flex items-center gap-0.5">
                  <Check className="w-3 h-3" />
                  {Math.round(concept.confidence * 100)}%
                </span>
              </div>

              <h5 className="text-xs font-bold text-white group-hover:text-[#ffe16d] transition-colors">
                {concept.name}
              </h5>

              {concept.officialDefinition && (
                <p className="text-[11px] text-[#a2a6d0] mt-1 line-clamp-2 leading-relaxed">
                  {concept.officialDefinition}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
