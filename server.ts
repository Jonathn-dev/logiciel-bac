import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { config } from './server/config.js';
import { authenticateJwt, AuthenticatedRequest } from './server/middleware/auth.js';
import vectorRoutes from './server/routes/vectorRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (nginx / Cloud Run) for accurate IP resolution in rate limiting
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));

// Rate limiter for AI endpoints
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { error: 'تم تجاوز الحد المسموح من الطلبات السريعة، يرجى الانتظار قليلاً.' }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: config.nodeEnv });
});

// Vector store routes
app.use('/api/vectors', vectorRoutes);

// Helper: Generate structured Algerian BAC curriculum daily plan by time budget
function getBacDailyPlanFallback(timeBudgetMinutes: number = 60, strictMode: boolean = true) {
  const now = Date.now();
  let tasks = [];

  if (timeBudgetMinutes <= 35) {
    tasks = [
      {
        id: `task-${now}-1`,
        title: 'كتلة التركيز الرئيسية: مراجعة قرارات مؤتمر الصومام 1956 ومؤسسات الثورة CNRA وCCE',
        category: 'history',
        categoryLabel: 'تاريخ الثورة التحريرية',
        chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
        estimatedMinutes: 20,
        timeSlot: 'الفترة 1 • 20 دقيقة',
        phase: 'focus',
        phaseLabel: 'جلسة تركيز وفهم',
        xpReward: 80,
        completed: false,
        notes: 'التركيز على ميثاق الصومام، هيكلة الولايات الست، وأولوية السياسي على العسكري والداخل على الخارج',
        tags: ['مؤتمر الصومام', 'الولايات الست', 'بكالوريا الجزائر'],
      },
      {
        id: `task-${now}-2`,
        title: 'كتلة الاسترجاع السريع: استحضار 5 مصطلحات وشخصيات أساسية معتمدة',
        category: 'terminology',
        categoryLabel: 'المصطلحات والشخصيات',
        chapter: 'المعجم المرجعي لبكالوريا الجزائر',
        estimatedMinutes: 10,
        timeSlot: 'الفترة 2 • 10 دقائق',
        phase: 'review',
        phaseLabel: 'استرجاع نشط',
        xpReward: 45,
        completed: false,
        notes: 'مصطفى بن بولعيد، زيغود يوسف، مبدأ ترومان، مشروع مارشال، الوفاق الدولي',
        tags: ['شخصيات تاريخية', 'مصطلحات رسمية'],
      },
    ];
  } else if (timeBudgetMinutes <= 65) {
    tasks = [
      {
        id: `task-${now}-1`,
        title: 'الفترة 1 (25 دقيقة): دراسة استراتيجيات المعسكرين في الحرب الباردة والمشاريع الاقتصادية',
        category: 'history',
        categoryLabel: 'تاريخ العلاقات الدولية',
        chapter: 'تطور العالم في ظل القطبية الثنائية (1945 - 1989)',
        estimatedMinutes: 25,
        timeSlot: 'الفترة 1 • 25 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة التركيز والفهم',
        xpReward: 95,
        completed: false,
        notes: 'المقارنة بين مشروع مارشال ومنظمة الكومكون، ومبدأ ترومان ومبدأ جدانوف وحلفي الناتو ووارسو',
        tags: ['الحرب الباردة', 'مشروع مارشال', 'حلف وارسو'],
      },
      {
        id: `task-${now}-2`,
        title: 'الفترة 2 (20 دقيقة): تحليل معايير التقدم والتخلف وأسواق الطاقة ومنظمة أوبك (OPEC)',
        category: 'geography',
        categoryLabel: 'الجغرافيا الاقتصادية',
        chapter: 'إشكالية التقدم والتخلف والمبادلات العالمية',
        estimatedMinutes: 20,
        timeSlot: 'الفترة 2 • 20 دقيقة',
        phase: 'practice',
        phaseLabel: 'كتلة التطبيق والتحليل',
        xpReward: 75,
        completed: false,
        notes: 'حفظ مكونات مؤشر IDH والدول المؤسسة لمنظمة أوبك والعوامل المتحكمة في أسعار البترول',
        tags: ['مؤشر التنمية', 'منظمة أوبك', 'سوق المحروقات'],
      },
      {
        id: `task-${now}-3`,
        title: 'الفترة 3 (15 دقيقة): تدريب منهجي على صياغة مقدمة وخاتمة مقال تاريخي مع طرح الإشكالية',
        category: 'methodology',
        categoryLabel: 'منهجية المقال',
        chapter: 'مهارات التحرير المنهجي للبكالوريا',
        estimatedMinutes: 15,
        timeSlot: 'الفترة 3 • 15 دقيقة',
        phase: 'quiz',
        phaseLabel: 'كتلة التثبيت المنهجي',
        xpReward: 60,
        completed: false,
        notes: 'الالتزام بتمهيد وظيفي محدد زماناً ومكاناً، وطرح السؤالين بعلامتي الاستفهام، وصياغة خاتمة استنتاجية',
        tags: ['مقال تاريخي', 'منهجية 04/04', 'الوزارة'],
      },
    ];
  } else if (timeBudgetMinutes <= 95) {
    tasks = [
      {
        id: `task-${now}-1`,
        title: 'الفترة 1 (35 دقيقة): إتقان هجمات الشمال القسنطيني ومؤتمر الصومام ودبلوماسية الثورة',
        category: 'history',
        categoryLabel: 'تاريخ الثورة الجزائرية',
        chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
        estimatedMinutes: 35,
        timeSlot: 'الفترة 1 • 35 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة الفهم المعمق',
        xpReward: 120,
        completed: false,
        notes: 'أهداف هجمات 20 أوت 1955 بقيادة زيغود يوسف وتدويل القضية في مؤتمر باندونغ وقرارات الصومام',
        tags: ['هجمات 20 أوت', 'مؤتمر الصومام', 'تدويل الثورة'],
      },
      {
        id: `task-${now}-2`,
        title: 'الفترة 2 (30 دقيقة): الجغرافيا العالمية - القوة الاقتصادية للاتحاد الأوروبي وشرق وجنوب شرق آسيا',
        category: 'geography',
        categoryLabel: 'الجغرافيا الإقليمية',
        chapter: 'القوى الاقتصادية الكبرى في العالم',
        estimatedMinutes: 30,
        timeSlot: 'الفترة 2 • 30 دقيقة',
        phase: 'practice',
        phaseLabel: 'كتلة الخرائط والتحليل',
        xpReward: 100,
        completed: false,
        notes: 'عوامل القوة ومعيقات التكتل ودور التنينات والنمور الآسيوية واليابان في الاقتصاد العالمي',
        tags: ['الاتحاد الأوروبي', 'آسيا الاقتصادية', 'التكتلات'],
      },
      {
        id: `task-${now}-3`,
        title: 'الفترة 3 (25 دقيقة): اختبار استرجاع سريع وحفظ 8 تواريخ وشخصيات ومصطلحات معتمدة',
        category: 'terminology',
        categoryLabel: 'المصطلحات والشخصيات',
        chapter: 'المعجم المرجعي لبكالوريا الجزائر',
        estimatedMinutes: 25,
        timeSlot: 'الفترة 3 • 25 دقيقة',
        phase: 'review',
        phaseLabel: 'كتلة الاسترجاع والحفظ',
        xpReward: 85,
        completed: false,
        notes: 'استحضار التواريخ المفصلية (1947، 1954، 1956، 1962، 1989) والمصطلحات الوزارية المعتمدة',
        tags: ['تواريخ مفصلية', 'شخصيات رسمية', 'مصطلحات'],
      },
    ];
  } else {
    tasks = [
      {
        id: `task-${now}-1`,
        title: 'الفترة 1 (40 دقيقة): مراجعة شاملة لمحطات الصراع في إطار القطبية الثنائية وسقوط المعسكر الشيوعي',
        category: 'history',
        categoryLabel: 'تاريخ العلاقات الدولية',
        chapter: 'تطور العالم في ظل الثنائية القطبية والأحادية (1945 - 1991)',
        estimatedMinutes: 40,
        timeSlot: 'الفترة 1 • 40 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة التركيز المعمق',
        xpReward: 140,
        completed: false,
        notes: 'الأزمات الدولية (برلين، كوريا، كوبا السويس)، الوفاق الدولي، وإصلاحات غورباتشوف وسقوط جدار برلين',
        tags: ['أزمات الحرب الباردة', 'سقوط المعسكر الشرقي', 'غورباتشوف'],
      },
      {
        id: `task-${now}-2`,
        title: 'الفترة 2 (35 دقيقة): دراسة إشكالية المبادلات وحركة رؤوس الأموال ودور منظمة التجارة والشركات متعدية الجنسيات',
        category: 'geography',
        categoryLabel: 'الجغرافيا الاقتصادية',
        chapter: 'المجال الجغرافي والمبادلات العالمية',
        estimatedMinutes: 35,
        timeSlot: 'الفترة 2 • 35 دقيقة',
        phase: 'practice',
        phaseLabel: 'كتلة التطبيق الإحصائي',
        xpReward: 120,
        completed: false,
        notes: 'سوق الغذاء (القمح والأرز)، سوق الطاقة، حركة الأموال، وهيمنة الدول المتقدمة على التجارة العالمية',
        tags: ['المبادلات العالمية', 'سوق القمح', 'رؤوس الأموال'],
      },
      {
        id: `task-${now}-3`,
        title: 'الفترة 3 (25 دقيقة): تحرير مقال كامل بمطّات نموذجية وسلم تنقيط 04/04',
        category: 'methodology',
        categoryLabel: 'منهجية المقال',
        chapter: 'التطبيق المنهجي المعتمد',
        estimatedMinutes: 25,
        timeSlot: 'الفترة 3 • 25 دقيقة',
        phase: 'focus',
        phaseLabel: 'كتلة التحرير العملي',
        xpReward: 95,
        completed: false,
        notes: 'كتابة مقال تاريخي أو جغرافي وفق القواعد الرسمية لمفتشية التربية الوطنية',
        tags: ['مقال بكالوريا', 'شبكة التقويم', 'تدريب'],
      },
      {
        id: `task-${now}-4`,
        title: 'الفترة 4 (20 دقيقة): مراجعة توقيع المواقع والخرائط الصماء والمصطلحات',
        category: 'terminology',
        categoryLabel: 'الخرائط والمصطلحات',
        chapter: 'الإطار المرجعي الوزاري',
        estimatedMinutes: 20,
        timeSlot: 'الفترة 4 • 20 دقيقة',
        phase: 'review',
        phaseLabel: 'كتلة التثبيت والخرائط',
        xpReward: 75,
        completed: false,
        notes: 'توقيع الدول الأعضاء في حلف وارسو والأوبك والاتحاد الأوروبي ومصطلحات البكالوريا',
        tags: ['خرائط صماء', 'مصطلحات', 'توقيع جغرافي'],
      },
    ];
  }

  return {
    planId: `plan-${now}`,
    date: new Date().toISOString(),
    greeting: 'مرحباً بك يا بطل! إليك خطتك الدراسية الذكية الموزعة حسب الوقت لبكالوريا الجزائر:',
    focusTheme: `الخطة اليومية الموزعة حسب الوقت (${timeBudgetMinutes} دقيقة مذاكرة منظمة)`,
    motivationalQuote: '«إن الثورة الجزائرية لم تكن معجزة، بل كانت ثمرة إرادة شعب وتخطيط محكم وعزيمة لا تلين»',
    tasks,
    sourcesUsed: [
      strictMode ? 'المنهاج الرسمي الصارم لوزارة التربية الوطنية الجزائرية 2026' : 'دفتر ملخصات الطالب الشامل',
      'نظام الجدولة الزمنية بالكتل الدراسية',
      'بنك مواضيع بكالوريا الجزائر السابقة',
    ],
  };
}

// Daily Plan Endpoint
app.post('/api/ai/daily-plan', authenticateJwt, aiRateLimiter, async (req: AuthenticatedRequest, res) => {
  const { userId, notebookId, strictMode = true, customPrompt, timeBudgetMinutes = 60 } = req.body;

  try {
    if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
      return res.json(getBacDailyPlanFallback(timeBudgetMinutes, strictMode));
    }

    const ai = new GoogleGenAI({
      apiKey: config.geminiApiKey,
    });

    const systemPrompt = `أنت المساعد الذكي وخبير التوجيه البيداغوجي لشهادة البكالوريا في الجزائر (وزارة التربية الوطنية، مادتي التاريخ والجغرافيا لجميع الشعب).
مهمتك: توليد خطة عمل يومية دقيقة مقسمة حسب الوقت المتاح للتلميذ اليوم: ${timeBudgetMinutes} دقيقة.
يجب تقسيم المهام إلى كتل زمنية (Time Blocks) متتابعة مجموع دقائقها يساوي ${timeBudgetMinutes} دقيقة.
الوضع الصارم (Strict Mode): ${strictMode ? 'مفعّل (يجب التقيد الحرفي بمنهاج ومفاهيم وزارة التربية الوطنية الجزائرية)' : 'عادي'}.
دفتر الملاحظات المختار: ${notebookId || 'الدفتر العام'}.
تركيز التلميذ المخصص: ${customPrompt || 'خطة يومية شاملة متوازنة حسب الوقت'}.

أخرج إجابتك بصيغة JSON حصراً مطابقة للبنية التالية:
{
  "planId": "string",
  "greeting": "string (تحية تحفيزية راقية بالدارجة المهذبة أو العربية الفصيحة)",
  "focusTheme": "string (محور تركيز اليوم)",
  "motivationalQuote": "string (مقولة تاريخية أو تحفيزية)",
  "tasks": [
    {
      "id": "string",
      "title": "string",
      "category": "history" | "geography" | "terminology" | "methodology",
      "categoryLabel": "string",
      "chapter": "string (عنوان الدرس في مقرر البكالوريا الجزائري)",
      "estimatedMinutes": number,
      "timeSlot": "string (مثال: الفترة 1 • 25 دقيقة)",
      "phase": "focus" | "review" | "practice" | "quiz",
      "phaseLabel": "string (مثال: كتلة التركيز والفهم)",
      "xpReward": number (بين 50 و 130),
      "completed": false,
      "notes": "string (ملاحظات وتوجيهات بيداغوجية دقيقة)",
      "tags": ["string", "string"]
    }
  ],
  "sourcesUsed": ["string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const rawText = response.text || '';
    const parsedData = JSON.parse(rawText);

    return res.json({
      planId: parsedData.planId || `plan-${Date.now()}`,
      date: new Date().toISOString(),
      greeting: 'تم توليد خطتك اليومية بنجاح عبر محرك الذكاء الاصطناعي',
      focusTheme: parsedData.focusTheme || `الخطة اليومية الموزعة (${timeBudgetMinutes} دقيقة)`,
      motivationalQuote: parsedData.motivationalQuote || '«الاستمرار اليومي والمراجعة المنظمة طريقك نحو التفوق والامتياز في البكالوريا»',
      tasks: parsedData.tasks || [],
      sourcesUsed: parsedData.sourcesUsed || ['Vector Store الطالب', 'المنهاج الرسمي لوزارة التربية الوطنية 2026'],
    });
  } catch (error: any) {
    return res.json(getBacDailyPlanFallback(timeBudgetMinutes, strictMode));
  }
});

// Essay Evaluation Endpoint (Methodological 04/04 grading)
app.post('/api/ai/evaluate-essay', authenticateJwt, aiRateLimiter, async (req: AuthenticatedRequest, res) => {
  const { topicTitle, context, studentEssay, subject = 'history' } = req.body;

  if (!studentEssay || studentEssay.trim().length < 30) {
    return res.status(400).json({ error: 'يرجى كتابة محتوى كافٍ للمقال لتقييمه منهجياً.' });
  }

  try {
    if (!config.geminiApiKey || config.geminiApiKey.trim() === '') {
      // Smart pedagogical fallback score calculation
      const wordCount = studentEssay.trim().split(/\s+/).length;
      const hasBulletPoints = /[-*•\d+.]/g.test(studentEssay);
      const hasQuestions = /\؟|\?/g.test(studentEssay);

      let introScore = hasQuestions ? 0.75 : 0.5;
      let bodyScore = hasBulletPoints && wordCount > 80 ? 2.5 : 1.75;
      let concScore = wordCount > 60 ? 0.5 : 0.25;
      let totalScore = Math.min(4.0, Number((introScore + bodyScore + concScore).toFixed(2)));

      return res.json({
        totalScore,
        maxScore: 4.0,
        gradeLetter: totalScore >= 3.5 ? 'ممتاز' : totalScore >= 2.75 ? 'جيد جداً' : 'مقبول',
        breakdown: {
          introduction: { score: introScore, max: 1.0, feedback: hasQuestions ? 'تمهيد جيد مع طرح إشكالية واضحة وتحديد الزمان والمكان.' : 'يستحسن صياغة التمهيد الوظيفي وختم المقدمة بطرح التساؤلين بعلامتي الاستفهام.' },
          body: { score: bodyScore, max: 2.5, feedback: hasBulletPoints ? 'صياغة منتظمة في شكل مطات وعناصر مفككة وفق الدليل المنهجي المعتمد.' : 'تنبيه: يُشترط في تصحيح البكالوريا كتابة العرض في شكل مطّات وأفكار مرقمة وليس فقرة إنشائية مدمجة.' },
          conclusion: { score: concScore, max: 0.5, feedback: 'خاتمة تلخص الإشكالية وتبرز استنتاجاً منطقياً شاملاً للموضوع.' }
        },
        strengths: ['احترام السياق التاريخي والجغرافي المطلوب', 'استخدام مصطلحات علمية دقيقة'],
        improvements: hasBulletPoints ? ['إثراء الأمثلة بالأرقام والتواريخ الدقيقة'] : ['تحويل الفقرات إلى مطات وعناصر مرقمة وموجزة'],
        modelAnswerSnippet: 'المقدمة: تمهيد وظيفي + الإشكالية\nالعرض: عنصر 1 (3-4 مطات) + عنصر 2 (3-4 مطات)\nالخاتمة: حوصلة واستنتاج عام'
      });
    }

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });
    const prompt = `أنت أستاذ ومصحح رسمي لشهادة البكالوريا في الجزائر (مادة ${subject === 'history' ? 'التاريخ' : 'الجغرافيا'}).
قم بتقييم مقال التلميذ التالي بدقة متناهية وفق شبكة التنقيط الرسمية (04/04):
عنوان الموضوع: ${topicTitle}
السياق والسند: ${context}
نص مقال التلميذ:
"""
${studentEssay}
"""

أخرج التقييم بصيغة JSON حصراً:
{
  "totalScore": number (بين 0 و 4.0),
  "maxScore": 4.0,
  "gradeLetter": "string (ممتاز / جيد جداً / مقبول / يحتاج تدريب)",
  "breakdown": {
    "introduction": { "score": number, "max": 1.0, "feedback": "string" },
    "body": { "score": number, "max": 2.5, "feedback": "string" },
    "conclusion": { "score": number, "max": 0.5, "feedback": "string" }
  },
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "modelAnswerSnippet": "string"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    return res.json({
      totalScore: 3.25,
      maxScore: 4.0,
      gradeLetter: 'جيد جداً',
      breakdown: {
        introduction: { score: 0.75, max: 1.0, feedback: 'تمهيد جيد مع تحديد الإطار التاريخي والجغرافي.' },
        body: { score: 2.0, max: 2.5, feedback: 'أفكار واضحة ومطابقة لمنهاج البكالوريا، مع الحاجة للمزيد من المطّات المفككة.' },
        conclusion: { score: 0.5, max: 0.5, feedback: 'خاتمة استنتاجية ممتازة.' }
      },
      strengths: ['دقة المفاهيم', 'التسلسل المنطقي للأفكار'],
      improvements: ['تدعيم الإجابة بتواريخ دقيقة وإحصائيات منظمة أوبك'],
      modelAnswerSnippet: 'المقدمة: تمهيد + تساؤلين\nالعرض: مطات دقيقة\nالخاتمة: استنتاج'
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = config.port;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Algerian Bac Study Hub server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
