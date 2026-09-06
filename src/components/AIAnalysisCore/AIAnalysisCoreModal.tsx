import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  X,
  UploadCloud,
  FileText,
  Cpu,
  Brain,
  Shield,
  Layers,
  Search,
  Send,
  Loader2,
  CheckCircle2,
  RefreshCw,
  Zap,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

// Subcomponents
import { NetworkCanvas } from '../NeuralBackground/NetworkCanvas';
import { DataPackets } from '../NeuralBackground/DataPackets';
import { HUDRings } from '../NeuralBackground/HUDRings';
import { IngestionPipeline } from '../ProcessingCore/IngestionPipeline';
import { ConceptExtractor } from '../ProcessingCore/ConceptExtractor';
import { CategoryBuckets } from '../ProcessingCore/CategoryBuckets';
import { ComparisonBars } from '../GapAnalysis/ComparisonBars';
import { MissingItems } from '../GapAnalysis/MissingItems';
import { GapReport } from '../GapAnalysis/GapReport';
import { ModeToggle } from '../StrictMode/ModeToggle';
import { LockOverlay } from '../StrictMode/LockOverlay';
import { KnowledgeSeal } from '../StrictMode/KnowledgeSeal';
import { GrowingTree } from '../MindmapPreview/GrowingTree';

// Hooks & Types
import { useProcessing } from '../../hooks/useProcessing';
import { useRAG } from '../../hooks/useRAG';
import { useGapAnalysis } from '../../hooks/useGapAnalysis';
import { ExtractedConceptItem } from '../../types';

interface AIAnalysisCoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLearningSpace?: () => void;
  initialStrictMode?: boolean;
}

const PRESET_SAMPLE_FILES = [
  {
    name: 'ملخص_الثورة_التحريرية_1954_1962.txt',
    title: 'الثورة التحريرية ومؤتمر الصومام (تاريخ)',
    category: 'history',
    size: '14.2 KB',
    sampleText: `ملخص مادة التاريخ - بكالوريا الجزائر:
1. اندلاع الثورة التحريرية: بيان أول نوفمبر 1954 وثيقة مرجعية حددت الاستقلال واسترجاع السيادة الوطنية.
2. المحطات الكبرى: هجمات الشمال القسنطيني 20 أوت 1955 بقيادة زيغود يوسف لفك الحصار عن الأوراس.
3. مؤتمر الصومام 20 أوت 1956 بقرية إيفري: هيكلة الثورة وإنشاء CNRA و CCE وتقسيم الوطن لـ 6 ولايات تاريخية.
4. الأعلام المؤسسون: مصطفى بن بولعيد، العربي بن مهيدي، ديدوش مراد، وكريم بلقاسم.
5. استراتيجيات الاستعمار: خطي شال وموريس المكهربين والمحتشدات.`,
  },
  {
    name: 'ملخص_الجغرافيا_اسواق_الطاقة_IDH.txt',
    title: 'إشكالية التقدم وأسواق البترول وأمريكا (جغرافيا)',
    category: 'geography',
    size: '12.8 KB',
    sampleText: `ملخص مادة الجغرافيا - بكالوريا الجزائر:
1. إشكالية التقدم والتخلف: تصنيف الدول وفق مؤشر التنمية البشرية IDH (أمد الحياة، التمدرس، الدخل الفردي).
2. أسواق الطاقة: البترول والغاز عصب الاقتصاد ودور منظمة الدول المصدرة للبترول OPEC (بغداد 1960).
3. القوة الاقتصادية الأمريكية: المركب الفلاحي الصناعي Agrobusiness، السلاح الأخضر وتفوق أقاليم حزام الشمس Sun Belt وسيليكون فالي.`,
  },
  {
    name: 'مسودة_تلميذ_غير_مكتملة_ثغرات.txt',
    title: 'مسودة غير مكتملة (اختبار كشف الثغرات المعرفية)',
    category: 'mixed',
    size: '8.4 KB',
    sampleText: `مراجعة عامة:
الحرب الباردة بين المعسكرين الغربي والشرقي، وتقديم مشروع مارشال ومبدأ ترومان.
كما توجد منظمة أوبك في فيينا لحماية البترول. (الملخص يفتقد لبيان نوفمبر ومؤتمر الصومام وبن بولعيد).`,
  },
];

export const AIAnalysisCoreModal: React.FC<AIAnalysisCoreModalProps> = ({
  isOpen,
  onClose,
  onOpenLearningSpace,
  initialStrictMode = true,
}) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'mindmap' | 'gaps' | 'rag_tester'>('pipeline');
  const [customText, setCustomText] = useState('');
  const [testQuery, setTestQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Processing Hook
  const {
    isProcessing,
    currentStage,
    totalProgress,
    steps,
    result,
    processDocument,
    reset,
  } = useProcessing('student-bac-2026');

  // RAG Hook
  const {
    ask,
    isQuerying,
    lastResponse,
    ragMode,
    setRagMode,
    toggleMode,
  } = useRAG('student-bac-2026');

  // Gap Analysis Hook
  const {
    report,
    resolvedItemIds,
    toggleResolved,
    effectiveScore,
  } = useGapAnalysis(result?.gapReport || null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    await processDocument(file);
  };

  const handleLoadPreset = async (preset: (typeof PRESET_SAMPLE_FILES)[0]) => {
    const file = new File([preset.sampleText], preset.name, { type: 'text/plain' });
    await processDocument(file);
  };

  const handleProcessCustomText = async () => {
    if (!customText.trim()) return;
    const file = new File([customText], 'ملخص_الطالب_المباشر.txt', { type: 'text/plain' });
    await processDocument(file);
  };

  const handleRunRAGQuery = async () => {
    if (!testQuery.trim()) return;
    await ask(testQuery);
  };

  const activeReport = result?.gapReport || report;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-6xl h-[92vh] bg-[#020617] rounded-3xl border border-[#59dad1]/30 shadow-[0_0_50px_rgba(89,218,209,0.2)] flex flex-col overflow-hidden text-[#dfe0ff]"
      >
        {/* Background Neural Canvas & Ambient HUD */}
        <NetworkCanvas intensity={0.8} />
        <DataPackets packetCount={5} />

        {/* Top Control Bar */}
        <div className="relative z-10 px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#080d3b]/85 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#59dad1] to-[#ffe16d] p-[2px] shadow-[0_0_15px_rgba(89,218,209,0.4)]">
              <div className="w-full h-full bg-[#080d3b] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-[#59dad1]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                  نواة التحليل الذكي للوثائق والمطابقة (AI Analysis Core)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#59dad1]/15 text-[#59dad1] font-mono border border-[#59dad1]/30 font-bold hidden sm:inline-block">
                  RAG DZ v2.0
                </span>
              </div>
              <p className="text-xs text-[#a2a6d0]">
                المطابقة المعيارية الصارمة مع الإطار المرجعي لوزارة التربية الوطنية الجزائرية (باك 2026)
              </p>
            </div>
          </div>

          {/* Navigation Controls & Close */}
          <div className="flex items-center gap-3">
            {/* Strict Mode Quick Indicator */}
            <div className="flex items-center gap-2 bg-[#0d1445] px-3 py-1.5 rounded-xl border border-[#ffe16d]/30">
              <Shield className="w-4 h-4 text-[#ffe16d]" />
              <span className="text-xs font-bold text-white hidden md:inline">
                {ragMode === 'strict' ? 'الوضع الصارم: 100%' : 'الوضع المدمج'}
              </span>
              <button
                onClick={toggleMode}
                className="text-[10px] text-[#ffe16d] underline font-bold cursor-pointer"
              >
                تبديل
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#a2a6d0] hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="relative z-10 px-5 py-2.5 bg-[#050926]/90 border-b border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-[#59dad1] text-[#080d3b] shadow-md shadow-[#59dad1]/20'
                  : 'bg-[#0a0f38] text-[#a2a6d0] hover:text-white border border-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              المعالجة والاستخلاص (Pipeline)
            </button>

            <button
              onClick={() => setActiveTab('gaps')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'gaps'
                  ? 'bg-[#ffe16d] text-[#080d3b] shadow-md shadow-[#ffe16d]/20'
                  : 'bg-[#0a0f38] text-[#a2a6d0] hover:text-white border border-white/5'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              كشف الثغرات والتقرير (Gap Analysis)
              {activeReport && activeReport.missingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('mindmap')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'mindmap'
                  ? 'bg-[#4ade80] text-[#080d3b] shadow-md shadow-[#4ade80]/20'
                  : 'bg-[#0a0f38] text-[#a2a6d0] hover:text-white border border-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              الشجرة الذهنية (Mindmap)
            </button>

            <button
              onClick={() => setActiveTab('rag_tester')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'rag_tester'
                  ? 'bg-[#a78bfa] text-[#080d3b] shadow-md shadow-[#a78bfa]/20'
                  : 'bg-[#0a0f38] text-[#a2a6d0] hover:text-white border border-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              مختبر الاسترجاع (RAG Studio)
            </button>
          </div>

          {result && (
            <span className="text-[11px] text-[#4ade80] font-mono flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {result.vectorsCount} مقاطع مفهرسة في Vector DB
            </span>
          )}
        </div>

        {/* Modal Main Body Content */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          {/* Preset Quick Loader Strip */}
          {!result && !isProcessing && (
            <div className="atlas-glass rounded-2xl p-4 border border-[#59dad1]/20">
              <span className="text-xs font-bold text-white block mb-2">
                ⚡ اختر نموذجاً جاهزاً لتجربة المحرك الفورية:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PRESET_SAMPLE_FILES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleLoadPreset(preset)}
                    className="p-3 rounded-xl bg-[#090f38] hover:bg-[#121c54] border border-white/10 hover:border-[#59dad1]/50 text-right transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono text-[#59dad1]">
                        {preset.category === 'history' ? 'تاريخ' : preset.category === 'geography' ? 'جغرافيا' : 'اختبار ثغرات'}
                      </span>
                      <span className="text-[10px] text-[#a2a6d0]">{preset.size}</span>
                    </div>
                    <h5 className="text-xs font-bold text-white group-hover:text-[#ffe16d]">
                      {preset.title}
                    </h5>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 1: Pipeline & Extraction */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              {/* Document Ingestion Pipeline Status */}
              <IngestionPipeline
                steps={steps}
                currentStage={currentStage}
                totalProgress={totalProgress}
                isProcessing={isProcessing}
                fileName={result?.file.name}
              />

              {/* Upload Dropzone & Direct Text Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Upload Card */}
                <div className="atlas-glass rounded-2xl p-5 border border-dashed border-[#59dad1]/40 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    accept="image/*,text/*,application/pdf"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-[#59dad1]/15 text-[#59dad1] flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    اسحب وأفلت ملخصك الشخصي أو الصورة هنا
                  </h4>
                  <p className="text-xs text-[#a2a6d0] max-w-sm mb-4">
                    يدعم صور دفاتر التلخيص (OCR)، ملفات PDF، والنصوص البرمجية (.txt / .md)
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-[#59dad1] hover:bg-[#59dad1]/90 text-[#080d3b] font-black text-xs transition-all shadow-md shadow-[#59dad1]/20 cursor-pointer disabled:opacity-50"
                  >
                    اختيار ملف من جهازك
                  </button>
                </div>

                {/* Direct Text Input Card */}
                <div className="atlas-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-[#ffe16d]" />
                      أو الصق نص الملخص مباشرة:
                    </h4>
                    <textarea
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="اكتب أو الصق نص الملخص لمطابقته مع الإطار المرجعي الجزائري..."
                      rows={4}
                      className="w-full bg-[#060b2b] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-[#6b729f] focus:outline-none focus:border-[#ffe16d] resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/10">
                    <span className="text-[11px] text-[#a2a6d0]">
                      {customText.length} حرفاً
                    </span>
                    <button
                      onClick={handleProcessCustomText}
                      disabled={isProcessing || !customText.trim()}
                      className="px-4 py-1.5 rounded-xl bg-[#ffe16d] hover:bg-[#ffe16d]/90 text-[#3a3000] font-black text-xs transition-all cursor-pointer disabled:opacity-40"
                    >
                      تحليل النص ومطابقته
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Extracted Concepts & Category Buckets */}
              {result && (
                <div className="space-y-6">
                  <ConceptExtractor concepts={result.concepts} />
                  <CategoryBuckets concepts={result.concepts} />
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Gap Analysis & Report */}
          {activeTab === 'gaps' && (
            <div className="space-y-6">
              {activeReport ? (
                <>
                  <GapReport
                    report={activeReport}
                    onOpenLearningSpace={onOpenLearningSpace}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ComparisonBars metrics={activeReport.metrics} />
                    <MissingItems
                      missingItems={activeReport.missingItems}
                      resolvedItemIds={resolvedItemIds}
                      onToggleResolved={toggleResolved}
                    />
                  </div>
                </>
              ) : (
                <div className="atlas-glass rounded-2xl p-12 text-center border border-white/10">
                  <Shield className="w-10 h-10 text-[#ffe16d] mx-auto mb-3 opacity-60" />
                  <h4 className="text-sm font-bold text-white mb-1">
                    لم يتم تنفيذ تحليل الثغرات بعد
                  </h4>
                  <p className="text-xs text-[#a2a6d0] max-w-md mx-auto mb-4">
                    قم برفع ملخصك في تبويب "المعالجة" ليقوم المحرك بمطابقته وكشف المفاهيم الناقصة.
                  </p>
                  <button
                    onClick={() => setActiveTab('pipeline')}
                    className="px-4 py-2 rounded-xl bg-[#59dad1] text-[#080d3b] font-bold text-xs cursor-pointer"
                  >
                    الانتقال للمعالجة والتحليل ←
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Mindmap Visualization */}
          {activeTab === 'mindmap' && (
            <div className="space-y-6">
              {result?.mindmapTree ? (
                <GrowingTree data={result.mindmapTree} />
              ) : (
                <div className="atlas-glass rounded-2xl p-12 text-center border border-white/10">
                  <Layers className="w-10 h-10 text-[#4ade80] mx-auto mb-3 opacity-60" />
                  <h4 className="text-sm font-bold text-white mb-1">
                    الشجرة الذهنية تتطلب معالجة ملف أولاً
                  </h4>
                  <p className="text-xs text-[#a2a6d0] max-w-md mx-auto mb-4">
                    بمجرد تحليل النص، سيتم بناء هيكل الشجرة الذهنية التفاعلي وتفريعاته تلقائياً.
                  </p>
                  <button
                    onClick={() => handleLoadPreset(PRESET_SAMPLE_FILES[0])}
                    className="px-4 py-2 rounded-xl bg-[#4ade80] text-[#080d3b] font-bold text-xs cursor-pointer"
                  >
                    تحميل نموذج الثورة التحريرية لتوليد الشجرة
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: RAG Tester Studio */}
          {activeTab === 'rag_tester' && (
            <div className="space-y-6">
              {/* Strict Mode Switcher Banner */}
              <ModeToggle strictMode={ragMode === 'strict'} onToggle={toggleMode} />

              {/* RAG Query Input */}
              <div className="atlas-glass rounded-2xl p-5 border border-[#a78bfa]/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#a78bfa]" />
                    استجواب محرك RAG المعتمد (Strict Retrieval Query)
                  </h4>
                  <span className="text-xs text-[#a2a6d0]">
                    درجة الحرارة: {ragMode === 'strict' ? '0.0 (حصر تام)' : '0.7 (توليدي)'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRunRAGQuery()}
                    placeholder="اطرح سؤالاً عن مؤتمر الصومام، منظمة أوبك، أو بيان أول نوفمبر..."
                    className="flex-1 bg-[#070b2b] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-[#6b729f] focus:outline-none focus:border-[#a78bfa]"
                  />
                  <button
                    onClick={handleRunRAGQuery}
                    disabled={isQuerying || !testQuery.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#a78bfa] hover:bg-[#a78bfa]/90 text-[#080d3b] font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isQuerying ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    استرجاع الإجابة
                  </button>
                </div>

                {/* Sample Preset Queries */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#a2a6d0]">أسئلة سريعة:</span>
                  {[
                    'ما هي القرارات السياسية لمؤتمر الصومام 1956؟',
                    'ما المقصود بمؤشر التنمية البشرية IDH؟',
                    'من هو الشهيد مصطفى بن بولعيد وما دوره؟',
                    'ما هي استراتيجيات المعسكر الغربي في الحرب الباردة؟',
                  ].map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTestQuery(q);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-[#0c1240] hover:bg-[#151f5c] text-[#dfe0ff] border border-white/5 transition-colors cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* RAG Response Viewer */}
              {lastResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="atlas-glass rounded-2xl p-5 border border-[#59dad1]/30 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#ffe16d]" />
                      <h5 className="text-xs font-bold text-white">إجابة المحرك المسترجعة</h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#59dad1]/15 text-[#59dad1] border border-[#59dad1]/30">
                      دقة الاسترجاع: {Math.round(lastResponse.confidence * 100)}%
                    </span>
                  </div>

                  <p className="text-xs text-white leading-relaxed whitespace-pre-line bg-[#060b2b] p-4 rounded-xl border border-white/5">
                    {lastResponse.answer}
                  </p>

                  {/* Citations & Concepts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#090f38] border border-white/5">
                      <span className="text-[10px] text-[#a2a6d0] block mb-1">المراجع والاقتباسات:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {lastResponse.citations.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {lastResponse.recommendedAction && (
                      <div className="p-3 rounded-xl bg-[#090f38] border border-white/5">
                        <span className="text-[10px] text-[#59dad1] block mb-1">
                          الإجراء البيداغوجي المقترح:
                        </span>
                        <p className="text-[11px] text-[#dfe0ff]">
                          {lastResponse.recommendedAction}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
