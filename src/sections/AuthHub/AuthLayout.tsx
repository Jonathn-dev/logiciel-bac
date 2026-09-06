import React from 'react';
import { motion } from 'motion/react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Map,
  Calendar,
  Flame,
  GraduationCap,
  Award,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { ConstellationCanvas } from '../../components/auth/ConstellationCanvas';
import { AuthCard } from './AuthCard';

interface AuthLayoutProps {
  onClose?: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ onClose }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#070b19] text-white flex flex-col justify-between overflow-x-hidden selection:bg-amber-400 selection:text-stone-950">
      {/* Background Interactive Constellation & Islamic Motifs Canvas */}
      <ConstellationCanvas />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-5 flex items-center justify-between">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-teal-400 p-[2px] shadow-xl shadow-amber-400/20">
            <div className="w-full h-full bg-[#090f26] rounded-[14px] flex items-center justify-center">
              <Compass className="w-6 h-6 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-black text-white tracking-tight">
                Atlas BAC
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold">
                الجزائر 2026
              </span>
            </div>
            <p className="text-[11px] text-white/50">المنظومة البيداغوجية الشاملة للتاريخ والجغرافيا</p>
          </div>
        </div>

        {/* Close or Back Button (if opened in overlay mode) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all cursor-pointer flex items-center gap-2"
          >
            <span>متابعة كزائر</span>
            <span>✕</span>
          </button>
        )}
      </header>

      {/* Main Split Layout: 60% Left Illustration / 40% Right Form */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side (Desktop 60% / 7 cols): Animated Student Lantern & Floating Heritage Elements */}
          <div className="hidden lg:flex lg:col-span-7 flex-col justify-center text-right space-y-8 pr-4">
            
            {/* Arabic Calligraphy & Gold Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-400/5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>المنهاج الرسمي المعتمد لوزارة التربية الوطنية الجزائرية</span>
              </div>

              <h1 className="font-serif text-4xl xl:text-5xl font-black tracking-tight leading-tight">
                <span className="text-white">فضاء المتفوقين في </span>
                <br />
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-teal-300 bg-clip-text text-transparent drop-shadow-sm font-serif">
                  «باك تاريخ وجغرافيا»
                </span>
              </h1>

              <p className="text-base text-[#dfe0ff]/80 max-w-xl font-medium leading-relaxed">
                من الحفظ إلى الإتقان — رحلتك نحو النجاح والامتياز في شهادة البكالوريا تبدأ هنا. خطط مخصصة، خرائط ذكية، وبطاقات استذكار متطورة.
              </p>
            </div>

            {/* Large Animated Illustration Composition: Student under glowing lantern with orbiting elements */}
            <div className="relative w-full max-w-lg h-72 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 p-6 flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-md">
              
              {/* Central Glowing Lantern Light Beam */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-400/25 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-300/40 rounded-full blur-md" />

              {/* Lantern Visual */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-1 h-8 bg-amber-400/60" />
                <div className="w-8 h-10 rounded-lg bg-amber-400/30 border border-amber-400/80 flex items-center justify-center shadow-lg shadow-amber-400/40">
                  <div className="w-3 h-5 bg-amber-300 rounded-full animate-pulse shadow-md shadow-amber-300" />
                </div>
              </div>

              {/* Central Student Study Silhouette Graphic */}
              <div className="relative z-10 text-center mt-12 space-y-2">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400/20 to-teal-400/20 border border-amber-400/40 flex items-center justify-center mx-auto shadow-xl">
                  <GraduationCap className="w-10 h-10 text-amber-300" />
                </div>
                <div className="text-xs font-bold text-white font-serif">
                  جاهزية تامة لاجتياز الامتحان الوطني
                </div>
              </div>

              {/* Orbiting Historical Badge 1: 1954 اندلاع الثورة */}
              <motion.div
                animate={{
                  y: [-6, 6, -6],
                  rotate: [-2, 2, -2],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-6 p-2.5 rounded-2xl bg-[#09132b]/90 border border-amber-400/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs"
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-mono font-black text-amber-300">01 نوفمبر 1954</div>
                  <div className="text-[10px] text-white/60">اندلاع الثورة التحريرية</div>
                </div>
              </motion.div>

              {/* Orbiting Historical Badge 2: 1956 مؤتمر الصومام */}
              <motion.div
                animate={{
                  y: [6, -6, 6],
                  rotate: [2, -2, 2],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-8 right-8 p-2.5 rounded-2xl bg-[#09132b]/90 border border-teal-400/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs"
              >
                <BookOpen className="w-4 h-4 text-teal-400" />
                <div>
                  <div className="font-mono font-black text-teal-300">20 أوت 1956</div>
                  <div className="text-[10px] text-white/60">مؤتمر الصومام والهيكلة</div>
                </div>
              </motion.div>

              {/* Orbiting Historical Badge 3: 1962 الاستقلال */}
              <motion.div
                animate={{
                  y: [-8, 4, -8],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-12 left-6 p-2.5 rounded-2xl bg-[#09132b]/90 border border-emerald-400/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs"
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-mono font-black text-emerald-300">05 جويلية 1962</div>
                  <div className="text-[10px] text-white/60">استقلال الجزائر</div>
                </div>
              </motion.div>

              {/* Orbiting Geographical Badge 4: الجزائر والجغرافيا */}
              <motion.div
                animate={{
                  y: [5, -5, 5],
                }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute bottom-6 left-8 p-2.5 rounded-2xl bg-[#09132b]/90 border border-cyan-400/40 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <div>
                  <div className="font-black text-cyan-300">خرائط الجزائر والعالم</div>
                  <div className="text-[10px] text-white/60">القوى الاقتصادية وOPEC</div>
                </div>
              </motion.div>
            </div>

            {/* 3 Pillars Summary Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-right">
                <div className="text-amber-400 font-mono font-black text-lg">16</div>
                <div className="text-xs font-bold text-white">وضعية تعلمية</div>
                <div className="text-[10px] text-white/50">تاريخ وجغرافيا معتمدة</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-right">
                <div className="text-teal-400 font-mono font-black text-lg">+180</div>
                <div className="text-xs font-bold text-white">مصطلح وشخصية</div>
                <div className="text-[10px] text-white/50">تعريفات نموذجية وزارية</div>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-right">
                <div className="text-emerald-400 font-mono font-black text-lg">58</div>
                <div className="text-xs font-bold text-white">ولاية جزائرية</div>
                <div className="text-[10px] text-white/50">لجميع الشعب والولايات</div>
              </div>
            </div>

          </div>

          {/* Right Side (Desktop 40% / 5 cols): Authentication Card */}
          <div className="lg:col-span-5 w-full flex items-center justify-center">
            <AuthCard />
          </div>

        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="relative z-20 w-full py-4 text-center text-xs text-white/40 border-t border-white/5">
        <p>
          منصة Atlas BAC التعليمية 2026 • متوافقة مع منهاج وزارة التربية الوطنية الجزائرية
        </p>
      </footer>
    </div>
  );
};
