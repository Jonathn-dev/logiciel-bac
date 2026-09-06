import React from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, ArrowLeft } from 'lucide-react';
import { QuickAccessItem } from '../../types';
import { HexButton } from './HexButton';

interface AccessGridProps {
  onSelectItem: (item: QuickAccessItem) => void;
}

export const DEFAULT_QUICK_ACCESS: QuickAccessItem[] = [
  {
    id: 'upload-docs',
    title: 'رفع الوثائق',
    subtitle: 'PDF و كراس الطالب',
    icon: 'Upload',
    badge: 'تحميل فوري',
    color: 'gold',
    route: 'upload',
  },
  {
    id: 'learning-space',
    title: 'فضاء الدروس',
    subtitle: 'شاشات تفاعلية 4D',
    icon: 'Compass',
    badge: 'جديد',
    color: 'gold',
    route: 'learning_space',
  },
  {
    id: 'analytics-dashboard',
    title: 'لوحة التحليلات',
    subtitle: 'مؤشر الجاهزية والـ AI',
    icon: 'BarChart3',
    badge: 'BAC 2026',
    color: 'amber',
    route: 'analytics',
  },
  {
    id: 'knowledge-hub',
    title: 'قسم الملخصات',
    subtitle: 'الذاكرة المتجهية RAG',
    icon: 'Database',
    badge: 'RAG Gate',
    color: 'cyan',
    route: 'knowledge',
  },
  {
    id: 'doc-analysis',
    title: 'تحليل الوثائق',
    subtitle: 'مطابقة الإطار المرجعي',
    icon: 'ScanText',
    badge: 'AI Core',
    color: 'cyan',
    route: 'analysis',
  },
  {
    id: 'essay-studio',
    title: 'صانع المقالات',
    subtitle: 'منهجية المقدمة والعرض',
    icon: 'PenTool',
    badge: 'منهجية 04/04',
    color: 'emerald',
    route: 'essay',
  },
  {
    id: 'terms-bank',
    title: 'بنك المصطلحات',
    subtitle: 'أعلام ومفاهيم رسمية',
    icon: 'BookMarked',
    badge: '180 مصطلح',
    color: 'gold',
    route: 'terms',
  },
  {
    id: 'cartography',
    title: 'الخرائط التفاعلية',
    subtitle: 'توطين وتاريخ التقسيم',
    icon: 'MapPin',
    badge: 'أطالس',
    color: 'indigo',
    route: 'maps',
  },
  {
    id: 'speed-quizzes',
    title: 'تحدي السرعة',
    subtitle: 'معارك وFlashcards',
    icon: 'Zap',
    badge: '+150 XP',
    color: 'rose',
    route: 'quiz',
  },
  {
    id: 'settings-hub',
    title: 'مركز الإعدادات',
    subtitle: 'تخصيص وRAG Hub',
    icon: 'Settings',
    badge: 'إعدادات',
    color: 'gold',
    route: 'settings',
  },
];

export const AccessGrid: React.FC<AccessGridProps> = ({ onSelectItem }) => {
  return (
    <div className="atlas-glass rounded-2xl p-5 sm:p-6 border border-[#59dad1]/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 border-b border-[#59dad1]/15 pb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#59dad1]/15 border border-[#59dad1]/30 text-[#59dad1]">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              منصة الوصول السريع (Quick Access)
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffe16d]/15 text-[#ffe16d] border border-[#ffe16d]/30">
                أدوات الباك المتكاملة
              </span>
            </h3>
            <p className="text-xs text-[#a2a6d0]">
              أدوات تفاعلية ثلاثية الأبعاد لمراجعة الدروس، المصطلحات، المقالات، والتحليلات الذكية
            </p>
          </div>
        </div>

        <span className="text-xs text-[#59dad1] hidden sm:flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          تفاعلي 3D
        </span>
      </div>

      {/* Hex Grid with Staggered Viewport Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
        className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-10 gap-3 sm:gap-4 justify-items-center py-2"
      >
        {DEFAULT_QUICK_ACCESS.map((item) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.9 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
          >
            <HexButton item={item} onClick={onSelectItem} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
