import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ScanText,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Maximize2,
  Layers,
  Sparkles,
  Search,
  Radar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { DocumentAnalysisResult } from '../../types';

interface DocumentAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  strictMode: boolean;
}

const SAMPLE_ANALYSIS: DocumentAnalysisResult = {
  title: 'تحليل وثيقة بيان أول نوفمبر 1954 وسياق تفجير الثورة التحريرية الجزائرية',
  sourceText:
    '«أيها الشعب الجزائري، أيها المناضلون من أجل القضية الوطنية... إننا نوضح أن هدفنا الأسمى هو الاستقلال الوطني بواسطة: إقامة الدولة الجزائرية الديمقراطية الاجتماعية ذات السيادة ضمن إطار المبادئ الإسلامية، واحترام جميع الحريات الأساسية دون تمييز عرقي أو ديني...» (بيان أول نوفمبر 1954، الأمانة العامة لجبهة التحرير الوطني)',
  matchScore: 92.0,
  entitiesFound: 48,
  confidence: 'HIGH',
  terms: [
    {
      term: 'بيان أول نوفمبر 1954',
      type: 'مصطلح',
      status: 'مطابق',
      referenceFrameworkMatch: true,
      definition: 'أول وثيقة سياسية وتاريخية تصدرها جبهة التحرير الوطني رسمت معالم الثورة وأهدافها وشروط التفاوض.',
    },
    {
      term: 'جبهة التحرير الوطني (FLN)',
      type: 'مصطلح',
      status: 'مطابق',
      referenceFrameworkMatch: true,
      definition: 'الجناح السياسي للثورة التحريرية الجزائرية والممثل الشرعي والوحيد للشعب الجزائري.',
    },
    {
      term: '1954 (01 نوفمبر)',
      type: 'تاريخ',
      status: 'مطابق',
      referenceFrameworkMatch: true,
      definition: 'تاريخ اندلاع الكفاح المسلح واستئناف المعركة الحاسمة لإنهاء الاستعمار الاستيطاني.',
    },
    {
      term: 'مصطفى بن بولعيد',
      type: 'علم',
      status: 'مطابق',
      referenceFrameworkMatch: true,
      definition: 'أحد مفجري الثورة وقائد المنطقة الأولى (الأوراس)، عضو مجموعة الستة والمنظمة الخاصة.',
    },
    {
      term: 'تدويل القضية الجزائرية',
      type: 'مفهوم جغرافي',
      status: 'مطابق',
      referenceFrameworkMatch: true,
      definition: 'طرح القضية الجزائرية في الجمعية العامة للأمم المتحدة ومؤتمر باندونغ 1955 لكسب الدعم الدولي.',
    },
  ],
  gapAnalysis: [
    { label: 'المصطلحات (منهاج بكالوريا الجزائر)', score: 9, total: 10, percentage: 90, color: '#59dad1' },
    { label: 'الأعلام والشخصيات', score: 4, total: 4, percentage: 100, color: '#ffe16d' },
    { label: 'التواريخ المعلمية', score: 4, total: 5, percentage: 80, color: '#4ade80' },
  ],
  recommendedLesson: 'الثورة التحريرية الكبرى (1954 - 1962): العمل المسلح وهيكلة الثورة واسترجاع السيادة',
  recommendationNote:
    'بناءً على التحليل الذكي للوثيقة، يُوصى بالتركيز على أهداف البيان الداخلية والخارجية والربط بينه وبين هجمات 20 أوت 1955 ومؤتمر الصومام 1956.',
};

export const DocumentAnalysisModal: React.FC<DocumentAnalysisModalProps> = ({
  isOpen,
  onClose,
  strictMode,
}) => {
  const [inputText, setInputText] = useState(SAMPLE_ANALYSIS.sourceText);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult>(SAMPLE_ANALYSIS);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl atlas-glass rounded-3xl border border-[#ffe16d]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ffe16d]/20 bg-[#080d3b]/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30">
              <ScanText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-serif">
                  وحدة التحليل الذكي للوثائق التاريخية والجغرافية
                </h2>
                {strictMode && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffe16d]/20 text-[#ffe16d] border border-[#ffe16d]/40">
                    الوضع الصارم مفعّل
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a2a6d0]">
                استخراج المصطلحات، الأعلام، التواريخ ومقارنتها فورياً مع الإطار المرجعي للامتحان الوطني
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#a2a6d0] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Bento Layout */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Header Stats Strip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#121743]/80 rounded-2xl p-4 border border-[#59dad1]/20">
            <div>
              <span className="text-xs text-[#59dad1] font-semibold block mb-1">
                الوثيقة قيد الفحص
              </span>
              <h3 className="text-base font-bold text-white">{analysis.title}</h3>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-[10px] text-[#a2a6d0] block">نسبة التطابق المرجعي</span>
                <span className="font-mono text-2xl font-black text-[#59dad1]">
                  {analysis.matchScore}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#a2a6d0] block">العناصر المستخرجة</span>
                <span className="font-mono text-2xl font-black text-[#ffe16d]">
                  {analysis.entitiesFound}
                </span>
              </div>
            </div>
          </div>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Extraction Feed & Mindmap (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Data Extraction Stream */}
              <div className="bg-[#080d3b]/80 rounded-2xl p-4 border border-[#ffe16d]/15">
                <h4 className="text-xs font-bold text-white flex items-center gap-2 mb-3">
                  <Radar className="w-4 h-4 text-[#59dad1]" />
                  تدفق استخراج المفاهيم والأعلام
                </h4>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {analysis.terms.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border flex items-start justify-between gap-2 text-xs transition-all ${
                        item.status === 'مفقود'
                          ? 'bg-[#ffb4ab]/10 border-[#ffb4ab]/40 animate-pulse'
                          : 'bg-[#121743] border-white/10'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-[#ffe16d]">
                            {item.type}
                          </span>
                          <strong className="text-white">{item.term}</strong>
                        </div>
                        <p className="text-[11px] text-[#a2a6d0] line-clamp-2">{item.definition}</p>
                      </div>

                      {item.status === 'مطابق' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#59dad1] shrink-0 mt-1" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-[#ffb4ab] shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mindmap Mini Preview */}
              <div className="bg-[#080d3b]/80 rounded-2xl p-4 border border-[#59dad1]/20 relative overflow-hidden group">
                <h4 className="text-xs font-bold text-white flex items-center justify-between mb-2">
                  <span>الخريطة الذهنية التفاعلية</span>
                  <span className="text-[10px] text-[#59dad1]">توليد تلقائي للروابط</span>
                </h4>

                {/* SVG Graphic Map */}
                <div className="relative h-32 w-full bg-[#040736] rounded-xl flex items-center justify-center border border-white/5">
                  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none">
                    <line x1="100" y1="100" x2="50" y2="40" stroke="#ffe16d" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="100" y1="100" x2="150" y2="40" stroke="#ffe16d" strokeWidth="2" strokeDasharray="3 3" />
                    <line x1="100" y1="100" x2="100" y2="30" stroke="#59dad1" strokeWidth="2" />
                    <circle cx="100" cy="100" r="12" fill="#1c2357" stroke="#ffe16d" strokeWidth="2" />
                    <circle cx="50" cy="40" r="8" fill="#0e1442" stroke="#59dad1" strokeWidth="1.5" />
                    <circle cx="150" cy="40" r="8" fill="#0e1442" stroke="#59dad1" strokeWidth="1.5" />
                    <circle cx="100" cy="30" r="8" fill="#0e1442" stroke="#ffe16d" strokeWidth="1.5" />
                  </svg>
                  <span className="absolute bottom-2 text-[10px] text-[#a2a6d0]">
                    اضغط لتوسيع شجرة العلاقات التاريخية
                  </span>
                </div>
              </div>
            </div>

            {/* Center Column: Interactive Text Editor & HUD (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#080d3b]/90 rounded-2xl p-4 border border-[#ffe16d]/20 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#ffe16d]" />
                    نص الوثيقة التاريخية / الجغرافية
                  </label>
                  <span className="text-[10px] text-[#a2a6d0]">يدعم نسخ نصوص الامتحانات</span>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  className="w-full flex-1 p-3 rounded-xl bg-[#040736] border border-white/10 text-xs text-[#dfe0ff] focus:outline-none focus:border-[#ffe16d] resize-none leading-relaxed font-serif"
                  placeholder="ألصق نص الوثيقة التاريخية أو الجدول الجغرافي هنا للتحليل والمقارنة..."
                />

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                  <span className="text-[11px] text-[#a2a6d0]">
                    النموذج: <strong className="text-[#59dad1]">Gemini 3.7 Flash RAG</strong>
                  </span>

                  <button
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffe16d] to-[#ffdb3c] text-[#3a3000] text-xs font-bold shadow-[0_0_15px_rgba(255,225,109,0.3)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>{isAnalyzing ? 'جاري التحليل والمطابقة...' : 'إعادة التحليل الذكي'}</span>
                  </button>
                </div>
              </div>

              {/* HUD Core Radar */}
              <div className="bg-[#080d3b]/80 rounded-2xl p-4 border border-[#59dad1]/20 flex items-center justify-around">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#59dad1]/40 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border border-[#ffe16d]/40 animate-[spin_6s_linear_infinite_reverse]" />
                  <div className="w-14 h-14 rounded-full bg-[#121743] flex flex-col items-center justify-center shadow-[0_0_15px_rgba(255,225,109,0.3)]">
                    <Radar className="w-4 h-4 text-[#ffe16d] animate-pulse" />
                    <span className="text-[9px] font-mono font-bold text-white">87%</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[#a2a6d0]">
                    مستوى الثقة: <strong className="text-[#59dad1] font-mono">HIGH (عالي)</strong>
                  </div>
                  <div className="text-[#a2a6d0]">
                    التوافق المرجعي: <strong className="text-[#ffe16d] font-mono">87.5%</strong>
                  </div>
                  <div className="text-[#a2a6d0]">
                    الزمن المستغرق: <strong className="text-white font-mono">0.34s</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Gap Analysis & Recommendations (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Gap Analysis Bars */}
              <div className="bg-[#080d3b]/80 rounded-2xl p-4 border border-[#ffe16d]/20">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-3">
                  <ShieldCheck className="w-4 h-4 text-[#ffe16d]" />
                  تحليل الفجوات المعرفية
                </h4>

                <div className="space-y-3">
                  {analysis.gapAnalysis.map((gap, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#dfe0ff]">{gap.label}</span>
                        <span className="font-mono font-bold text-white">
                          {gap.score}/{gap.total}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#040736] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${gap.percentage}%`,
                            backgroundColor: gap.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation Action Card */}
              <div className="bg-gradient-to-br from-[#1c2357] to-[#080d3b] rounded-2xl p-4 border border-[#ffe16d]/30 space-y-3">
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#ffe16d]/20 text-[#ffe16d] font-bold">
                  توجيه بيداغوجي ذكي
                </span>
                <p className="text-xs text-[#dfe0ff] leading-relaxed">
                  {analysis.recommendationNote}
                </p>

                <button
                  onClick={onClose}
                  className="w-full py-2 rounded-xl bg-[#ffe16d] text-[#3a3000] font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_12px_rgba(255,225,109,0.3)] hover:scale-102 transition-transform cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>فتح درس الحماية الآن</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
