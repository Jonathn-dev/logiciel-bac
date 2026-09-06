import { Router } from 'express';
import { authenticateJwt } from '../middleware/auth.js';

const router = Router();

// In-memory curriculum vector mock cache for BAC RAG search
const bacVectorKnowledgeBase = [
  {
    id: 'doc-1',
    chapter: 'الثورة التحريرية الكبرى (1954 - 1962)',
    subject: 'history',
    text: 'مؤتمر الصومام 20 أوت 1956 بقرية إفري أوزلاقن: هيكلة الثورة، إنشاء المجلس الوطني للثورة CNRA ولجنة التنسيق والتنفيذ CCE، إقرار أولوية السياسي على العسكري والداخل على الخارج، وتقسيم الجزائر إلى 6 ولايات عسكرية.',
    tags: ['مؤتمر الصومام', '1956', 'الولايات الست', 'CNRA', 'CCE']
  },
  {
    id: 'doc-2',
    chapter: 'تطور العالم في ظل القطبية الثنائية (1945 - 1989)',
    subject: 'history',
    text: 'استراتيجيات الحرب الباردة: المشاريع الاقتصادية (مبدأ ترومان 1947، مشروع مارشال 1947، مشروع أيزنهاور 1957، منظمة الكوميكون 1949)، الأحلاف العسكرية (حلف شمال الأطلسي الناتو 1949، حلف وارسو 1955، حلف جنوب شرق آسيا سياتو).',
    tags: ['الحرب الباردة', 'مشروع مارشال', 'حلف الناتو', 'حلف وارسو']
  },
  {
    id: 'doc-3',
    chapter: 'إشكالية التقدم والتخلف وأسواق المبادلات العالمية',
    subject: 'geography',
    text: 'منظمة الدول المصدرة للبترول (OPEC) تأسست في بغداد سبتمبر 1960 من 5 دول مؤسسة: السعودية، العراق، الكويت، إيران، فنزويلا. هدفها حماية مصالح الدول المنتجة وضبط أسعار المحروقات ومواجهة الشركات الاحتكارية (الشقيقات السبع).',
    tags: ['أوبك', 'البترول', 'الغاز', 'المبادلات', 'OPEC']
  },
  {
    id: 'doc-4',
    chapter: 'القوى الاقتصادية الكبرى في العالم',
    subject: 'geography',
    text: 'الاتحاد الأوروبي: قطب اقتصادي عالمي تأسس بمعاهدة ماستريخت 1992 كامتداد للمجموعة الاقتصادية الأوروبية (معاهدة روما 1957). يتميز بالقوة التجارية والزراعية المشتركة (PAC) واستخدام العملة الموحدة (اليورو) مع تحديات التفاوت الإقليمي.',
    tags: ['الاتحاد الأوروبي', 'معاهدة روما', 'ماستريخت', 'اليورو']
  }
];

router.post('/search', authenticateJwt, (req, res) => {
  const { query, subject, limit = 4 } = req.body;
  const qLower = (query || '').toLowerCase();

  const results = bacVectorKnowledgeBase.filter(item => {
    if (subject && item.subject !== subject) return false;
    if (!query) return true;
    return item.text.toLowerCase().includes(qLower) || item.tags.some(t => t.toLowerCase().includes(qLower));
  }).slice(0, limit);

  res.json({
    query,
    count: results.length,
    results: results.length > 0 ? results : bacVectorKnowledgeBase.slice(0, limit)
  });
});

export default router;
