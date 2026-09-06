import React from 'react';
import { motion } from 'motion/react';
import { X, Database } from 'lucide-react';
import { PersonalKnowledgeHub } from '../PersonalKnowledge/PersonalKnowledgeHub';

interface PersonalKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
}

export const PersonalKnowledgeModal: React.FC<PersonalKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onAwardXP,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl h-[88vh] flex flex-col rounded-3xl border border-white/10 bg-[#04081c] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden text-[#dfe0ff]"
      >
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#091338]/80 hover:bg-[#091338] text-[#a2a6d0] hover:text-white transition-all cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <PersonalKnowledgeHub onClose={onClose} onAwardXP={onAwardXP} />
      </motion.div>
    </div>
  );
};
