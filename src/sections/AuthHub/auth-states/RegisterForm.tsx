import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { FloatingInput } from '../../../components/auth/FloatingInput';
import { PasswordField } from '../../../components/auth/PasswordField';
import { OTPInput } from '../../../components/auth/OTPInput';
import { BranchWilayaSelector } from '../../../components/auth/BranchWilayaSelector';
import { useAuthStore } from '../../../store/authStore';
import { useOtpTimer } from '../../../hooks/useOtpTimer';
import { authApi } from '../../../services/authApi';

export const RegisterForm: React.FC = () => {
  const {
    registerData,
    registerStep,
    setRegisterStep,
    updateRegisterData,
    register,
    setAuthMode,
    isLoading,
    error,
    setError,
  } = useAuthStore();

  const [otpCode, setOtpCode] = useState('');
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [debugOtpReceived, setDebugOtpReceived] = useState<string | null>(null);

  const otpTimer = useOtpTimer(60);

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!registerData.name.trim()) {
      setError('يرجى كتابة اسمك الكامل أو لقبك الدراسي.');
      return;
    }
    if (!registerData.branch) {
      setError('يرجى تحديد الشعبة الدراسية لاختيار المقرر المناسب.');
      return;
    }
    if (!registerData.wilayaCode) {
      setError('يرجى اختيار ولاية إقامتك (من بين 58 ولاية).');
      return;
    }

    setRegisterStep(2);
  };

  // Step 2 -> Step 3 (Send OTP)
  const handleProceedToStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!registerData.email.trim() || !registerData.email.includes('@')) {
      setError('يرجى إدخال بريد إلكتروني صالح (مثال: student@bac.dz).');
      return;
    }

    if (registerData.password.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 خانات على الأقل.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (!registerData.agreeTerms) {
      setError('يرجى الموافقة على شروط الاستخدام لمتابعة التسجيل.');
      return;
    }

    // Send OTP
    try {
      const res = await authApi.sendOtp(registerData.email, 'register');
      if (res.debugCode) {
        setDebugOtpReceived(res.debugCode);
      }
      otpTimer.startTimer(60);
      setRegisterStep(3);
    } catch (err: any) {
      setError(err.message || 'تعذر إرسال رمز التحقق.');
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!otpTimer.canResend) return;
    setOtpError(null);
    try {
      const res = await authApi.sendOtp(registerData.email, 'register');
      if (res.debugCode) {
        setDebugOtpReceived(res.debugCode);
      }
      otpTimer.startTimer(60);
    } catch (err: any) {
      setOtpError(err.message || 'فشل إعادة إرسال الرمز.');
    }
  };

  // Step 3 (Verify OTP & Complete Registration)
  const handleCompleteRegistration = async (codeToVerify: string = otpCode) => {
    if (codeToVerify.length < 6) {
      setOtpError('يرجى كتابة الرمز كاملاً المكون من 6 أرقام.');
      return;
    }

    setOtpError(null);
    setIsVerifyingOtp(true);

    try {
      await authApi.verifyOtp(registerData.email, codeToVerify);
      // Proceed to create account
      await register();
    } catch (err: any) {
      setOtpError(err.message || 'رمز التحقق غير صحيح أو منتهي.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  return (
    <div className="space-y-5 text-right font-sans">
      {/* 3-Dot Progress Stepper */}
      <div className="flex items-center justify-between px-2 pt-1 pb-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((step) => {
            const isDone = registerStep > step;
            const isCurrent = registerStep === step;

            return (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all ${
                    isDone
                      ? 'bg-teal-400 text-stone-950 shadow-md shadow-teal-400/20'
                      : isCurrent
                      ? 'bg-amber-400 text-stone-950 ring-4 ring-amber-400/20 shadow-md shadow-amber-400/30'
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                <span
                  className={`text-[11px] font-bold hidden sm:inline ${
                    isCurrent ? 'text-amber-300' : isDone ? 'text-teal-300' : 'text-white/40'
                  }`}
                >
                  {step === 1 ? 'البيانات الشخصية' : step === 2 ? 'بيانات الحساب' : 'التحقق OTP'}
                </span>
                {step < 3 && <div className="w-4 sm:w-8 h-[1px] bg-white/15 mx-1" />}
              </div>
            );
          })}
        </div>

        <span className="text-[11px] text-amber-400 font-mono font-bold">
          الخطوة {registerStep} من 3
        </span>
      </div>

      {/* Global Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 animate-ping" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* STEP 1: Personal Info & Algerian BAC Stream & Wilaya */}
      {registerStep === 1 && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleProceedToStep2}
          className="space-y-4"
        >
          <FloatingInput
            id="reg-name"
            label="الاسم واللقب (اسم الطالب)"
            value={registerData.name}
            onChange={(e) => updateRegisterData({ name: e.target.value })}
            required
            autoComplete="name"
            icon={<User className="w-4 h-4" />}
          />

          <FloatingInput
            id="reg-phone"
            label="رقم الهاتف (اختياري لاستقبال التنبيهات)"
            type="tel"
            value={registerData.phone}
            onChange={(e) => updateRegisterData({ phone: e.target.value })}
            autoComplete="tel"
            icon={<Phone className="w-4 h-4" />}
          />

          <BranchWilayaSelector
            selectedBranch={registerData.branch}
            onSelectBranch={(branch) => updateRegisterData({ branch })}
            selectedWilayaCode={registerData.wilayaCode}
            onSelectWilaya={(wilayaCode, wilayaName) =>
              updateRegisterData({ wilayaCode, wilayaName })
            }
          />

          <FloatingInput
            id="reg-highschool"
            label="اسم الثانوية (المؤسسة التعليمية)"
            value={registerData.highSchool}
            onChange={(e) => updateRegisterData({ highSchool: e.target.value })}
            icon={<Building2 className="w-4 h-4" />}
          />

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>المتابعة إلى بيانات الحساب</span>
              <ArrowLeft className="w-4 h-4 text-stone-950 group-hover:translate-x-[-3px] transition-transform" />
            </button>
          </div>
        </motion.form>
      )}

      {/* STEP 2: Email & Password & Security */}
      {registerStep === 2 && (
        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          onSubmit={handleProceedToStep3}
          className="space-y-4"
        >
          <FloatingInput
            id="reg-email"
            label="البريد الإلكتروني"
            type="email"
            value={registerData.email}
            onChange={(e) => updateRegisterData({ email: e.target.value })}
            required
            autoComplete="email"
            icon={<Mail className="w-4 h-4" />}
          />

          <PasswordField
            id="reg-password"
            label="كلمة المرور الجديدة"
            value={registerData.password}
            onChange={(e) => updateRegisterData({ password: e.target.value })}
            showStrength={true}
            autoComplete="new-password"
          />

          <PasswordField
            id="reg-confirm-password"
            label="تأكيد كلمة المرور"
            value={registerData.confirmPassword}
            onChange={(e) => updateRegisterData({ confirmPassword: e.target.value })}
            autoComplete="new-password"
          />

          {/* Agree to terms */}
          <label className="flex items-center gap-2 text-xs text-white/70 hover:text-white cursor-pointer select-none">
            <input
              type="checkbox"
              checked={registerData.agreeTerms}
              onChange={(e) => updateRegisterData({ agreeTerms: e.target.checked })}
              className="w-4 h-4 rounded bg-white/10 text-amber-400 focus:ring-amber-400/30 accent-amber-400 cursor-pointer"
            />
            <span>
              أوافق على <span className="text-amber-400 underline">شروط الاستخدام</span> وسياسة الخصوصية لمنصة Atlas BAC
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRegisterStep(1)}
              className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>إرسال رمز التحقق OTP</span>
              <ArrowLeft className="w-4 h-4 text-stone-950 group-hover:translate-x-[-3px] transition-transform" />
            </button>
          </div>
        </motion.form>
      )}

      {/* STEP 3: OTP 6-Digit Verification */}
      {registerStep === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-black text-white">التحقق من البريد الإلكتروني</h3>
            <p className="text-xs text-white/70 max-w-sm mx-auto">
              أدخل الرمز السري المكون من 6 أرقام المرسل إلى:
              <br />
              <span className="font-mono text-amber-300 font-bold text-sm">{registerData.email}</span>
            </p>
          </div>

          {/* Test Preview Code Helper Pill */}
          {debugOtpReceived && (
            <div className="p-2.5 rounded-xl bg-teal-400/15 border border-teal-400/30 text-center text-xs text-teal-300 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>رمز التحقق للاختبار السريع: </span>
              <button
                type="button"
                onClick={() => {
                  setOtpCode(debugOtpReceived);
                  handleCompleteRegistration(debugOtpReceived);
                }}
                className="font-mono font-black text-amber-300 underline px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 cursor-pointer"
              >
                {debugOtpReceived} (اضغط للتعبئة الفورية)
              </button>
            </div>
          )}

          {/* 6-box OTP Input */}
          <div className="py-2">
            <OTPInput
              value={otpCode}
              onChange={(val) => {
                setOtpCode(val);
                setOtpError(null);
              }}
              onComplete={(fullCode) => handleCompleteRegistration(fullCode)}
              isError={!!otpError}
              disabled={isVerifyingOtp || isLoading}
            />
          </div>

          {otpError && (
            <p className="text-center text-xs text-rose-400 font-bold">{otpError}</p>
          )}

          {/* Resend Countdown & Action */}
          <div className="flex items-center justify-between text-xs px-2">
            <div className="text-white/60">
              {otpTimer.canResend ? (
                <span className="text-amber-300 font-bold">يمكنك طلب رمز جديد الآن</span>
              ) : (
                <span>
                  إعادة الإرسال خلال:{' '}
                  <strong className="text-amber-400 font-mono">{otpTimer.formattedTime}</strong>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!otpTimer.canResend || isVerifyingOtp}
              className="flex items-center gap-1.5 text-teal-300 hover:text-teal-200 font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة إرسال الرمز</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setRegisterStep(2)}
              disabled={isVerifyingOtp || isLoading}
              className="py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>تعديل البريد</span>
            </button>

            <button
              type="button"
              onClick={() => handleCompleteRegistration(otpCode)}
              disabled={otpCode.length < 6 || isVerifyingOtp || isLoading}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:brightness-110 text-stone-950 font-black text-sm shadow-xl shadow-teal-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isVerifyingOtp || isLoading ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-stone-950" />
                  <span>تأكيد الرمز وإتمام إنشاء الحساب</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-white/60">
        <span>لديك حساب بالفعل؟ </span>
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className="font-bold text-amber-400 hover:text-amber-300 hover:underline transition-colors cursor-pointer"
        >
          تسجيل الدخول مباشرة
        </button>
      </div>
    </div>
  );
};
