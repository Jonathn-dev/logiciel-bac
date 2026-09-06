import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Award,
  Layers,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Target,
  Users,
  Compass,
  MapPin,
  Flame,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import {
  OFFICIAL_BAC_CURRICULUM,
  BAC_STREAM_SPECIFICATIONS,
  CurriculumSituation,
  CurriculumUnit,
  StreamSpecification,
} from '../../data/officialBacCurriculum';

interface BacCurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (lessonId: string) => void;
  onOpenEssay?: () => void;
  onOpenQuiz?: () => void;
}

export const BacCurriculumModal: React.FC<BacCurriculumModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onOpenEssay,
  onOpenQuiz,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<'all' | 'history' | 'geography'>('all');
  const [selectedStream, setSelectedStream] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSituationId, setExpandedSituationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'streams' | 'methodology'>('curriculum');

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedSituationId((prev) => (prev === id ? null : id));
  };

  // Filter Units and Situations
  const getFilteredUnits = () => {
    let units: CurriculumUnit[] = [];
    if (selectedSubject === 'all' || selectedSubject === 'history') {
      units = [...units, ...OFFICIAL_BAC_CURRICULUM.historyUnits];
    }
    if (selectedSubject === 'all' || selectedSubject === 'geography') {
      units = [...units, ...OFFICIAL_BAC_CURRICULUM.geographyUnits];
    }

    return units.map((unit) => {
      const filteredSituations = unit.situations.filter((s) => {
        // Stream filter
        const matchesStream =
          selectedStream === 'all' ||
          s.targetStreams.includes('all') ||
          s.targetStreams.includes(selectedStream as any);

        // Search query filter
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.targetedCompetencies.some((c) => c.toLowerCase().includes(q)) ||
          s.keyConcepts.some((k) => k.toLowerCase().includes(q)) ||
          s.keyFiguresOrLocations.some((f) => f.toLowerCase().includes(q));

        return matchesStream && matchesSearch;
      });

      return {
        ...unit,
        situations: filteredSituations,
      };
    }).filter((unit) => unit.situations.length > 0);
  };

  const filteredUnits = getFilteredUnits();
  const totalFilteredSituations = filteredUnits.reduce((acc, u) => acc + u.situations.length, 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#020617]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-5xl bg-[#090e38] border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0c1348] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-400/20 font-black">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-white">
                    البرنامج والمقرر الوزاري الرسمي لبكالوريا الجزائر
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    دورة 2026 الرسمية
                  </span>
                </div>
                <p className="text-xs text-white/60 mt-0.5">
                  الوحدات والوضعيات التعلمية، الكفاءات المستهدفة، والمفاهيم المقررة لجميع الشعب
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Bar & Filters */}
          <div className="px-5 py-3.5 border-b border-white/10 bg-[#070b2c] flex flex-col gap-3">
            {/* Top Row: Main Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'curriculum'
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>برنامج الدروس والوضعيات ({totalFilteredSituations})</span>
                </button>

                <button
                  onClick={() => setActiveTab('streams')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'streams'
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>دليل الشعب والمعاملات</span>
                </button>

                <button
                  onClick={() => setActiveTab('methodology')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'methodology'
                      ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>شبكة بناء الاختبار والتنقيط (04/04)</span>
                </button>
              </div>

              {/* Quick Search */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في الكفاءات والمفاهيم..."
                  className="w-full pl-3 pr-8 py-1.5 rounded-xl bg-[#040822] border border-white/10 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Filter Pills (Subject & Stream) - Only shown on curriculum tab */}
            {activeTab === 'curriculum' && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
                {/* Subject Selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-white/50 font-bold ml-1">المادة:</span>
                  <button
                    onClick={() => setSelectedSubject('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedSubject === 'all'
                        ? 'bg-white/20 text-white'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    الكل
                  </button>
                  <button
                    onClick={() => setSelectedSubject('history')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedSubject === 'history'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    🏛️ التاريخ (3 وحدات)
                  </button>
                  <button
                    onClick={() => setSelectedSubject('geography')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      selectedSubject === 'geography'
                        ? 'bg-teal-400/20 text-teal-300 border border-teal-400/40'
                        : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                  >
                    🌍 الجغرافيا (3 وحدات)
                  </button>
                </div>

                {/* Stream Selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] text-white/50 font-bold ml-1">الشعبة:</span>
                  <select
                    value={selectedStream}
                    onChange={(e) => setSelectedStream(e.target.value)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#040822] text-white/90 border border-white/10 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="all">جميع الشعب</option>
                    <option value="letters_philosophy">آداب وفلسفة</option>
                    <option value="economics">تسيير واقتصاد</option>
                    <option value="foreign_languages">لغات أجنبية</option>
                    <option value="science">شعب علمية ورياضية</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Modal Body Content */}
          <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: CURRICULUM SITUATIONS */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                {filteredUnits.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">لا توجد وضعيات تطابق البحث</div>
                    <p className="text-xs text-white/50">جرب تعديل كلمة البحث أو فلتر الشعبة والمادة</p>
                  </div>
                ) : (
                  filteredUnits.map((unit, uIdx) => {
                    const isHistory = unit.subject === 'history';
                    return (
                      <div
                        key={`${unit.subject}-${unit.unitNumber}`}
                        className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                      >
                        {/* Unit Header */}
                        <div
                          className={`p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isHistory ? 'bg-amber-500/10' : 'bg-teal-500/10'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${
                                isHistory
                                  ? 'bg-amber-400 text-stone-950'
                                  : 'bg-teal-400 text-stone-950'
                              }`}
                            >
                              {unit.unitNumber}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                                    isHistory
                                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                                      : 'bg-teal-400/15 text-teal-300 border-teal-400/30'
                                  }`}
                                >
                                  {isHistory ? 'مادة التاريخ 🏛️' : 'مادة الجغرافيا 🌍'} - الوحدة {unit.unitNumber}
                                </span>
                                <span className="text-[11px] text-white/50 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {unit.durationWeeks} أسابيع تدريس
                                </span>
                              </div>
                              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                                {unit.title}
                              </h3>
                            </div>
                          </div>
                        </div>

                        {/* General Unit Competency */}
                        <div className="px-5 py-3 bg-[#060b2b] border-b border-white/5 flex items-start gap-2 text-xs text-white/80">
                          <Target className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-300">الكفاءة الختامية للوحدة: </span>
                            <span>{unit.generalCompetency}</span>
                          </div>
                        </div>

                        {/* Unit Situations List */}
                        <div className="p-4 sm:p-5 space-y-3">
                          {unit.situations.map((situation) => {
                            const isExpanded = expandedSituationId === situation.id;
                            return (
                              <div
                                key={situation.id}
                                className="rounded-xl bg-[#060a26] border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                              >
                                {/* Situation Title Card */}
                                <div
                                  onClick={() => toggleExpand(situation.id)}
                                  className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                      {situation.number}
                                    </div>
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/70">
                                          وضعية تعلمية {situation.number}
                                        </span>
                                        <span
                                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            situation.examFrequency === 'مرتفع جداً'
                                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                          }`}
                                        >
                                          تكرار في الباك: {situation.examFrequency}
                                        </span>
                                        <span className="text-[10px] text-white/50">
                                          الحجم الزمني: {situation.estimatedHours} سا
                                        </span>
                                      </div>
                                      <h4 className="text-sm font-bold text-white leading-snug">
                                        {situation.title}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                      <ChevronUp className="w-4 h-4 text-white/60" />
                                    ) : (
                                      <ChevronDown className="w-4 h-4 text-white/60" />
                                    )}
                                  </div>
                                </div>

                                {/* Expanded Situation Details */}
                                {isExpanded && (
                                  <div className="p-4 sm:p-5 border-t border-white/10 bg-[#04081e] space-y-4 text-xs">
                                    {/* Competencies */}
                                    <div className="space-y-2">
                                      <div className="font-bold text-teal-300 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                                        الكفاءات المستهدفة والمحطات الأساسية:
                                      </div>
                                      <ul className="space-y-1.5 pr-4 list-disc text-white/80 leading-relaxed">
                                        {situation.targetedCompetencies.map((comp, cIdx) => (
                                          <li key={cIdx}>{comp}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    {/* Key Concepts / Terms */}
                                    <div className="space-y-2">
                                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                                        المفاهيم والمصطلحات المقررة للحفظ والفهم:
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {situation.keyConcepts.map((kc, kIdx) => (
                                          <span
                                            key={kIdx}
                                            className="px-2 py-0.5 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-200 text-[11px]"
                                          >
                                            {kc}
                                          </span>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Figures / Places / Dates */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                                        <div className="font-bold text-white/90 flex items-center gap-1">
                                          <MapPin className="w-3 h-3 text-cyan-400" />
                                          {isHistory ? 'الشخصيات المعلمية:' : 'المواقع والأقاليم الكبرى:'}
                                        </div>
                                        <div className="flex flex-wrap gap-1 text-[11px] text-white/70">
                                          {situation.keyFiguresOrLocations.map((f, fIdx) => (
                                            <span key={fIdx} className="bg-white/10 px-1.5 py-0.5 rounded">
                                              {f}
                                            </span>
                                          ))}
                                        </div>
                                      </div>

                                      {situation.milestoneDates && (
                                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                                          <div className="font-bold text-white/90 flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-rose-400" />
                                            التواريخ المعلمية الإلزامية:
                                          </div>
                                          <div className="space-y-1 text-[11px] text-white/70">
                                            {situation.milestoneDates.slice(0, 3).map((d, dIdx) => (
                                              <div key={dIdx} className="truncate">
                                                • {d}
                                              </div>
                                            ))}
                                            {situation.milestoneDates.length > 3 && (
                                              <div className="text-[10px] text-amber-300">
                                                + {situation.milestoneDates.length - 3} تواريخ إضافية...
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Methodology focus */}
                                    <div className="p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-200 text-[11px] flex items-start gap-2">
                                      <FileText className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                      <div>
                                        <span className="font-bold text-white">التركيز المنهجي في البكالوريا: </span>
                                        <span>{situation.methodologyFocus}</span>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/10">
                                      {situation.lessonIdRef && onSelectLesson && (
                                        <button
                                          onClick={() => {
                                            onSelectLesson(situation.lessonIdRef!);
                                            onClose();
                                          }}
                                          className="px-3 py-1.5 rounded-xl bg-amber-400 text-stone-950 font-bold text-xs hover:bg-amber-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20"
                                        >
                                          <span>دراسة هذا الدرس الآن</span>
                                          <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                      )}

                                      {onOpenEssay && (
                                        <button
                                          onClick={() => {
                                            onOpenEssay();
                                            onClose();
                                          }}
                                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>كتابة مقال حولها</span>
                                        </button>
                                      )}

                                      {onOpenQuiz && (
                                        <button
                                          onClick={() => {
                                            onOpenQuiz();
                                            onClose();
                                          }}
                                          className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>اختبار سريع</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB 2: STREAMS & COEFFICIENTS */}
            {activeTab === 'streams' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200 flex items-start gap-3">
                  <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-bold text-white">معاملات مادة التاريخ والجغرافيا في بكالوريا الجزائر:</div>
                    <p className="leading-relaxed opacity-90">
                      مادة التاريخ والجغرافيا مادة موحدة إجبارية لجميع الشعب، ويتم حساب معاملها الإجمالي (التاريخ + الجغرافيا) ككتلة واحدة في حساب المعدل العام للبكالوريا.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BAC_STREAM_SPECIFICATIONS.map((spec) => (
                    <div
                      key={spec.id}
                      className="p-5 rounded-2xl bg-[#060a28] border border-white/10 hover:border-white/20 transition-all space-y-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-bold text-white text-base">{spec.name}</h4>
                        <span className="px-2.5 py-1 rounded-xl bg-amber-400 text-stone-950 font-black text-xs shadow-md shadow-amber-400/20">
                          معامل: {spec.combinedCoefficient}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-white/50 text-[11px]">معامل التاريخ / الجغرافيا:</div>
                          <div className="text-sm font-bold text-amber-300 mt-0.5">
                            {spec.historyCoefficient} + {spec.geographyCoefficient}
                          </div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-white/50 text-[11px]">مدة الامتحان الرسمي:</div>
                          <div className="text-sm font-bold text-white mt-0.5">{spec.examDuration}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#04081c] border border-white/5 text-xs text-white/70 leading-relaxed">
                        <div className="font-bold text-white/90 mb-1">طبيعة المقرر والتوجيهات:</div>
                        {spec.notes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: EXAM STRUCTURE & METHODOLOGY */}
            {activeTab === 'methodology' && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <ShieldCheck className="w-5 h-5" />
                    الهيكلة الرسمية لموضوع امتحان التاريخ والجغرافيا في البكالوريا (20 نقطة)
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    يتضمن اختبار البكالوريا موضوعين اختياريين متوازنين (الموضوع الأول والموضوع الثاني)، يختار المترشح أحدهما كاملاً. ينقسم كل موضوع إلى جزءين في كل مادة:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* History Structure */}
                  <div className="p-5 rounded-2xl bg-[#060b29] border border-amber-400/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span>🏛️ مادة التاريخ</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-bold text-xs">
                        10 / 10 نقاط
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="font-bold text-teal-300 flex items-center justify-between">
                          <span>الجزء الأول: المفاهيم والسندات</span>
                          <span>(06 نقاط)</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          • شرح 3 مصطلحات تاريخية محددة في سياق السند (03 ن).
                          <br />• التعريف بشخصيتين تاريخيتين معلميتين (02 ن).
                          <br />• إكمال جدول أحداث تاريخية أو تواريخ معلمية (01 ن).
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="font-bold text-amber-300 flex items-center justify-between">
                          <span>الجزء الثاني: المقال التاريخي الإدماجي</span>
                          <span>(04 نقاط)</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          • <strong>المقدمة (0.5 ن):</strong> تمهيد وظيفي + طرح الإشكالية.
                          <br />• <strong>العرض (2.5 ن):</strong> الإجابة عن التعليمتين في شكل عناصر ومطويات دقيقة.
                          <br />• <strong>الخاتمة (0.5 ن):</strong> استنتاج عام وتقييم تاريخي.
                          <br />• <strong>سلامة اللغة والمنهجية (0.5 ن).</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Geography Structure */}
                  <div className="p-5 rounded-2xl bg-[#060b29] border border-teal-400/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span>🌍 مادة الجغرافيا</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-teal-400/20 text-teal-300 font-bold text-xs">
                        10 / 10 نقاط
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="font-bold text-teal-300 flex items-center justify-between">
                          <span>الجزء الأول: الأدوات الجغرافية والمصطلحات</span>
                          <span>(06 نقاط)</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          • شرح 3 مصطلحات جغرافية من السند (03 ن).
                          <br />• تمثيل معطيات إحصائية (منحنى، أعمدة بيانية، دائرة نسبية) أو التعليق على جدول (02 ن).
                          <br />• التوقيع على خريطة صماء (01 ن).
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <div className="font-bold text-amber-300 flex items-center justify-between">
                          <span>الجزء الثاني: المقال الجغرافي الإدماجي</span>
                          <span>(04 نقاط)</span>
                        </div>
                        <p className="text-white/70 text-[11px] leading-relaxed">
                          • <strong>المقدمة (0.5 ن):</strong> تحديد المجال الجغرافي + الإشكالية.
                          <br />• <strong>العرض (2.5 ن):</strong> تحليل العوامل والمظاهر والأثر الجغرافي في مطويات.
                          <br />• <strong>الخاتمة (0.5 ن):</strong> حوصلة واستشراف تنموي.
                          <br />• <strong>التنظيم والشكل (0.5 ن).</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Navigation */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#070b2c] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-white/60 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>مبني وفق الوثيقة التوجيهية الرسمية لوزارة التربية الوطنية الجزائرية 2026</span>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold transition-all cursor-pointer text-center"
            >
              إغلاق البرنامج
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
