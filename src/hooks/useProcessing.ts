import { useState, useCallback } from 'react';
import { defaultRAGEngine, IngestionResult } from '../services/ragEngine';
import { ProcessingStep, ProcessingStageId } from '../types';

const INITIAL_STEPS: ProcessingStep[] = [
  {
    id: 'upload',
    label: 'تحميل الوثيقة أو الصورة',
    description: 'فحص صيغة الملف وتجهيز البايتات للمعالجة',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'ocr',
    label: 'المعالجة البصرية واستخراج OCR',
    description: 'قراءة النصوص العربية التاريخية والجغرافية',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'chunking',
    label: 'التجزئة الدلالية (Semantic Chunking)',
    description: 'تقطيع النص إلى فقرات مترابطة بحدود 450 حرفاً',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'embedding',
    label: 'توليد المتجهات (Embeddings v2)',
    description: 'تحويل المقاطع إلى فضاء شعاعي عالي الدقة (64D)',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'vector_upsert',
    label: 'الفهرسة والتخزين في Vector DB',
    description: 'حفظ المتجهات في قاعدة البيانات للاسترجاع الفوري',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'gap_analysis',
    label: 'مطابقة الإطار المرجعي وكشف الثغرات',
    description: 'فحص المصطلحات والشخصيات والتواريخ المقررة',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'mindmap_gen',
    label: 'توليد الشجرة الذهنية التفاعلية',
    description: 'بناء مخطط تفاعلي هرمي للدرس',
    status: 'pending',
    progress: 0,
  },
  {
    id: 'completed',
    label: 'اكتمال المعالجة والتحليل',
    description: 'المستند جاهز للاختبار والمراجعة والمطابقة',
    status: 'pending',
    progress: 0,
  },
];

export function useProcessing(userId: string = 'student-bac-2026') {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<ProcessingStageId | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [steps, setSteps] = useState<ProcessingStep[]>(INITIAL_STEPS);
  const [result, setResult] = useState<IngestionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsProcessing(false);
    setCurrentStage(null);
    setTotalProgress(0);
    setSteps(INITIAL_STEPS);
    setResult(null);
    setError(null);
  }, []);

  const processDocument = useCallback(
    async (file: File): Promise<IngestionResult | null> => {
      setIsProcessing(true);
      setError(null);
      setTotalProgress(5);
      setSteps((prev) =>
        prev.map((s, i) =>
          i === 0
            ? { ...s, status: 'processing', progress: 100 }
            : { ...s, status: 'pending', progress: 0 }
        )
      );

      try {
        const res = await defaultRAGEngine.ingestDocument(
          file,
          userId,
          (stage, progress, details) => {
            setCurrentStage(stage);
            setTotalProgress(progress);

            setSteps((prev) =>
              prev.map((s) => {
                if (s.id === stage) {
                  return {
                    ...s,
                    status: progress >= 100 ? 'success' : 'processing',
                    progress,
                    details: details || s.details,
                  };
                }
                const stageIndex = INITIAL_STEPS.findIndex((x) => x.id === stage);
                const itemIndex = INITIAL_STEPS.findIndex((x) => x.id === s.id);
                if (itemIndex < stageIndex) {
                  return { ...s, status: 'success', progress: 100 };
                }
                return s;
              })
            );
          }
        );

        setSteps((prev) =>
          prev.map((s) => ({ ...s, status: 'success', progress: 100 }))
        );
        setResult(res);
        setTotalProgress(100);
        setCurrentStage('completed');
        return res;
      } catch (err: any) {
        console.error('Ingestion Pipeline Error:', err);
        setError(err.message || 'حدث خطأ أثناء معالجة المستند');
        setSteps((prev) =>
          prev.map((s) =>
            s.id === currentStage ? { ...s, status: 'error' } : s
          )
        );
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [userId, currentStage]
  );

  return {
    isProcessing,
    currentStage,
    totalProgress,
    steps,
    result,
    error,
    processDocument,
    reset,
  };
}
