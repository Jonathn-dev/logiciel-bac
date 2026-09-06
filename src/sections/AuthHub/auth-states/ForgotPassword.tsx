import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, KeyRound, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw, ShieldAlert, Sparkles } from 'lucide-react';
import { FloatingInput } from '../../../components/auth/FloatingInput';
import { PasswordField } from '../../../components/auth/PasswordField';
import { OTPInput } from '../../../components/auth/OTPInput';
import { useAuthStore } from '../../../store/authStore';
import { useOtpTimer } from '../../../hooks/useOtpTimer';
import { authApi } from '../../../services/authApi';

export const ForgotPassword: React.FC = () => {
  const {
    forgotPasswordData,
    forgotPasswordStep,
    setForgotPasswordStep,
    updateForgotPasswordData,
    setAuthMode,
    setSuccessMessage,
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);

  const otpTimer = useOtpTimer(60);

  // Step 1: Send reset OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!forgotPasswordData.email.trim() || !forgotPasswordData.email.includes('@')) {
      setError('يرجى إدخال عنوان بريد إلكتروني صالح.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.requestPasswordReset(forgotPasswordData.email);
      if (res.debugCode) {
        setDebugOtp(res.debugCode);
      }
      otpTimer.startTimer(60);
      setForgotPasswordStep(2);
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال رمز استعادة الحساب.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (forgotPasswordData.otpCode.length < 6) {
      setError('يرجى إدخال الرمز المكون من 6 أرقام كاملاً.');
      return;
    }

    setForgotPasswordStep(3);
  };

  // Step 3: Set new password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (forgotPasswordData.newPassword.length < 6) {
      setError('كلمة المرور الجديدة يجب ألا تقل عن 6 أحرف/أرقام.');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.resetPassword(
        forgotPasswordData.email,
        forgotPasswordData.otpCode,
        forgotPasswordData.newPassword
      );
      setSuccessMessage('تم تعيين كلمة المرور الجديدة بنجاح! يمكنك الآن تسجيل الدخول.');
      setAuthMode('login');
    } catch (err: any) {
      setError(err.message || 'تعذر تعيين كلمة المرور الجديدة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-right">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-400" />
          <span>استعادة كلمة المرور</span>
        </h3>
        <span className="text-[11px] text-amber-400 font-mono font-bold">
          المرحلة {forgotPasswordStep} من 3
        </span>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Input Email */}
      {forgotPasswordStep === 1 && (
        <form onSubmit={handleRequestOtp} className="space-y-4">
          <p className="text-xs text-white/70 leading-relaxed">
            أدخل عنوان بريدك الإلكتروني المسجل في المنصة لإرسال رمز الأمان للتحقق وتعيين كلمة مرور جديدة.
          </p>

          <FloatingInput
            id="forgot-email"
            label="البريد الإلكتروني المسجل"
            type="email"
            value={forgotPasswordData.email}
            onChange={(e) => updateForgotPasswordData({ email: e.target.value })}
            required
            autoComplete="email"
            icon={<Mail className="w-4 h-4" />}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>إرسال رمز التحقق</span>
                <ArrowLeft className="w-4 h-4 text-stone-950" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: Input OTP */}
      {forgotPasswordStep === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-xs text-white/70">
            أدخل رمز التحقق المكون من 6 أرقام المرسل إلى:{' '}
            <strong className="text-amber-300 font-mono">{forgotPasswordData.email}</strong>
          </p>

          {debugOtp && (
            <div className="p-2.5 rounded-xl bg-teal-400/15 border border-teal-400/30 text-center text-xs text-teal-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>رمز الاختبار: </span>
              <button
                type="button"
                onClick={() => updateForgotPasswordData({ otpCode: debugOtp })}
                className="font-mono font-black text-amber-300 underline px-1.5 py-0.5 rounded bg-black/20"
              >
                {debugOtp} (اضغط للتعبئة)
              </button>
            </div>
          )}

          <div className="py-2">
            <OTPInput
              value={forgotPasswordData.otpCode}
              onChange={(val) => updateForgotPasswordData({ otpCode: val })}
              onComplete={() => setForgotPasswordStep(3)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForgotPasswordStep(1)}
              className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              رجوع
            </button>
            <button
              type="submit"
              disabled={forgotPasswordData.otpCode.length < 6}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>متابعة تعيين كلمة المرور</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* Step 3: New Password */}
      {forgotPasswordStep === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-xs text-white/70">
            أدخل كلمة المرور الجديدة الآمنة لحسابك.
          </p>

          <PasswordField
            id="reset-new-password"
            label="كلمة المرور الجديدة"
            value={forgotPasswordData.newPassword}
            onChange={(e) => updateForgotPasswordData({ newPassword: e.target.value })}
            showStrength={true}
          />

          <PasswordField
            id="reset-confirm-password"
            label="تأكيد كلمة المرور الجديدة"
            value={forgotPasswordData.confirmPassword}
            onChange={(e) => updateForgotPasswordData({ confirmPassword: e.target.value })}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-stone-950 font-black text-sm shadow-xl shadow-teal-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-stone-950" />
                <span>حفظ كلمة المرور وتسجيل الدخول</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Back to Login Link */}
      <div className="pt-2 text-center text-xs">
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className="text-white/60 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>العودة لشاشة تسجيل الدخول</span>
        </button>
      </div>
    </div>
  );
};
