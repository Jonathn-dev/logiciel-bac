import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Shield,
  Building2,
  Calendar,
  Award,
  LogOut,
  Sparkles,
  Flame,
  Zap,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { UserStats } from '../../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onOpenAuthHub: () => void;
  onOpenSettings?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onOpenAuthHub,
  onOpenSettings,
}) => {
  const { currentUser, isAuthenticated, logout } = useAuthStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg rounded-3xl bg-[#0c142e] border border-amber-400/30 p-6 sm:p-8 shadow-2xl shadow-black/80 text-right font-sans overflow-hidden"
        >
          {/* Top Banner & Close */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all cursor-pointer text-xs"
            >
              إغلاق ✕
            </button>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-black text-white">ملف طالب البكالوريا</span>
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* User Hero Avatar & Status */}
          <div className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={
                currentUser?.avatarUrl ||
                userStats.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={currentUser?.name || userStats.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl shadow-amber-400/20"
            />
            <div className="space-y-1.5 text-center sm:text-right flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="font-serif text-xl font-black text-white">
                  {currentUser?.name || userStats.name}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 font-bold">
                  طالب نظامي نشط
                </span>
              </div>

              <p className="text-xs text-white/60 font-mono">
                {currentUser?.email || `${userStats.userId}@bac.dz`}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[11px] px-2.5 py-1 rounded-xl bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{userStats.totalXP} XP</span>
                </span>

                <span className="text-[11px] px-2.5 py-1 rounded-xl bg-teal-400/15 text-teal-300 border border-teal-400/30 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>سلسلة {userStats.streakDays} يوماً</span>
                </span>
              </div>
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="text-[10px] text-white/50 flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>الشعبة</span>
              </div>
              <div className="text-xs font-bold text-white">
                {currentUser?.branch || 'شعبة آداب وفلسفة'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="text-[10px] text-white/50 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>الولاية</span>
              </div>
              <div className="text-xs font-bold text-white">
                {currentUser?.wilayaCode
                  ? `${currentUser.wilayaCode} - ولاية ${currentUser.wilayaName}`
                  : '16 - الجزائر العاصمة'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="text-[10px] text-white/50 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>نوع الحساب</span>
              </div>
              <div className="text-xs font-bold text-emerald-300">
                {currentUser?.role === 'admin' ? 'مشرف بيداغوجي' : 'طالب بكالوريا 2026'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
              <div className="text-[10px] text-white/50 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>المؤسسة التعليمية</span>
              </div>
              <div className="text-xs font-bold text-cyan-300 truncate">
                {currentUser?.highSchool || 'ثانوية البكالوريا'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            {onOpenSettings && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSettings();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Settings className="w-4 h-4 text-amber-400" />
                <span>فتح مركز الإعدادات والتخصيص</span>
              </button>
            )}

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthHub();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>تسجيل الدخول / إنشاء حساب</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthHub();
                }}
                className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>تبديل الحساب</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
