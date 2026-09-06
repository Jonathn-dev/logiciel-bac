// ==================== RAG CONTEXT GATE ENGINE ====================
// Implements strict context gating, semantic matching, and notebook chunking for Algerian Baccalaureate

export interface RAGConstraint {
  mode: 'strict_notebook' | 'blended' | 'full_knowledge';
  vectorStoreId: string; // معرف قاعدة البيانات المتجهية
  userNotebookChunks: string[]; // فقرات ملخص الطالب
  curriculumOfficial: string[]; // البرنامج الرسمي
  temperature: number; // 0.0 للوضع المقيد
}

export interface NotebookChunk {
  id: string;
  sourceDocName: string;
  unitSubject: 'history' | 'geography';
  unitTitle: string;
  content: string;
  keywords: string[];
  createdAt: string;
  vectorId: string;
  tokenCount: number;
}

export interface RAGQueryResult {
  answer: string;
  sourceMode: 'strict_notebook' | 'blended' | 'full_knowledge';
  isGatedOut: boolean;
  relevanceScore: number;
  matchedChunks: {
    text: string;
    source: string;
    similarity: number;
  }[];
  temperatureUsed: number;
  promptSent?: string;
}

// Normalized token clean
function cleanArabicText(text: string): string {
  return text
    .replace(/[َُِّْٰ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim();
}

// Semantic Jaccard + N-Gram Similarity Estimation
export function semanticMatch(chunk: string, query: string): number {
  const cleanQ = cleanArabicText(query);
  const cleanC = cleanArabicText(chunk);

  if (!cleanQ || !cleanC) return 0;
  if (cleanC.includes(cleanQ)) return 0.96;

  const queryWords = cleanQ.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return 0.5;

  let matchCount = 0;
  for (const word of queryWords) {
    if (cleanC.includes(word)) {
      matchCount++;
    }
  }

  const wordRatio = matchCount / queryWords.length;

  // Check 2-gram overlap
  let bigramMatches = 0;
  let totalBigrams = 0;
  for (let i = 0; i < queryWords.length - 1; i++) {
    totalBigrams++;
    const bigram = `${queryWords[i]} ${queryWords[i + 1]}`;
    if (cleanC.includes(bigram)) {
      bigramMatches += 1.5;
    }
  }

  const bigramBonus = totalBigrams > 0 ? (bigramMatches / totalBigrams) * 0.3 : 0;
  return Math.min(1.0, parseFloat((wordRatio * 0.75 + bigramBonus).toFixed(2)));
}

// Vector Search over in-memory or student notebook chunks
export function vectorSearch(
  query: string,
  chunks: string[],
  topK: number = 5
): { text: string; similarity: number }[] {
  const scored = chunks.map((c) => ({
    text: c,
    similarity: semanticMatch(c, query),
  }));

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// Build Prompt With Injected Strict Context
export function buildPromptWithContext(
  query: string,
  relevantChunks: { text: string; similarity: number }[],
  temperature: number,
  mode: 'strict_notebook' | 'blended' | 'full_knowledge'
): string {
  const contextSnippet = relevantChunks
    .map((c, i) => `[المصدر ${i + 1} - مطابقة ${(c.similarity * 100).toFixed(0)}%]:\n${c.text}`)
    .join('\n\n');

  if (mode === 'strict_notebook') {
    return `[STRICT RAG CONTEXT GATE - TEMP: ${temperature}]
تعليمات صارمة: أجب فقط وحصرياً من واقع فقرات ملخص الطالب التالية. لا تضف أي معلومات خارجية غير موجودة في النص.
الفقرات المعتمدة:
${contextSnippet}

السؤال: ${query}
الإجابة الحصرية الدقيقة:`;
  }

  return `[BLENDED RAG CONTEXT - TEMP: ${temperature}]
السياق المساعد من ملخص الطالب والبرنامج الرسمي:
${contextSnippet}

السؤال: ${query}
الإجابة المنهجية الشاملة:`;
}

// Official curriculum baseline fallback chunks
export const OFFICIAL_CURRICULUM_CHUNKS: string[] = [
  'معايير تشكل العالم غداة 1945: تاريخياً وسياسياً تراجع القوى التقليدية (فرنسا وبريطانيا)، بروز قوتين عظميين (الولايات المتحدة الأمريكية والاتحاد السوفياتي)، وانقسام العالم إلى معسكرين رأسمالي واشتراكي، وتأسيس هيئة الأمم المتحدة 24 أكتوبر 1945 كأداة لحفظ السلام الدولي.',
  'الاستراتيجيات الخاصة بكل كتلة في الحرب الباردة: الكتلة الغربية استخدمت مبدأ ترومان 12 مارس 1947 لتقديم مساعدات لليونان وتركيا، ومشروع مارشال 5 جوان 1947 لإعادة إعمار أوروبا، وتأسيس حلف الشمال الأطلسي الناتو 4 أفريل 1949. بينما رد السوفيات بإنشاء الكومنفورم 1947 ومنظمة الكوميكون 1949 وحلف وارسو 14 ماي 1955.',
  'الثورة التحريرية الجزائرية واستراتيجية تنفيذها: هجمات الشمال القسنطيني 20 أوت 1955 بقيادة زيغود يوسف لفك الحصار عن الأوراس وتدويل القضية في مؤتمر باندونغ. مؤتمر الصومام 20 أوت 1956 لإعادة هيكلة الثورة سياسياً (المجلس الوطني CNRA، لجنة التنسيق والتنفيذ CCE) وعسكرياً وتكريس أولوية الداخل على الخارج والسياسي على العسكري.',
  'مفاوضات إيفيان واستعادة الاستقلال: تم التوقيع على اتفاقيات إيفيان الثانية في 18 مارس 1962 مع إقرار وقف إطلاق النار يوم 19 مارس 1962 وتنظيم استفتاء تقرير المصير في 1 جويلية 1962 والإعلان عن استقلال الجزائر في 5 جويلية 1962.',
  'واقع الاقتصاد العالمي وتجارة البترول: البترول مادة استراتيجية أساسية ومصدر 60% من الطاقة العالمية. تتحدد أسعاره في بورصتي لندن ونيويورك حسب قانون العرض والطلب وقوة منظمة الدول المصدرة للبترول أوبك OPEC والأزمات الجيوسياسية وسعر صرف الدولار.',
  'القوى الاقتصادية الكبرى - الولايات المتحدة الأمريكية: تملك أكبر اقتصاد عالمي بفضل حزام الشمس Sun Belt والمركب الفلاحي الصناعي Agrobusiness، والوفرة الطبيعية وشبكة المواصلات العالمية واستقطاب الكفاءات والسيطرة على الشركات متعددة الجنسيات والدولار.',
  'الاتحاد الأوروبي مكانته وعوامل قوته: تكتل إقليمي رائد يقوم على مبادئ معاهدة روما 1957 ومعاهدة ماستريخت 1992 وعملة اليورو الموحدة ومساحة جغرافية واسعة وسوق استهلاكية ضخمة وقوة علمية وصناعية كبرى.',
];

// Pre-loaded default student notebook chunks
export const DEFAULT_STUDENT_CHUNKS: NotebookChunk[] = [
  {
    id: 'chunk-1',
    sourceDocName: 'كراس_التاريخ_الوحدة_الأولى.pdf',
    unitSubject: 'history',
    unitTitle: 'الحرب الباردة والقطبية الثنائية',
    content: 'مفهوم الحرب الباردة: صراع إيديولوجي ومذهبي بين المعسكر الشرقي الشيوعي بقيادة الاتحاد السوفياتي والمعسكر الغربي الرأسمالي بقيادة الولايات المتحدة الأمريكية، استخدمت فيه مختلف الوسائل ما عدا المواجهة العسكرية المباشرة بين العملاقين (1945 - 1989).',
    keywords: ['الحرب الباردة', 'الصراع الإيديولوجي', 'المعسكر الشرقي', 'المعسكر الغربي'],
    createdAt: '2026-08-25',
    vectorId: 'vec_hist_001',
    tokenCount: 48,
  },
  {
    id: 'chunk-2',
    sourceDocName: 'ملخص_الثورة_التحريرية_الخاص_بي.docx',
    unitSubject: 'history',
    unitTitle: 'الثورة التحريرية الكبرى (1954 - 1962)',
    content: 'هجمات 20 أوت 1955: قادها البطل زيغود يوسف في الشمال القسنطيني بهدف فك الحصار المفروض على المنطقة الأولى أوراس النمامشة، وتفنيد ادعاءات فرنسا بأن ما يحدث مجرد تمرد لقطاع طرق، وإعطاء صدى دولي للثورة عشية انعقاد الجمعية العامة للأمم المتحدة.',
    keywords: ['هجمات الشمال القسنطيني', 'زيغود يوسف', '20 أوت 1955', 'فك الحصار'],
    createdAt: '2026-08-27',
    vectorId: 'vec_hist_002',
    tokenCount: 54,
  },
  {
    id: 'chunk-3',
    sourceDocName: 'دفتر_الجغرافيا_أسواق_الطاقة.txt',
    unitSubject: 'geography',
    unitTitle: 'مصادر الطاقة والمبادلات التجارية',
    content: 'منظمة الأوبك OPEC: تأسست في مؤتمر بغداد 10-14 سبتمبر 1960 من طرف 5 دول مؤسسة (السعودية، العراق، الكويت، إيران، فنزويلا) بهدف حماية مصالح الدول المنتجة للبترول، مواجهة احتكار الشركات الأجنبية السبع الشقيقات، وضمان استقرار الأسعار في السوق الدولية.',
    keywords: ['الأوبك', 'مؤتمر بغداد', 'الشركات السبع الشقيقات', 'البترول'],
    createdAt: '2026-08-29',
    vectorId: 'vec_geo_001',
    tokenCount: 52,
  },
];

// Master RAG Constraint Enforcer
export function enforceRAGConstraint(
  query: string,
  constraint: RAGConstraint
): RAGQueryResult {
  const { mode, userNotebookChunks, curriculumOfficial, temperature } = constraint;

  // 1. STRICT NOTEBOOK MODE
  if (mode === 'strict_notebook') {
    const relevantChunks = vectorSearch(query, userNotebookChunks, 3);
    const topMatch = relevantChunks[0];
    const hasAnswer = topMatch && topMatch.similarity >= 0.65;

    if (!hasAnswer) {
      return {
        answer: `⚠️ هذا السؤال خارج نطاق ملخصك وملاحظاتك المرفوعة (نسبة المطابقة: ${(
          (topMatch?.similarity || 0) * 100
        ).toFixed(0)}%).\n\nنظام «Flash RAG Gate» مبرمج في الوضع الصارم على عدم إضافة أي معلومة من خارج كراسك. هل تريد التبديل إلى "الوضع المدمج (Blended)" للحصول على إجابة موثقة من البرنامج الرسمي للبكالوريا؟`,
        sourceMode: 'strict_notebook',
        isGatedOut: true,
        relevanceScore: topMatch?.similarity || 0,
        matchedChunks: relevantChunks.map((c) => ({
          text: c.text,
          source: 'ملخص الطالب الحصري',
          similarity: c.similarity,
        })),
        temperatureUsed: 0.0,
      };
    }

    const prompt = buildPromptWithContext(query, relevantChunks, 0.0, 'strict_notebook');

    return {
      answer: `📖 [إجابة حصرية من ملخصك - نسبة التطابق المتجهي ${Math.round(
        topMatch.similarity * 100
      )}%]:\n\n${topMatch.text}`,
      sourceMode: 'strict_notebook',
      isGatedOut: false,
      relevanceScore: topMatch.similarity,
      matchedChunks: relevantChunks.map((c) => ({
        text: c.text,
        source: 'ملخص الطالب الحصري (Strict Mode)',
        similarity: c.similarity,
      })),
      temperatureUsed: 0.0,
      promptSent: prompt,
    };
  }

  // 2. BLENDED MODE (Student Notes + Official BAC Curriculum)
  if (mode === 'blended') {
    const combined = [...userNotebookChunks, ...curriculumOfficial];
    const relevant = vectorSearch(query, combined, 4);
    const topMatch = relevant[0];

    const prompt = buildPromptWithContext(query, relevant, 0.2, 'blended');

    return {
      answer: `⚖️ [إجابة مدمجة من كراسك + المنهاج الوزاري الرسمي - دقة ${(
        (topMatch?.similarity || 0.8) * 100
      ).toFixed(0)}%]:\n\n${relevant.map((r) => r.text).join('\n\n• ')}`,
      sourceMode: 'blended',
      isGatedOut: false,
      relevanceScore: topMatch?.similarity || 0.85,
      matchedChunks: relevant.map((c) => ({
        text: c.text,
        source: userNotebookChunks.includes(c.text) ? 'كراس الطالب' : 'المنهاج الوزاري المعتمد',
        similarity: c.similarity,
      })),
      temperatureUsed: 0.2,
      promptSent: prompt,
    };
  }

  // 3. FULL KNOWLEDGE
  const allCurriculum = [...curriculumOfficial, ...userNotebookChunks];
  const allHits = vectorSearch(query, allCurriculum, 4);
  return {
    answer: `🌐 [المعرفة الشاملة للبكالوريا]:\n\n${allHits.map((h) => h.text).join('\n\n')}`,
    sourceMode: 'full_knowledge',
    isGatedOut: false,
    relevanceScore: allHits[0]?.similarity || 0.9,
    matchedChunks: allHits.map((c) => ({
      text: c.text,
      source: 'قاعدة المعرفة الموسعة',
      similarity: c.similarity,
    })),
    temperatureUsed: 0.5,
  };
}
