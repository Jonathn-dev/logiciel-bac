import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, BookMarked, Filter, CheckCircle2, Bookmark, Sparkles } from 'lucide-react';

interface TermItem {
  id: string;
  term: string;
  category: 'history' | 'geography';
  chapter: string;
  definition: string;
  examFrequency: 'عالي جداً' | 'عالي' | 'متوسط';
  mastered: boolean;
}

const OFFICIAL_ALGERIAN_TERMS: TermItem[] = [
  {
    id: 't-alg-1',
    term: 'بيان أول نوفمبر 1954',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    definition: 'أول وثيقة رسمية صادرة عن جبهة التحرير الوطني في ليلة 1 نوفمبر 1954، حددت دوافع الكفاح المسلح، وأهدافه الداخلية (إقامة الدولة الجزائرية المستقلة ذات السيادة) والخارجية (تدويل القضية وتحقيق الوحدة المغاربية)، وشروط التفاوض مع فرنسا.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-2',
    term: 'مؤتمر الصومام 20 أوت 1956',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    definition: 'مؤتمر تاريخي وطني انعقد سرياً بقرية إيفري بوادي الصومام (الولاية الثالثة)، قام بهيكلة الثورة وتنظيم جيش التحرير وتقسيم الجزائر إلى 6 ولايات تاريخية وإنشاء مؤسسات القيادة (CNRA و CCE) وإقرار مبدأ أولوية الداخل على الخارج والسياسي على العسكري.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-3',
    term: 'هجمات الشمال القسنطيني 20 أوت 1955',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    definition: 'هجمات كبرى شنتها الولاية الثانية بقيادة البطل زيغود يوسف في وضح النهار ضد المواقع العسكرية والاستعمارية بسكيكدة وقالمة وقسنطينة، استهدفت فك الحصار المفروض على الأوراس وتدويل القضية في الأمم المتحدة ودحض خرافة التمرد المعزول.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-4',
    term: 'مصطفى بن بولعيد (1917 - 1956)',
    category: 'history',
    chapter: 'شخصيات الثورة الجزائرية',
    definition: 'أب الثورة الجزائرية وأحد مفجريها الستة، قائد المنطقة الأولى (الأوراس - النمامشة)، عضو في المنظمة الخاصة OS ومجموعة 22 ولجنة 6، استشهد في 22 مارس 1956 بانفجار مذياع مفخخ ألقاه الجيش الفرنسي.',
    examFrequency: 'عالي جداً',
    mastered: false,
  },
  {
    id: 't-alg-5',
    term: 'العربي بن مهيدي (1923 - 1957)',
    category: 'history',
    chapter: 'شخصيات الثورة الجزائرية',
    definition: 'من كبار قادة الثورة، قائد الولاية الخامسة (وهران والغرب)، عضو مجموعة الستة ولجنة التنسيق والتنفيذ CCE، أشرف على قيادة معركة الجزائر التاريخية 1957 صاحب المقولة الشهيرة: «ألقوا بالثورة إلى الشارع يحتضنها الشعب». اغتيل تحت التعذيب على يد مظليي بيجار.',
    examFrequency: 'عالي جداً',
    mastered: false,
  },
  {
    id: 't-alg-6',
    term: 'خطي شال وموريس (Lignes Challe & Morice)',
    category: 'history',
    chapter: 'ردود فعل الاستعمار العسكرية',
    definition: 'خطوط أسلاك شائكة مكهربة ومزروعة بملايين الألغام ومزودة بأجهزة رادار ومراقبة أقامها الاستعمار الفرنسي على الحدود الشرقية والغربية لعزل الثورة الجزائرية ومنع تسليح جيش التحرير الوطني.',
    examFrequency: 'عالي جداً',
    mastered: false,
  },
  {
    id: 't-alg-7',
    term: 'مبدأ ترومان 12 مارس 1947',
    category: 'history',
    chapter: 'تطور العالم في ظل القطبية الثنائية',
    definition: 'مبادرة سياسية ومالية أعلنها الرئيس الأمريكي هاري ترومان تقضي بتقديم 400 مليون دولار كمساعدات عاجلة لليونان وتركيا لمنع سقوطهما في قبضة المد الشيوعي وتدشين سياسة الاحتواء الأمريكية.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-8',
    term: 'مشروع مارشال 05 جوان 1947',
    category: 'history',
    chapter: 'استراتيجيات الحرب الباردة',
    definition: 'مبادرة اقتصادية أعلنها وزير الخارجية الأمريكي جورج مارشال لتقديم مساعدات مالية تتجاوز 13 مليار دولار لإعادة بناء اقتصاد دول أوروبا الغربية وربطه بالنظام الرأسمالي واحتواء الشيوعية.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-9',
    term: 'مبدأ جدانوف والكومنفورم 1947',
    category: 'history',
    chapter: 'استراتيجيات المعسكر الشرقي',
    definition: 'أطروحة السكرتير السوفياتي أندريه جدانوف التي قسمت العالم إلى معسكرين (إمبريالي بقيادة و.م.أ وديمقراطي بقيادة موسكو)، وتأسيس مكتب الكومنفورم في أكتوبر 1947 لتنسيق نشاطات الأحزاب الشيوعية العالمية.',
    examFrequency: 'عالي',
    mastered: false,
  },
  {
    id: 't-alg-10',
    term: 'مؤشر التنمية البشرية (IDH)',
    category: 'geography',
    chapter: 'إشكالية التقدم والتخلف',
    definition: 'مؤشر تأليفي قياسي يتراوح بين 0 و 1 معتمد من برنامج الأمم المتحدة الإنمائي (PNUD) منذ 1990، يجمع بين ثلاثة أبعاد: أمد الحياة عند الولادة (الصحة)، التحصيل العلمي ومعدل التمدرس (التعليم)، ومتوسط نصيب الفرد من الناتج الداخلي الخام (الدخل).',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-11',
    term: 'منظمة الدول المصدرة للبترول (OPEC)',
    category: 'geography',
    chapter: 'أسواق المبادلات والتنقلات العالمية',
    definition: 'منظمة دولية تأسست ببغداد في سبتمبر 1960 من قبل 5 دول (السعودية، العراق، الكويت، إيران، فنزويلا)، مقرها فيينا. تهدف لحماية مصالح الدول المصدرة للبترول وضبط حصص الإنتاج والأسعار واسترجاع السيادة على الثروات الوطنية.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
  {
    id: 't-alg-12',
    term: 'المركب الفلاحي الصناعي (Agrobusiness)',
    category: 'geography',
    chapter: 'الولايات المتحدة الأمريكية قوة اقتصادية عظمى',
    definition: 'اندماج الأنشطة الفلاحية مع القطاعات الصناعية والتجارية والمالية لتشكيل حلقة إنتاجية وتسويقية متكاملة تسيطر عليها الشركات متعددة الجنسيات في الاقتصاد الأمريكي.',
    examFrequency: 'عالي جداً',
    mastered: false,
  },
  {
    id: 't-alg-13',
    term: 'حزام الشمس (Sun Belt) وسيليكون فالي',
    category: 'geography',
    chapter: 'الأقاليم الاقتصادية الكبرى بالولايات المتحدة',
    definition: 'المجال الجغرافي الممتد في جنوب وجنوب غرب الولايات المتحدة الأمريكية، يتميز بحيوية ديمغرافية واستقطاب الاستثمارات وازدهار الصناعات الفضائية والبتروكيماوية والتقنيات الدقيقة في كاليفورنيا وتكساس وفلوريدا.',
    examFrequency: 'عالي',
    mastered: false,
  },
  {
    id: 't-alg-14',
    term: 'السلاح الأخضر (Green Weapon)',
    category: 'geography',
    chapter: 'أسواق المواد الاستراتيجية والقمح',
    definition: 'استخدام الدول الكبرى المصدرة للحبوب والمواد الغذائية الأساسية (خاصة و.م.أ وكندا) لصادرات القمح كوسيلة ضغط سياسي واقتصادي على الدول النامية والمستوردة لتحقيق مكاسب استراتيجية.',
    examFrequency: 'عالي جداً',
    mastered: true,
  },
];

export const TermsModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | 'history' | 'geography'>('all');
  const [terms, setTerms] = useState(OFFICIAL_ALGERIAN_TERMS);

  if (!isOpen) return null;

  const filtered = terms.filter((t) => {
    const matchesSearch =
      t.term.includes(searchTerm) ||
      t.definition.includes(searchTerm) ||
      t.chapter.includes(searchTerm);
    const matchesCat = filterCat === 'all' || t.category === filterCat;
    return matchesSearch && matchesCat;
  });

  const toggleMastered = (id: string) => {
    setTerms((prev) =>
      prev.map((t) => (t.id === id ? { ...t, mastered: !t.mastered } : t))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl rounded-3xl border border-stone-800 bg-[#09101d] p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
              <BookMarked className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">معجم مصطلحات وشخصيات بكالوريا الجزائر</h3>
              <p className="text-xs text-stone-400">
                المصطلحات والشخصيات المعتمدة رسمياً في المنهاج الوزاري (التاريخ والجغرافيا)
              </p>
            </div>
          </div>
          <button
            id="btn-close-terms-modal"
            onClick={onClose}
            className="rounded-xl border border-stone-800 p-2 text-stone-400 hover:bg-stone-800 hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter & Search */}
        <div className="my-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-500" />
            <input
              type="text"
              placeholder="ابحث عن مصطلح، شخصية، أو مفهوم تاريخي وجغرافي..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-stone-800 bg-stone-900/80 pr-10 pl-4 py-2.5 text-xs text-stone-200 placeholder:text-stone-500 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterCat('all')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                filterCat === 'all'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'border border-stone-800 bg-stone-900/60 text-stone-400'
              }`}
            >
              الكل ({terms.length})
            </button>
            <button
              onClick={() => setFilterCat('history')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                filterCat === 'history'
                  ? 'bg-teal-500 text-stone-950 shadow-md'
                  : 'border border-stone-800 bg-stone-900/60 text-stone-400'
              }`}
            >
              التاريخ
            </button>
            <button
              onClick={() => setFilterCat('geography')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                filterCat === 'geography'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'border border-stone-800 bg-stone-900/60 text-stone-400'
              }`}
            >
              الجغرافيا
            </button>
          </div>
        </div>

        {/* Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                item.mastered
                  ? 'border-emerald-500/30 bg-[#0c181f]/60'
                  : 'border-stone-800 bg-stone-900/40 hover:border-stone-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      item.category === 'history'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.chapter}
                  </span>
                  <span className="text-[10px] font-bold text-stone-400">
                    التكرار: <strong className="text-amber-400">{item.examFrequency}</strong>
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white mb-2">{item.term}</h4>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/40 p-3 rounded-xl border border-stone-800/80">
                  {item.definition}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-stone-800/60">
                <button
                  onClick={() => toggleMastered(item.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    item.mastered
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'border border-stone-700 text-stone-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{item.mastered ? 'تم الحفظ والاستيعاب' : 'وضع علامة تم الحفظ'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
