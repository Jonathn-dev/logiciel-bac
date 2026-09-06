import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, LogIn } from 'lucide-react';
import { FloatingInput } from '../../../components/auth/FloatingInput';
import { PasswordField } from '../../../components/auth/PasswordField';
import { useAuthStore } from '../../../store/authStore';

export const LoginForm: React.FC = () => {
  const { login, setAuthMode, isLoading, error } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!identifier.trim()) {
      setFormError('يرجى إدخال البريد الإلكتروني أو رقم الهاتف أو اسم المستخدم.');
      return;
    }

    if (!password) {
      setFormError('يرجى إدخال كلمة المرور.');
      return;
    }

    await login(identifier, password, rememberMe);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-right">
      {/* Identifier field (Email / Phone / Username) */}
      <FloatingInput
        id="login-identifier"
        label="البريد الإلكتروني أو رقم الهاتف"
        value={identifier}
        onChange={(e) => {
          setIdentifier(e.target.value);
          setFormError(null);
        }}
        error={formError || error}
        required
        disabled={isLoading}
        autoComplete="username"
        icon={<Mail className="w-4 h-4" />}
      />

      {/* Password field */}
      <PasswordField
        id="login-password"
        label="كلمة المرور"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setFormError(null);
        }}
        disabled={isLoading}
        autoComplete="current-password"
      />

      {/* Remember me + Forgot password */}
      <div className="flex items-center justify-between text-xs pt-1">
        <label className="flex items-center gap-2 text-white/70 hover:text-white cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded-lg bg-white/10 border-white/20 text-amber-400 focus:ring-amber-400/30 accent-amber-400"
          />
          <span>تذكر بيانات دخولي</span>
        </label>

        <button
          type="button"
          onClick={() => setAuthMode('forgot-password')}
          className="text-amber-400 hover:text-amber-300 hover:underline font-bold transition-colors cursor-pointer"
        >
          نسيت كلمة المرور؟
        </button>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4 text-stone-950 group-hover:translate-x-[-2px] transition-transform" />
            <span>تسجيل الدخول إلى فضاء الباك</span>
          </>
        )}
      </button>

      {/* Switch to Register */}
      <div className="pt-4 text-center text-xs text-white/60 border-t border-white/10">
        <span>ليس لديك حساب بعد؟ </span>
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
        >
          إنشاء حساب طالب جديد مجاناً
        </button>
      </div>
    </form>
  );
};
