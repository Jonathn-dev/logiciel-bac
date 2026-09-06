import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, Sparkles, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { LoginForm } from './auth-states/LoginForm';
import { RegisterForm } from './auth-states/RegisterForm';
import { ForgotPassword } from './auth-states/ForgotPassword';

export const AuthCard: React.FC = () => {
  const { currentMode, setAuthMode, successMessage, setSuccessMessage } = useAuthStore();

  return (
    <div className="w-full max-w-md mx-auto relative z-10 font-sans">
      {/* Outer subtle golden aura */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-amber-500/20 blur-xl opacity-75" />

      {/* Main Glassmorphism Card */}
      <div className="relative rounded-3xl border border-amber-400/30 bg-[#0c142e]/85 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Subtle geometric corner ornament */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-400/10 to-transparent pointer-events-none rounded-tr-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/10 to-transparent pointer-events-none rounded-bl-3xl" />

        {/* Global Success Notification Toast */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mb-5 p-3 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-between shadow-lg shadow-emerald-400/10"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-white/60 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Header Mode Tabs (Only for login / register) */}
        {(currentMode === 'login' || currentMode === 'register') && (
          <div className="grid grid-cols-2 p-1 mb-6 rounded-2xl bg-white/[0.05] border border-white/10">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                currentMode === 'login'
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                currentMode === 'register'
                  ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/20 font-black'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>حساب جديد</span>
            </button>
          </div>
        )}

        {/* Card Title & Subtitle */}
        <div className="text-right mb-6 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 font-bold">
              باكالوريا الجزائر 2026
            </span>
            <div className="flex items-center gap-1 text-[11px] text-white/40 font-mono">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              <span>حماية وتشفير JWT</span>
            </div>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-black text-white pt-1">
            {currentMode === 'login' && 'مرحباً بك في منصة البكالوريا'}
            {currentMode === 'register' && 'انضم إلى نخبة المتفوقين في الباك'}
            {currentMode === 'forgot-password' && 'استرجاع الوصول إلى حسابك'}
          </h2>

          <p className="text-xs text-white/60">
            {currentMode === 'login' && 'سجل دخولك لمتابعة خطتك اليومية، حفظ المصطلحات، وتجميع نقاط XP.'}
            {currentMode === 'register' && 'سجل حسابك مجاناً للوصول إلى كافة أدوات المراجعة والخرائط التفاعلية.'}
            {currentMode === 'forgot-password' && 'اتبع الخطوات البسيطة لتأكيد هويتك وتعيين كلمة سر جديدة.'}
          </p>
        </div>

        {/* Active State View */}
        <AnimatePresence mode="wait">
          {currentMode === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <LoginForm />
            </motion.div>
          )}

          {currentMode === 'register' && (
            <motion.div
              key="register"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <RegisterForm />
            </motion.div>
          )}

          {currentMode === 'forgot-password' && (
            <motion.div
              key="forgot-password"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ForgotPassword />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
