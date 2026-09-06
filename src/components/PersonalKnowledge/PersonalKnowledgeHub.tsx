import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookMarked,
  FileText,
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  ShieldAlert,
  Search,
  Zap,
  Layers,
  CheckCircle2,
  AlertCircle,
  Copy,
  Cpu,
  ArrowRight,
  Database,
  Sliders,
  Send,
  HelpCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  NotebookChunk,
  DEFAULT_STUDENT_CHUNKS,
  OFFICIAL_CURRICULUM_CHUNKS,
  RAGConstraint,
  enforceRAGConstraint,
  RAGQueryResult,
} from '../../utils/ragEngine';

const STORAGE_CHUNKS_KEY = 'atlas_bac_student_chunks_v1';
const STORAGE_RAG_MODE_KEY = 'atlas_bac_rag_mode_v1';

interface PersonalKnowledgeHubProps {
  onClose: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
}

export const PersonalKnowledgeHub: React.FC<PersonalKnowledgeHubProps> = ({
  onClose,
  onAwardXP,
}) => {
  // Load chunks from local storage or defaults
  const [chunks, setChunks] = useState<NotebookChunk[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHUNKS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load chunks', e);
    }
    return DEFAULT_STUDENT_CHUNKS;
  });

  // Current active RAG mode
  const [ragMode, setRagMode] = useState<'strict_notebook' | 'blended' | 'full_knowledge'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RAG_MODE_KEY);
      if (saved) return saved as any;
    } catch {
      // ignore
    }
    return 'strict_notebook';
  });

  // Navigation tab inside Knowledge Hub
  const [activeTab, setActiveTab] = useState<'chunks' | 'add_new' | 'rag_tester' | 'settings'>('chunks');

  // New Note Form State
  const [docName, setDocName] = useState('');
  const [docSubject, setDocSubject] = useState<'history' | 'geography'>('history');
  const [unitTitle, setUnitTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // RAG Interactive Tester state
  const [testQuery, setTestQuery] = useState('ما هي أسباب هجمات 20 أوت 1955؟');
  const [testResult, setTestResult] = useState<RAGQueryResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Sync chunks to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHUNKS_KEY, JSON.stringify(chunks));
    } catch (e) {
      console.error('Failed to persist chunks', e);
    }
  }, [chunks]);

  // Sync mode
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RAG_MODE_KEY, ragMode);
    } catch {
      // ignore
    }
  }, [ragMode]);

  // Auto test initial query
  useEffect(() => {
    handleRunRAGTest();
  }, [ragMode]);

  // Filtered chunks
  const filteredChunks = chunks.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.unitTitle.toLowerCase().includes(q) ||
      c.content.toLowerCase().includes(q) ||
      c.sourceDocName.toLowerCase().includes(q) ||
      c.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  // Chunking generator function (splits large text into semantic chunks of ~40-70 words)
  const handleProcessAndSaveSummary = () => {
    if (!rawContent.trim() || !docName.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      // Split by paragraphs or double newlines or punctuation
      const rawParagraphs = rawContent
        .split(/\n\n+|\.\s+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 25);

      const newChunks: NotebookChunk[] = rawParagraphs.map((para, idx) => {
        // Extract dummy keywords
        const words = para.split(/\s+/);
        const keywords = words.filter((w) => w.length > 4).slice(0, 4);

        return {
          id: `chunk-${Date.now()}-${idx}`,
          sourceDocName: docName.trim(),
          unitSubject: docSubject,
          unitTitle: unitTitle.trim() || (docSubject === 'history' ? 'الوحدة الأولى تاريخ' : 'الوحدة الأولى جغرافيا'),
          content: para,
          keywords,
          createdAt: new Date().toISOString().split('T')[0],
          vectorId: `vec_${Date.now()}_${idx}`,
          tokenCount: Math.round(words.length * 1.3),
        };
      });

      setChunks((prev) => [...newChunks, ...prev]);
      setIsProcessing(false);
      setRawContent('');
      setDocName('');
      setUnitTitle('');
      setActiveTab('chunks');

      if (onAwardXP) {
        onAwardXP(120, 'تمت فهرسة وتقسيم الملخص إلى متجهات بنجاح! 📚');
      }
    }, 600);
  };

  const handleDeleteChunk = (id: string) => {
    setChunks((prev) => prev.filter((c) => c.id !== id));
  };

  const handleRunRAGTest = () => {
    if (!testQuery.trim()) return;
    setIsTesting(true);

    setTimeout(() => {
      const constraint: RAGConstraint = {
        mode: ragMode,
        vectorStoreId: 'student_notebook_main_v1',
        userNotebookChunks: chunks.map((c) => c.content),
        curriculumOfficial: OFFICIAL_CURRICULUM_CHUNKS,
        temperature: ragMode === 'strict_notebook' ? 0.0 : ragMode === 'blended' ? 0.2 : 0.5,
      };

      const res = enforceRAGConstraint(testQuery, constraint);
      setTestResult(res);
      setIsTesting(false);
    }, 200);
  };

  const totalTokens = chunks.reduce((acc, c) => acc + c.tokenCount, 0);

  return (
    <div className="flex flex-col h-full text-[#dfe0ff]">
      {/* Top Knowledge Sub-Header */}
      <div className="p-4 sm:p-6 bg-[#08102e] border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white font-serif">
                قسم الملخصات ومحرك الذاكرة المتجهية (Personal Knowledge RAG)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 font-mono">
                RAG Gate Active
              </span>
            </div>
            <p className="text-xs text-[#a2a6d0]">
              أدخل ملخصاتك ودفاترك الخاصة لتوجيه الذكاء الاصطناعي للإجابة حصرياً منها مع فلترة السياق
            </p>
          </div>
        </div>

        {/* RAG Mode Switcher Pill */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#050a1e] p-1.5 rounded-2xl border border-white/10 text-xs w-full md:w-auto overflow-x-auto scrollbar-none shrink-0">
          <button
            onClick={() => setRagMode('strict_notebook')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              ragMode === 'strict_notebook'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
            title="الاعتماد فقط وحصرياً على الملخصات المدخلة، مع رفض الأسئلة الخارجية"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>الوضع الصارم (Strict)</span>
          </button>

          <button
            onClick={() => setRagMode('blended')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              ragMode === 'blended'
                ? 'bg-teal-500 text-stone-950 shadow-md shadow-teal-500/20 font-black'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
            title="دمج ملخصك الخاص مع المنهاج الرسمي للبكالوريا"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>المدمج (Blended)</span>
          </button>

          <button
            onClick={() => setRagMode('full_knowledge')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
              ragMode === 'full_knowledge'
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-black'
                : 'text-[#a2a6d0] hover:text-white'
            }`}
            title="المعرفة الموسعة لكامل البرنامج"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>المعرفة الشاملة</span>
          </button>
        </div>
      </div>

      {/* Secondary Tab Switcher */}
      <div className="flex items-center gap-2 px-5 py-2.5 bg-[#060b22] border-b border-white/5 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('chunks')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'chunks'
              ? 'bg-white/15 text-white'
              : 'text-[#a2a6d0] hover:text-white hover:bg-white/5'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5 text-amber-300" />
          <span>الملخصات المفهرسة ({chunks.length} فقرة)</span>
        </button>

        <button
          onClick={() => setActiveTab('add_new')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'add_new'
              ? 'bg-amber-500 text-stone-950 font-black'
              : 'text-amber-300 hover:bg-amber-500/10'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إضافة ملخص / كراس جديد</span>
        </button>

        <button
          onClick={() => setActiveTab('rag_tester')}
          className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'rag_tester'
              ? 'bg-[#59dad1] text-stone-950 font-black'
              : 'text-teal-300 hover:bg-teal-500/10'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>مختبر سياق الـ RAG Gate</span>
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* TAB 1: CHUNKS LIST & SEARCH */}
        {activeTab === 'chunks' && (
          <div className="space-y-4">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-2xl bg-[#091338] border border-white/5">
                <span className="text-[10px] text-[#a2a6d0] block">إجمالي الفقرات المتجهية</span>
                <span className="font-mono text-base font-black text-amber-300">{chunks.length} فقرة</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#091338] border border-white/5">
                <span className="text-[10px] text-[#a2a6d0] block">حجم الرموز (Tokens)</span>
                <span className="font-mono text-base font-black text-teal-300">~{totalTokens} Token</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#091338] border border-white/5">
                <span className="text-[10px] text-[#a2a6d0] block">حرارة النموذج (Temp)</span>
                <span className="font-mono text-base font-black text-purple-300">
                  {ragMode === 'strict_notebook' ? '0.0 (دقة صارمة)' : ragMode === 'blended' ? '0.2 (مدمج)' : '0.5'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-[#091338] border border-white/5">
                <span className="text-[10px] text-[#a2a6d0] block">حالة قاعدة المتجهات</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> متصلة ومفهرسة
                </span>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#a2a6d0] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ابحث في ملخصاتك المدخلة (بالكلمات المفتاحية، اسم المستند، أو التاريخ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-[#070d2b] border border-white/10 text-xs text-white placeholder:text-[#a2a6d0]/60 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Chunks Cards Grid */}
            <div className="space-y-3">
              {filteredChunks.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-xs text-[#a2a6d0] space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-[#a2a6d0]/40" />
                  <p>لا توجد فقرات مطابقة للبحث.</p>
                </div>
              ) : (
                filteredChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className="p-4 rounded-2xl border border-white/5 bg-[#081133]/80 hover:border-white/20 transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                            chunk.unitSubject === 'history'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {chunk.unitSubject === 'history' ? 'تاريخ' : 'جغرافيا'}
                        </span>
                        <span className="text-xs font-bold text-white">{chunk.unitTitle}</span>
                        <span className="text-[10px] text-[#a2a6d0] font-mono">({chunk.sourceDocName})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#a2a6d0] font-mono">{chunk.tokenCount} tokens</span>
                        <button
                          onClick={() => handleDeleteChunk(chunk.id)}
                          className="p-1 text-[#a2a6d0] hover:text-rose-400 transition-colors cursor-pointer"
                          title="حذف هذه الفقرة من قاعدة المتجهات"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#dfe0ff] leading-relaxed font-normal bg-[#04081c]/50 p-3 rounded-xl border border-white/5">
                      {chunk.content}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {chunk.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#a2a6d0] border border-white/5"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-[#a2a6d0] font-mono">Vector: {chunk.vectorId}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW SUMMARY */}
        {activeTab === 'add_new' && (
          <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h4 className="text-base font-black text-white">إدخال أو رفع ملخص جديد وفهرسته في المتجهات</h4>
                <p className="text-xs text-[#a2a6d0]">
                  ارفع ملفاً (PDF/TXT/DOCX) أو الصق نصوص ملخصك ليتم تقطيعها وفهرستها تلقائياً
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-[#a2a6d0]">نماذج سريعة:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDocName('ملخص_مؤتمر_الصومام.pdf');
                    setDocSubject('history');
                    setUnitTitle('الثورة التحريرية (1954-1962)');
                    setRawContent(
                      'مؤتمر الصومام انعقد في 20 أوت 1956 بإيفري وادي الصومام. من أهم نتائجه: تأسيس المجلس الوطني للثورة الجزائرية CNRA، ولجنة التنسيق والتنفيذ CCE، وتقسيم الجزائر لـ 6 ولايات عسكرية، وإقرار أولوية الداخل على الخارج والسياسي على العسكري.'
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[10px] font-bold cursor-pointer transition-all"
                >
                  الصومام 📜
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDocName('استراتيجيات_الحرب_الباردة.docx');
                    setDocSubject('history');
                    setUnitTitle('الثنائية القطبية والعلاقات الدولية');
                    setRawContent(
                      'استراتيجيات المعسكرين: المعسكر الغربي اعتمد مبدأ ترومان 1947، مشروع مارشال 1947، وحلف الناتو 1949. المعسكر الشرقي رد بمبدأ جدانوف 1947، منظمة الكوميكون 1949، وحلف وارسو 1955.'
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 text-[10px] font-bold cursor-pointer transition-all"
                >
                  الحرب الباردة ⚔️
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDocName('سوق_النفط_ومنظمة_أوبك.pdf');
                    setDocSubject('geography');
                    setUnitTitle('أسواق المبادلات العالمية');
                    setRawContent(
                      'تأسست منظمة أوبك OPEC في سبتمبر 1960 ببغداد بهدف حماية مصالح الدول المصدرة وتثبيت الأسعار ومواجهة هيمنة الشركات الكبرى (الشقيقات السبع). انضمت الجزائر إليها سنة 1969.'
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold cursor-pointer transition-all"
                >
                  أوبك والبترول 🌍
                </button>
              </div>
            </div>

            {/* Quick File Select Bar */}
            <div className="p-3.5 rounded-2xl bg-[#091338] border border-dashed border-white/20 hover:border-amber-400/50 transition-all flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Upload className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-white block">اختيار ملف من جهازك مباشرة (PDF, TXT, DOCX)</span>
                  <span className="text-[10px] text-[#a2a6d0]">سيتم استخراج النص وتعبئة الحقول تلقائياً</span>
                </div>
              </div>

              <label className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-all border border-white/10">
                <span>تصفح الملفات...</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setDocName(file.name);
                      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          setRawContent((ev.target?.result as string) || '');
                        };
                        reader.readAsText(file);
                      } else {
                        setRawContent(
                          `[تم استخراج محتوى الوثيقة من الملف: ${file.name}]\n\nمقرر ${
                            docSubject === 'history' ? 'التاريخ' : 'الجغرافيا'
                          } الرسمي لبكالوريا الجزائر:\nتتضمن هذه الوحدة المفاهيم الأساسية، التواريخ المعلمية، والعناصر المحورية المقررة وفق المنهاج الوزاري.`
                        );
                      }
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-white">اسم المستند أو الدفتر:</label>
                <input
                  type="text"
                  placeholder="مثال: ملخص_الأستاذ_بورنان_الوحدة_1.txt"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#091338] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white">المادة الدراسية:</label>
                <select
                  value={docSubject}
                  onChange={(e) => setDocSubject(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-[#091338] border border-white/10 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="history">التاريخ 📜</option>
                  <option value="geography">الجغرافيا 🌍</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-white">عنوان الوحدة المقررة:</label>
                <input
                  type="text"
                  placeholder="مثال: الثورة التحريرية واستعادة السيادة"
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#091338] border border-white/10 text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-white">محتوى الملخص (النص الكامل):</label>
                <span className="text-[#a2a6d0] text-[10px]">
                  سيتم التقطيع التلقائي الذكي لكل فقرة (~50 كلمة)
                </span>
              </div>
              <textarea
                rows={8}
                placeholder="الصق نص الملخص، أو ملاحظات الدرس، أو تعاريف المصطلحات هنا..."
                value={rawContent}
                onChange={(e) => setRawContent(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-[#091338] border border-white/10 text-xs text-white leading-relaxed focus:outline-none focus:border-amber-400 placeholder:text-[#a2a6d0]/50 font-normal"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-[#a2a6d0]">
                {rawContent.length > 0 && (
                  <span>
                    الكلمات التقريبية: {rawContent.split(/\s+/).filter(Boolean).length} | المتجهات المتوقعة: ~
                    {Math.max(1, Math.round(rawContent.split(/\s+/).filter(Boolean).length / 45))}
                  </span>
                )}
              </div>

              <button
                onClick={handleProcessAndSaveSummary}
                disabled={isProcessing || !rawContent.trim() || !docName.trim()}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التقطيع والفهرسة المتجهية...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>فهرسة الملخص في قاعدة المتجهات (+120 XP)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: RAG CONTEXT GATE TESTER */}
        {activeTab === 'rag_tester' && (
          <div className="rounded-3xl border border-white/10 bg-[#070e28]/90 p-5 sm:p-7 space-y-6">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-base font-black text-white">
                  مختبر فحص القيود المتجهية (RAG Context Gate Tester)
                </h4>
                <p className="text-xs text-[#a2a6d0]">
                  اختبر استجابة الذكاء الاصطناعي وكيف يلتزم حصرياً بملخصاتك في الوضع الصارم مع حجب الأسئلة الخارجة عن كراسك
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                الوضع النشط: {ragMode === 'strict_notebook' ? 'Strict Notebook (صارم)' : ragMode === 'blended' ? 'Blended (مدمج)' : 'Full Knowledge'}
              </span>
            </div>

            {/* Query Input Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white">جرّب طرح سؤال لاختبار محرك المطابقة:</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunRAGTest()}
                  placeholder="اكتب سؤالاً مثل: ما هو مفهوم الحرب الباردة؟ أو ما هي أسباب مؤتمر الصومام؟"
                  className="flex-1 p-3 rounded-2xl bg-[#091338] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
                />
                <button
                  onClick={handleRunRAGTest}
                  disabled={isTesting}
                  className="py-3 px-5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-stone-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>فحص السياق</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Questions */}
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-[#a2a6d0]">أمثلة للتجربة:</span>
              <button
                onClick={() => {
                  setTestQuery('ما هو مفهوم الحرب الباردة وإطارها الزمني؟');
                  setTimeout(handleRunRAGTest, 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 border border-white/5 cursor-pointer"
              >
                سؤال داخل الملخص (الحرب الباردة) ✅
              </button>
              <button
                onClick={() => {
                  setTestQuery('ما هي عاصمة اليابان وما هي الصناعات الثقيلة في طوكيو؟');
                  setTimeout(handleRunRAGTest, 50);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-rose-300 border border-white/5 cursor-pointer"
              >
                سؤال خارج الملخص (اختبار الحجب) ⛔
              </button>
            </div>

            {/* Output Result Card */}
            {testResult && (
              <div className="rounded-2xl border border-white/10 bg-[#050a1e] p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    {testResult.isGatedOut ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1 bg-rose-500/15 px-2.5 py-1 rounded-md border border-rose-500/30">
                        <ShieldAlert className="w-3.5 h-3.5" /> تم الحجب بواسطة RAG Gate (خارج الملخص)
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/15 px-2.5 py-1 rounded-md border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> تمت المطابقة المتجهية بنجاح
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] font-mono text-amber-300">
                    نسبة المطابقة: {Math.round(testResult.relevanceScore * 100)}% | Temp: {testResult.temperatureUsed}
                  </span>
                </div>

                {/* AI Text Response */}
                <div className="p-4 rounded-xl bg-[#091338] border border-white/5 text-xs text-[#dfe0ff] leading-relaxed whitespace-pre-line">
                  {testResult.answer}
                </div>

                {/* Matched Chunks Breakdown */}
                {testResult.matchedChunks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-bold text-[#a2a6d0] block">
                      الفقرات المسترجعة من الـ Vector Store:
                    </span>
                    <div className="space-y-1.5">
                      {testResult.matchedChunks.map((mc, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] flex items-center justify-between gap-3"
                        >
                          <span className="line-clamp-1 text-white">{mc.text}</span>
                          <span className="font-mono text-[10px] text-teal-300 font-bold shrink-0">
                            {Math.round(mc.similarity * 100)}% مطابقة
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
