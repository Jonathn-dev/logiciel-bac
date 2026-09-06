import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Calendar, Check, Sparkles } from 'lucide-react';

interface ExamDateModalProps {
  isOpen: boolean;
  currentDate: string;
  onClose: () => void;
  onSaveDate: (newDateIso: string) => void;
}

export const ExamDateModal: React.FC<ExamDateModalProps> = ({
  isOpen,
  currentDate,
  onClose,
  onSaveDate,
}) => {
  const initialDateStr = currentDate.split('T')[0];
  const [selectedDate, setSelectedDate] = useState(initialDateStr);

  if (!isOpen) return null;

  const handleSave = () => {
    const fullIso = `${selectedDate}T08:00:00.000Z`;
    onSaveDate(fullIso);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md atlas-glass rounded-3xl border border-[#ffe16d]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden p-6"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#ffe16d]/15 text-[#ffe16d]">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white font-serif">
              تحديد موعد الامتحان الوطني للبكالوريا
            </h3>
          </div>
          <button onClick={onClose} className="text-[#a2a6d0] hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <p className="text-[#dfe0ff]/80">
            حدد تاريخ بدء اختبارات الدورة العادية للبكالوريا لضبط العداد التنازلي بدقة متناهية:
          </p>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-[#080d3b] border border-[#ffe16d]/30 text-white focus:outline-none focus:border-[#ffe16d] text-sm"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedDate('2026-06-07')}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#a2a6d0] border border-white/10"
            >
              دورة جوان 2026
            </button>
            <button
              onClick={() => setSelectedDate('2027-06-06')}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-[#a2a6d0] border border-white/10"
            >
              دورة جوان 2027
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
            >
              إلغاء
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-[#ffe16d] text-[#3a3000] font-bold text-xs shadow-[0_0_15px_rgba(255,225,109,0.3)] flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              حفظ التاريخ
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
