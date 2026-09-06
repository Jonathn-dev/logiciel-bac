import { EnhancedEssayTopic, KeywordMatchRule } from '../data/essayTopicsData';

export interface SectionEvaluationResult {
  score: number;
  maxScore: number;
  matchedKeywords: { keyword: string; explanation: string; points: number }[];
  missingKeywords: { keyword: string; explanation: string; tips?: string }[];
  bulletCount?: number;
  feedback: string[];
  status: 'excellent' | 'good' | 'needs_work' | 'empty';
}

export interface DetailedEssayEvaluation {
  totalScore: number;
  maxTotalScore: number;
  gradePercentage: number;
  verdict: 'علامة كاملة امتياز (Full Marks)' | 'مستوى جيد جداً (Very Good)' | 'مستوى مقبول يحتاج تدقيق (Fair)' | 'يحتاج إعادة صياغة منهجية (Revision Needed)';
  introResult: SectionEvaluationResult;
  body1Result: SectionEvaluationResult;
  body2Result: SectionEvaluationResult;
  conclusionResult: SectionEvaluationResult;
  strengths: string[];
  criticalWarnings: string[];
  suggestedImprovements: string[];
}

function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[ًٌٍَُِّْ]/g, '') // remove diacritics
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .toLowerCase()
    .trim();
}

function checkKeywordMatch(normalizedText: string, rule: KeywordMatchRule): boolean {
  const normKey = normalizeArabicText(rule.keyword);
  if (normalizedText.includes(normKey)) return true;
  if (rule.synonyms) {
    for (const syn of rule.synonyms) {
      if (normalizedText.includes(normalizeArabicText(syn))) return true;
    }
  }
  return false;
}

function countBulletPoints(text: string): number {
  if (!text) return 0;
  const lines = text.split('\n');
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('•') ||
      trimmed.startsWith('-') ||
      trimmed.startsWith('*') ||
      /^\d+[\.\-\)]/.test(trimmed)
    ) {
      count++;
    }
  }
  // Fallback if user typed bullets without linebreaks
  if (count === 0) {
    const bulletMatches = text.match(/[•\-\*]/g);
    if (bulletMatches) count = bulletMatches.length;
  }
  return count;
}

export function evaluateEssaySection(
  rawText: string,
  sectionType: 'intro' | 'body1' | 'body2' | 'conclusion',
  topic: EnhancedEssayTopic
): SectionEvaluationResult {
  const normalized = normalizeArabicText(rawText);
  const feedback: string[] = [];
  const matchedKeywords: { keyword: string; explanation: string; points: number }[] = [];
  const missingKeywords: { keyword: string; explanation: string; tips?: string }[] = [];

  if (!rawText.trim()) {
    return {
      score: 0,
      maxScore: sectionType === 'intro' || sectionType === 'conclusion' ? 0.5 : 1.5,
      matchedKeywords: [],
      missingKeywords: [],
      bulletCount: 0,
      feedback: ['الخانة فارغة، يرجى كتابة إجابتك للتقييم.'],
      status: 'empty',
    };
  }

  if (sectionType === 'intro') {
    const rubric = topic.criteriaRubric.intro;
    let score = 0;
    const hasQuestions = rawText.includes('؟') || rawText.includes('?');

    // Context / Framing check
    if (rawText.trim().length >= 35) {
      score += 0.2;
      feedback.push('تمهيد مناسب يحدد الإطار العام للموضوع.');
    } else {
      feedback.push('التمهيد قصير جداً، يفضل تحديد الإطار الزمني والمكاني.');
    }

    // Question formulation
    if (hasQuestions) {
      score += 0.3;
      matchedKeywords.push({
        keyword: 'طرح التساؤلين الإشكاليين (؟)',
        explanation: 'تمت صياغة الإشكالية بعلامات استفهام واضحة',
        points: 0.3,
      });
    } else {
      missingKeywords.push({
        keyword: 'صياغة التساؤلين (؟)',
        explanation: 'طرح الإشكالية والتساؤلين بصيغة استفهامية صريحة تنتهي بـ (؟)',
        tips: 'اطرح السؤالين المطلوبين في نهاية المقدمة تماماً.',
      });
      feedback.push('تنبيه منهجي: المقدمة تخلو من علامات الاستفهام (؟) لطرح الإشكالية.');
    }

    // Check optional keywords
    for (const rule of rubric.requiredKeywords) {
      if (rule.keyword === '؟') continue;
      if (checkKeywordMatch(normalized, rule)) {
        matchedKeywords.push({
          keyword: rule.keyword,
          explanation: rule.explanation,
          points: rule.weight,
        });
      }
    }

    const finalScore = Math.min(rubric.maxScore, Math.round(score * 10) / 10);
    return {
      score: finalScore,
      maxScore: rubric.maxScore,
      matchedKeywords,
      missingKeywords,
      feedback,
      status: finalScore >= 0.4 ? 'excellent' : finalScore >= 0.25 ? 'good' : 'needs_work',
    };
  }

  if (sectionType === 'conclusion') {
    const rubric = topic.criteriaRubric.conclusion;
    let score = 0;
    const isLongEnough = rawText.trim().length >= 30;

    if (isLongEnough) {
      score += 0.25;
      feedback.push('خاتمة بحجم مناسب تعبر عن استنتاج شامل.');
    } else {
      feedback.push('الخاتمة مقتضبة جداً، ينبغي كتابة استنتاج تركيبي من سطرين أو ثلاثة.');
    }

    for (const rule of rubric.requiredKeywords) {
      if (checkKeywordMatch(normalized, rule)) {
        score += rule.weight;
        matchedKeywords.push({
          keyword: rule.keyword,
          explanation: rule.explanation,
          points: rule.weight,
        });
      } else {
        missingKeywords.push({
          keyword: rule.keyword,
          explanation: rule.explanation,
          tips: 'أضف عبارة استنتاجية أو فتح آفاق للمستقبل.',
        });
      }
    }

    const finalScore = Math.min(rubric.maxScore, Math.round(score * 10) / 10);
    return {
      score: finalScore,
      maxScore: rubric.maxScore,
      matchedKeywords,
      missingKeywords,
      feedback,
      status: finalScore >= 0.4 ? 'excellent' : finalScore >= 0.25 ? 'good' : 'needs_work',
    };
  }

  // BODY SECTIONS (body1 or body2)
  const rubric = sectionType === 'body1' ? topic.criteriaRubric.bodyPart1 : topic.criteriaRubric.bodyPart2;
  const bulletCount = countBulletPoints(rawText);
  let score = 0;

  // 1. Structure score (bullet points formatting)
  if (bulletCount >= 4) {
    score += 0.4;
    feedback.push(`التزام ممتاز بنظام المطّات المنهجي (${bulletCount} مطّات محددة).`);
  } else if (bulletCount >= 2) {
    score += 0.2;
    feedback.push(`تم رصد ${bulletCount} مطّات. يستحسن توسيع الإجابة إلى 4 إلى 6 مطّات.`);
  } else {
    feedback.push('تحذير منهجي: لم يتم تفكيك الإجابة إلى مطّات (•). ينقص المصحح علامة الهيكلة!');
  }

  // 2. Keyword & Concept matching
  for (const rule of rubric.requiredKeywords) {
    if (checkKeywordMatch(normalized, rule)) {
      score += rule.weight;
      matchedKeywords.push({
        keyword: rule.keyword,
        explanation: rule.explanation,
        points: rule.weight,
      });
    } else {
      missingKeywords.push({
        keyword: rule.keyword,
        explanation: rule.explanation,
        tips: rule.synonyms ? `مصطلحات بديلة: ${rule.synonyms.join(', ')}` : undefined,
      });
    }
  }

  const finalScore = Math.min(rubric.maxScore, Math.round(score * 10) / 10);
  return {
    score: finalScore,
    maxScore: rubric.maxScore,
    matchedKeywords,
    missingKeywords,
    bulletCount,
    feedback,
    status: finalScore >= 1.25 ? 'excellent' : finalScore >= 0.75 ? 'good' : 'needs_work',
  };
}

export function evaluateFullEssay(
  intro: string,
  body1: string,
  body2: string,
  conclusion: string,
  topic: EnhancedEssayTopic
): DetailedEssayEvaluation {
  const introResult = evaluateEssaySection(intro, 'intro', topic);
  const body1Result = evaluateEssaySection(body1, 'body1', topic);
  const body2Result = evaluateEssaySection(body2, 'body2', topic);
  const conclusionResult = evaluateEssaySection(conclusion, 'conclusion', topic);

  const rawTotal = introResult.score + body1Result.score + body2Result.score + conclusionResult.score;
  const totalScore = Math.min(4.0, Math.round(rawTotal * 10) / 10);
  const gradePercentage = Math.round((totalScore / 4.0) * 100);

  let verdict: DetailedEssayEvaluation['verdict'] = 'يحتاج إعادة صياغة منهجية (Revision Needed)';
  if (totalScore >= 3.5) {
    verdict = 'علامة كاملة امتياز (Full Marks)';
  } else if (totalScore >= 2.75) {
    verdict = 'مستوى جيد جداً (Very Good)';
  } else if (totalScore >= 2.0) {
    verdict = 'مستوى مقبول يحتاج تدقيق (Fair)';
  }

  const strengths: string[] = [];
  const criticalWarnings: string[] = [];
  const suggestedImprovements: string[] = [];

  // Identify strengths
  if (introResult.status === 'excellent') strengths.push('مقدمة نموذجية وإشكالية مصاغة بدقة وعلامات استفهام واضحة.');
  if (body1Result.bulletCount && body1Result.bulletCount >= 4) strengths.push('تفكيك منهجي مثالي للعنصر الأول بنظام المطّات المستقلة.');
  if (body2Result.bulletCount && body2Result.bulletCount >= 4) strengths.push('عرض غني بالمفاهيم والشواهد الرسمية للعنصر الثاني.');
  if (conclusionResult.status === 'excellent') strengths.push('خاتمة تركيبيّة واستنتاج وافٍ غير مكرر للعرض.');

  // Identify critical warnings
  if (!intro.includes('؟') && !intro.includes('?')) {
    criticalWarnings.push('نسيان التساؤلين في المقدمة يفقدك 0.25 إلى 0.5 نقطة فوراً في البكالوريا.');
  }
  if ((body1Result.bulletCount || 0) < 2) {
    criticalWarnings.push('العنصر الأول غير مفكك إلى مطّات نقطية. حذارِ من كتابة فقرة مدمجة.');
  }
  if ((body2Result.bulletCount || 0) < 2) {
    criticalWarnings.push('العنصر الثاني غير مفكك إلى مطّات نقطية. احرص على البدء بـ • لكل فكرة.');
  }

  // Suggest improvements from missing keywords
  if (body1Result.missingKeywords.length > 0) {
    suggestedImprovements.push(
      `في العنصر 1: ركز على تضمين: ${body1Result.missingKeywords.slice(0, 3).map((m) => m.keyword).join('، ')}.`
    );
  }
  if (body2Result.missingKeywords.length > 0) {
    suggestedImprovements.push(
      `في العنصر 2: ركز على تضمين: ${body2Result.missingKeywords.slice(0, 3).map((m) => m.keyword).join('، ')}.`
    );
  }

  return {
    totalScore,
    maxTotalScore: 4.0,
    gradePercentage,
    verdict,
    introResult,
    body1Result,
    body2Result,
    conclusionResult,
    strengths,
    criticalWarnings,
    suggestedImprovements,
  };
}
