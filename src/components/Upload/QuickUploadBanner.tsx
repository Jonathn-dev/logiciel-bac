import React from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  FileUp,
  BrainCircuit,
} from 'lucide-react';

interface QuickUploadBannerProps {
  onOpenUploadModal: () => void;
  onOpenKnowledgeHub: () => void;
  chunksCount?: number;
}

export const QuickUploadBanner: React.FC<QuickUploadBannerProps> = ({
  onOpenUploadModal,
  onOpenKnowledgeHub,
  chunksCount = 6,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl border-2 border-[#ffe16d]/40 bg-gradient-to-r from-[#09133a] via-[#0f1d52] to-[#070e28] p-5 sm:p-7 text-white shadow-[0_0_40px_rgba(255,225,109,0.12)]"
    >
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/30 shrink-0">
            <UploadCloud className="w-7 h-7 sm:w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-lg sm:text-xl font-black text-white font-serif">
                📥 مركز تحميل ورفع الوثائق والملخصات (PDF / Word / صور / كراس)
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                مباشر وسهل
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#dfe0ff]/80 leading-relaxed max-w-2xl">
              حمّل ملخصات دروسك ودفاتر القسم ليقوم الذكاء الاصطناعي <strong>(RAG Engine)</strong> بحفظها والإجابة عن أسئلتك وتوليد اختبارات وبطاقات استذكار مستخلصة حصرياً منها!
            </p>

            <div className="flex items-center gap-4 text-xs text-[#a2a6d0] pt-1">
              <span className="flex items-center gap-1 text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5" />
                قاعدة المتجهات نشطة ({chunksCount} فقرة مفهرسة)
              </span>
              <span className="hidden sm:inline-block text-white/20">•</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-amber-200">
                <BrainCircuit className="w-3.5 h-3.5" />
                تحويل فوري إلى متجهات دلالية
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={onOpenUploadModal}
            className="flex-1 lg:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-400/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-300/40"
          >
            <FileUp className="w-5 h-5" />
            <span>ارفع وثيقة / كراس الآن 📤</span>
          </button>

          <button
            onClick={onOpenKnowledgeHub}
            className="px-4 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            title="تصفح بنك الملخصات الحالية"
          >
            <BookOpen className="w-4 h-4 text-teal-300" />
            <span className="hidden sm:inline">بنك الملخصات</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
