import React from 'react';
import { motion } from 'motion/react';
import {
  UploadCloud,
  Eye,
  Scissors,
  Cpu,
  Database,
  SearchCode,
  Network,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import { ProcessingStep, ProcessingStageId } from '../../types';

interface IngestionPipelineProps {
  steps: ProcessingStep[];
  currentStage: ProcessingStageId | null;
  totalProgress: number;
  isProcessing: boolean;
  fileName?: string;
}

const STAGE_ICONS: Record<ProcessingStageId, React.ElementType> = {
  upload: UploadCloud,
  ocr: Eye,
  chunking: Scissors,
  embedding: Cpu,
  vector_upsert: Database,
  gap_analysis: SearchCode,
  mindmap_gen: Network,
  completed: CheckCircle2,
};

export const IngestionPipeline: React.FC<IngestionPipelineProps> = ({
  steps,
  currentStage,
  totalProgress,
  isProcessing,
  fileName,
}) => {
  return (
    <div className="atlas-glass rounded-2xl p-5 border border-[#59dad1]/25 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#59dad1]/15 border border-[#59dad1]/30 flex items-center justify-center text-[#59dad1]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              خط أنابيب المعالجة الذكية (AI Ingestion Pipeline)
              {isProcessing && (
                <span className="flex items-center gap-1 text-[10px] text-[#ffe16d] px-2 py-0.5 rounded-full bg-[#ffe16d]/10 border border-[#ffe16d]/20 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  قيد المعالجة
                </span>
              )}
            </h4>
            <p className="text-xs text-[#a2a6d0]">
              {fileName ? `الملف: ${fileName}` : 'معالجة الوثيقة وتوليد المتجهات ومطابقة المنهاج الجزائري'}
            </p>
          </div>
        </div>

        {/* Total Progress Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#a2a6d0]">الإنجاز الكلي:</span>
          <div className="font-mono text-sm font-bold text-[#59dad1] bg-[#0c123d] px-3 py-1 rounded-lg border border-[#59dad1]/30">
            {totalProgress}%
          </div>
        </div>
      </div>

      {/* Global Progress Bar */}
      <div className="w-full bg-[#0c123d] h-2 rounded-full overflow-hidden mb-6 p-[1px] border border-[#59dad1]/20">
        <motion.div
          className="h-full bg-gradient-to-r from-[#59dad1] via-[#ffe16d] to-[#4ade80] rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${totalProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Pipeline Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step, idx) => {
          const Icon = STAGE_ICONS[step.id] || Cpu;
          const isActive = currentStage === step.id;
          const isDone = step.status === 'success';
          const isError = step.status === 'error';

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`relative rounded-xl p-3.5 border transition-all ${
                isActive
                  ? 'bg-[#121c54] border-[#ffe16d] shadow-[0_0_15px_rgba(255,225,109,0.2)]'
                  : isDone
                  ? 'bg-[#0a1038]/90 border-[#59dad1]/40'
                  : isError
                  ? 'bg-rose-950/30 border-rose-500/50'
                  : 'bg-[#080d30]/60 border-white/5 opacity-60'
              }`}
            >
              {/* Step Number & Status Indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold text-[#a2a6d0]">
                  STAGE 0{idx + 1}
                </span>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-[#ffe16d] animate-spin" />
                ) : isError ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                )}
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-2.5">
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    isActive
                      ? 'bg-[#ffe16d]/20 text-[#ffe16d]'
                      : isDone
                      ? 'bg-[#59dad1]/20 text-[#59dad1]'
                      : 'bg-white/5 text-[#a2a6d0]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{step.label}</h5>
                  <p className="text-[11px] text-[#a2a6d0] line-clamp-2 mt-0.5">
                    {step.details || step.description}
                  </p>
                </div>
              </div>

              {/* Step Progress Mini bar */}
              <div className="w-full bg-[#080d30] h-1 rounded-full overflow-hidden mt-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    isDone
                      ? 'bg-[#4ade80]'
                      : isActive
                      ? 'bg-[#ffe16d]'
                      : isError
                      ? 'bg-rose-500'
                      : 'bg-white/10'
                  }`}
                  style={{ width: `${step.progress}%` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
