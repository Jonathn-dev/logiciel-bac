import {
  ComprehensiveGapReport,
  ExtractedConceptItem,
  MissingConceptItem,
  GapMetricItem,
} from '../types';

interface CurriculumRequirement {
  id: string;
  name: string;
  type: 'term' | 'personality' | 'date' | 'concept';
  category: 'history' | 'geography';
  chapter: string;
  whyCritical: string;
  suggestedAction: string;
  frequency: 'عالي جداً' | 'عالي' | 'متوسط';
  keywords: string[];
}

export const OFFICIAL_BAC_REQUIREMENTS: CurriculumRequirement[] = [
  // 1. History - Algerian Revolution
  {
    id: 'req-h-1',
    name: 'بيان أول نوفمبر 1954',
    type: 'term',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    whyCritical: 'المرجعية الأولى للثورة التي حددت الأهداف الداخلية والخارجية وشروط التفاوض.',
    suggestedAction: 'تدوين الأهداف الداخلية (الدولة المستقلة) والخارجية (تدويل القضية) وحفظها حرفياً.',
    frequency: 'عالي جداً',
    keywords: ['بيان أول نوفمبر', '1 نوفمبر 1954', 'بيان 1 نوفمبر', 'أول نوفمبر'],
  },
  {
    id: 'req-h-2',
    name: 'مؤتمر الصومام 20 أوت 1956',
    type: 'date',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    whyCritical: 'منعطف تنظيمي حاسم أسس لـ CNRA و CCE والولايات الست وأولوية الداخل والسياسي.',
    suggestedAction: 'رسم مخطط هيكلة الثورة بعد الصومام ومقارنة الرتب العسكرية والولايات الست.',
    frequency: 'عالي جداً',
    keywords: ['مؤتمر الصومام', 'الصومام', '20 أوت 1956', 'قرية إيفري', 'cnra', 'cce'],
  },
  {
    id: 'req-h-3',
    name: 'هجمات الشمال القسنطيني 20 أوت 1955',
    type: 'date',
    category: 'history',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    whyCritical: 'فكت الحصار العسكري عن الأوراس ودحضت أكذوبة التمرد المعزول ودوّلت القضية.',
    suggestedAction: 'التركيز على دور الشهيد زيغود يوسف والنتائج الدبلوماسية في الجمعية العامة للأمم المتحدة.',
    frequency: 'عالي جداً',
    keywords: ['الشمال القسنطيني', '20 أوت 1955', 'هجمات 20 أوت', 'سكيكدة', 'قسنطينة'],
  },
  {
    id: 'req-h-4',
    name: 'الشهيد مصطفى بن بولعيد',
    type: 'personality',
    category: 'history',
    chapter: 'شخصيات الثورة الجزائرية',
    whyCritical: 'أب الثورة وقائد المنطقة الأولى (الأوراس)، عضو مجموعة الـ 22 واللجنة الست.',
    suggestedAction: 'حفظ بطاقة تعريفية: مولده، صفته النضالية، دوره في OS والمنطقة الأولى واستشهاده 1956.',
    frequency: 'عالي جداً',
    keywords: ['مصطفى بن بولعيد', 'بن بولعيد', 'أب الثورة'],
  },
  {
    id: 'req-h-5',
    name: 'الشهيد العربي بن مهيدي',
    type: 'personality',
    category: 'history',
    chapter: 'شخصيات الثورة الجزائرية',
    whyCritical: 'قائد الولاية الخامسة، عضو لجنة التنسيق والتنفيذ CCE، مهندس معركة الجزائر 1957.',
    suggestedAction: 'تذكر مقولته الشهيرة: «ألقوا بالثورة إلى الشارع يحتضنها الشعب» ودوره في إضراب الثمانية أيام.',
    frequency: 'عالي جداً',
    keywords: ['العربي بن مهيدي', 'بن مهيدي', 'معركة الجزائر'],
  },
  {
    id: 'req-h-6',
    name: 'الشهيد زيغود يوسف',
    type: 'personality',
    category: 'history',
    chapter: 'شخصيات الثورة الجزائرية',
    whyCritical: 'قائد الولاية الثانية ومهندس هجمات 20 أوت 1955 وعضو مؤتمر الصومام.',
    suggestedAction: 'ربط الشخصية بهجمات 20 أوت 1955 واستشهاده في معركة سيدي مزغيش 1956.',
    frequency: 'عالي جداً',
    keywords: ['زيغود يوسف', 'زيغود', 'قائد الولاية الثانية'],
  },
  {
    id: 'req-h-7',
    name: 'خطي شال وموريس المكهربين',
    type: 'term',
    category: 'history',
    chapter: 'استراتيجيات الاستعمار الفرنسي لإخماد الثورة',
    whyCritical: 'إجراء عسكري استعماري عازل للحدود الشرقية والغربية لمنع الإمداد والتسليح.',
    suggestedAction: 'حفظ خطة ديغول وشال وموريس والمحتشدات والمناطق المحرمة كسياسات إبادة.',
    frequency: 'عالي',
    keywords: ['شال وموريس', 'خط موريس', 'خط شال', 'الأسلاك الشائكة', 'المناطق المحرمة'],
  },
  // 2. History - Cold War
  {
    id: 'req-h-8',
    name: 'مبدأ ترومان 12 مارس 1947',
    type: 'term',
    category: 'history',
    chapter: 'استراتيجيات الحرب الباردة',
    whyCritical: 'تدشين سياسة الاحتواء الأمريكية ودعم اليونان وتركيا بـ 400 مليون دولار لمنع التمدد السوفياتي.',
    suggestedAction: 'توضيح أهداف المبدأ الظاهرية (حماية الديمقراطية) والخفية (تطويق الاتحاد السوفياتي).',
    frequency: 'عالي جداً',
    keywords: ['مبدأ ترومان', 'ترومان', '12 مارس 1947', 'الاحتواء'],
  },
  {
    id: 'req-h-9',
    name: 'مشروع مارشال 05 جوان 1947',
    type: 'term',
    category: 'history',
    chapter: 'استراتيجيات الحرب الباردة',
    whyCritical: 'مساعدات اقتصادية بأكثر من 13 مليار دولار لربط أوروبا الغربية باقتصاد السوق الرأسمالي.',
    suggestedAction: 'حفظ الأهداف المعلنة والخفية للمشروع ورد السوفييت بتأسيس الكوميكون والكومنفورم.',
    frequency: 'عالي جداً',
    keywords: ['مشروع مارشال', 'مارشال', '5 جوان 1947', 'مساعدات مارشال'],
  },
  {
    id: 'req-h-10',
    name: 'مبدأ جدانوف والكومنفورم 1947',
    type: 'term',
    category: 'history',
    chapter: 'استراتيجيات المعسكر الشرقي',
    whyCritical: 'تقسيم العالم لمعسكرين وإنشاء مكتب الإخبار الشيوعي لتنسيق الأحزاب العالمية.',
    suggestedAction: 'حفظ تعريف أندريه جدانوف وتأسيس مكتب الكومنفورم في أكتوبر 1947.',
    frequency: 'عالي',
    keywords: ['جدانوف', 'مبدأ جدانوف', 'الكومنفورم', 'الكوميكون'],
  },
  // 3. Geography - Development & Energy
  {
    id: 'req-g-1',
    name: 'مؤشر التنمية البشرية (IDH)',
    type: 'concept',
    category: 'geography',
    chapter: 'إشكالية التقدم والتخلف',
    whyCritical: 'المقياس الدولي المعتمد من الأمم المتحدة لتصنيف تقدم وتخلف الدول بناء على 3 معايير.',
    suggestedAction: 'حفظ الأبعاد الثلاثة: أمد الحياة عند الولادة، نسبة التمدرس، ومعدل الدخل الفردي الخام.',
    frequency: 'عالي جداً',
    keywords: ['مؤشر التنمية البشرية', 'idh', 'التنمية البشرية', 'أمد الحياة', 'الدخل الفردي'],
  },
  {
    id: 'req-g-2',
    name: 'منظمة الدول المصدرة للبترول (OPEC)',
    type: 'term',
    category: 'geography',
    chapter: 'أسواق المبادلات والتنقلات العالمية',
    whyCritical: 'حماية مصالح الدول النامية المصدرة للمحروقات وتحديد الحصص الإنتاجية واستقرار الأسعار.',
    suggestedAction: 'حفظ تاريخ ومكان التأسيس (بغداد سبتمبر 1960) والدول الخمس المؤسسة ومقرها فيينا.',
    frequency: 'عالي جداً',
    keywords: ['منظمة أوبك', 'أوبك', 'opec', 'الدول المصدرة للبترول', 'حصص الإنتاج'],
  },
  {
    id: 'req-g-3',
    name: 'المركب الفلاحي الصناعي (Agrobusiness)',
    type: 'concept',
    category: 'geography',
    chapter: 'القوة الاقتصادية للولايات المتحدة الأمريكية',
    whyCritical: 'الاندماج العضوي بين الزراعة والصناعة التحويلية وشركات التسويق والبنوك في أمريكا.',
    suggestedAction: 'شرح دور الشركات متعددة الجنسيات وهيمنتها على منظومة الغذاء العالمية.',
    frequency: 'عالي جداً',
    keywords: ['agrobusiness', 'المركب الفلاحي الصناعي', 'الأكروبيزنس', 'الأجروبيزنس'],
  },
  {
    id: 'req-g-4',
    name: 'حزام الشمس (Sun Belt) وسيليكون فالي',
    type: 'concept',
    category: 'geography',
    chapter: 'الأقاليم الاقتصادية بالولايات المتحدة',
    whyCritical: 'الإقليم الأكثر ديناميكية في استقطاب الصناعات الفضائية والإلكترونية الدقيقة في الجنوب والغرب.',
    suggestedAction: 'توطين الإقليم على خريطة الولايات المتحدة وذكر ولايات كاليفورنيا وتكساس وفلوريدا.',
    frequency: 'عالي',
    keywords: ['حزام الشمس', 'sun belt', 'سيليكون فالي', 'silicon valley', 'الإقليم الجنوبي'],
  },
  {
    id: 'req-g-5',
    name: 'السلاح الأخضر (Green Weapon)',
    type: 'concept',
    category: 'geography',
    chapter: 'أسواق المواد الاستراتيجية والقمح',
    whyCritical: 'توظيف الدول الكبرى لصادرات القمح والغذاء كأداة ضغط سياسي واقتصادي على الدول المستوردة.',
    suggestedAction: 'الاستدلال بهيمنة و.م.أ وكندا على بورصات الحبوب العالمية (شيكاغو).',
    frequency: 'عالي جداً',
    keywords: ['السلاح الأخضر', 'سلاح القمح', 'green weapon', 'القمح سلاح'],
  },
];

export class GapAnalyzer {
  /**
   * Analyze student extracted concepts or text against official BAC requirements
   */
  analyze(extractedText: string, concepts: ExtractedConceptItem[] = []): ComprehensiveGapReport {
    const textLower = extractedText.toLowerCase();
    const foundRequirements: CurriculumRequirement[] = [];
    const missingRequirements: CurriculumRequirement[] = [];

    // Check each official requirement
    for (const req of OFFICIAL_BAC_REQUIREMENTS) {
      const matchInText = req.keywords.some((kw) => textLower.includes(kw.toLowerCase()));
      const matchInConcepts = concepts.some(
        (c) => c.name.toLowerCase().includes(req.name.toLowerCase()) || req.keywords.some((kw) => c.name.toLowerCase().includes(kw.toLowerCase()))
      );

      if (matchInText || matchInConcepts) {
        foundRequirements.push(req);
      } else {
        missingRequirements.push(req);
      }
    }

    // Category breakdown
    const totalRequired = OFFICIAL_BAC_REQUIREMENTS.length;
    const totalFound = foundRequirements.length;
    const overallPercentage = Math.round((totalFound / totalRequired) * 100);

    // Grouping metrics
    const termsReq = OFFICIAL_BAC_REQUIREMENTS.filter((r) => r.type === 'term');
    const termsFound = foundRequirements.filter((r) => r.type === 'term').length;

    const persReq = OFFICIAL_BAC_REQUIREMENTS.filter((r) => r.type === 'personality');
    const persFound = foundRequirements.filter((r) => r.type === 'personality').length;

    const datesReq = OFFICIAL_BAC_REQUIREMENTS.filter((r) => r.type === 'date');
    const datesFound = foundRequirements.filter((r) => r.type === 'date').length;

    const concReq = OFFICIAL_BAC_REQUIREMENTS.filter((r) => r.type === 'concept');
    const concFound = foundRequirements.filter((r) => r.type === 'concept').length;

    const metrics: GapMetricItem[] = [
      {
        category: 'المصطلحات الرسمية',
        currentCount: termsFound,
        requiredCount: termsReq.length,
        coveragePercentage: Math.round((termsFound / termsReq.length) * 100),
        color: '#59dad1',
      },
      {
        category: 'الأعلام والشخصيات',
        currentCount: persFound,
        requiredCount: persReq.length,
        coveragePercentage: Math.round((persFound / persReq.length) * 100),
        color: '#ffe16d',
      },
      {
        category: 'التواريخ المعلمية',
        currentCount: datesFound,
        requiredCount: datesReq.length,
        coveragePercentage: Math.round((datesFound / datesReq.length) * 100),
        color: '#4ade80',
      },
      {
        category: 'المفاهيم الجغرافية',
        currentCount: concFound,
        requiredCount: concReq.length,
        coveragePercentage: Math.round((concFound / concReq.length) * 100),
        color: '#f43f5e',
      },
    ];

    const missingItems: MissingConceptItem[] = missingRequirements.map((r) => ({
      id: r.id,
      title: r.name,
      type: r.type,
      category: r.category,
      chapter: r.chapter,
      whyCritical: r.whyCritical,
      suggestedAction: r.suggestedAction,
      frequency: r.frequency,
    }));

    let status: 'optimal' | 'moderate_gaps' | 'critical_gaps' = 'optimal';
    let verdict: 'PASS_OFFICIAL' | 'REQUIRES_REVISION' | 'INSUFFICIENT' = 'PASS_OFFICIAL';

    if (overallPercentage >= 80) {
      status = 'optimal';
      verdict = 'PASS_OFFICIAL';
    } else if (overallPercentage >= 50) {
      status = 'moderate_gaps';
      verdict = 'REQUIRES_REVISION';
    } else {
      status = 'critical_gaps';
      verdict = 'INSUFFICIENT';
    }

    const recommendations: string[] = [];
    if (missingRequirements.some((m) => m.name.includes('الصومام') || m.name.includes('نوفمبر'))) {
      recommendations.push('أولوية قصوى: استدراك المحطات المؤسساتية للثورة التحريرية (مؤتمر الصومام وبيان أول نوفمبر).');
    }
    if (missingRequirements.some((m) => m.type === 'personality')) {
      recommendations.push('تثبيت الأعلام التاريخية (بن بولعيد، العربي بن مهيدي، زيغود يوسف) وتواريخ استشهادهم.');
    }
    if (missingRequirements.some((m) => m.name.includes('OPEC') || m.name.includes('IDH'))) {
      recommendations.push('إتقان مؤشرات الجغرافيا الاقتصادية: معايير مؤشر IDH ودور منظمة OPEC في أسواق النفط.');
    }
    if (recommendations.length === 0) {
      recommendations.push('ملخصك يغطي كافة المعايير الأساسية لمنهاج بكالوريا الجزائر! واصل التدريب على تحرير المقالات.');
    }

    return {
      overallScore: overallPercentage,
      status,
      summary: `تمت مطابقة ${totalFound} من أصل ${totalRequired} عنصراً معتمداً في الإطار المرجعي الجزائري بنسبة تغطية ${overallPercentage}%.`,
      metrics,
      missingItems,
      matchedCount: totalFound,
      missingCount: missingRequirements.length,
      recommendations,
      strictModeVerdict: verdict,
    };
  }
}

export const defaultGapAnalyzer = new GapAnalyzer();
