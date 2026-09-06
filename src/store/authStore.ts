import { create } from 'zustand';
import { AuthStudentUser, AuthMode, RegisterStep, ForgotPasswordStep, BacBranch } from '../types';
import { authApi } from '../services/authApi';

interface AuthStoreState {
  currentUser: AuthStudentUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Modal / Hub Navigation
  isAuthModalOpen: boolean;
  currentMode: AuthMode;
  registerStep: RegisterStep;
  forgotPasswordStep: ForgotPasswordStep;

  // Registration In-Progress Form State
  registerData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    branch: BacBranch;
    wilayaCode: string;
    wilayaName: string;
    highSchool: string;
    agreeTerms: boolean;
  };

  // Forgot Password In-Progress State
  forgotPasswordData: {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmPassword: string;
  };

  // Actions
  setAuthModalOpen: (open: boolean, initialMode?: AuthMode) => void;
  setAuthMode: (mode: AuthMode) => void;
  setRegisterStep: (step: RegisterStep) => void;
  setForgotPasswordStep: (step: ForgotPasswordStep) => void;
  updateRegisterData: (fields: Partial<AuthStoreState['registerData']>) => void;
  updateForgotPasswordData: (fields: Partial<AuthStoreState['forgotPasswordData']>) => void;
  setError: (err: string | null) => void;
  setSuccessMessage: (msg: string | null) => void;

  // Core Auth Methods
  initSession: () => Promise<void>;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  register: () => Promise<boolean>;
  logout: () => void;
}

const DEFAULT_REGISTER_DATA = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  branch: 'آداب وفلسفة' as BacBranch,
  wilayaCode: '16',
  wilayaName: 'الجزائر العاصمة',
  highSchool: 'ثانوية البكالوريا النموذجية',
  agreeTerms: true,
};

const DEFAULT_FORGOT_DATA = {
  email: '',
  otpCode: '',
  newPassword: '',
  confirmPassword: '',
};

export const useAuthStore = create<AuthStoreState>((set, get) => ({
  currentUser: authApi.getStoredUser(),
  token: authApi.getToken(),
  isAuthenticated: !!authApi.getStoredUser(),
  isLoading: false,
  error: null,
  successMessage: null,

  isAuthModalOpen: false,
  currentMode: 'login',
  registerStep: 1,
  forgotPasswordStep: 1,

  registerData: { ...DEFAULT_REGISTER_DATA },
  forgotPasswordData: { ...DEFAULT_FORGOT_DATA },

  setAuthModalOpen: (open, initialMode = 'login') => {
    set({
      isAuthModalOpen: open,
      currentMode: initialMode,
      error: null,
      successMessage: null,
    });
  },

  setAuthMode: (mode) => {
    set({
      currentMode: mode,
      error: null,
      successMessage: null,
      registerStep: 1,
      forgotPasswordStep: 1,
    });
  },

  setRegisterStep: (step) => set({ registerStep: step, error: null }),
  setForgotPasswordStep: (step) => set({ forgotPasswordStep: step, error: null }),

  updateRegisterData: (fields) => {
    set((state) => ({
      registerData: { ...state.registerData, ...fields },
    }));
  },

  updateForgotPasswordData: (fields) => {
    set((state) => ({
      forgotPasswordData: { ...state.forgotPasswordData, ...fields },
    }));
  },

  setError: (error) => set({ error }),
  setSuccessMessage: (msg) => set({ successMessage: msg }),

  initSession: async () => {
    const storedUser = authApi.getStoredUser();
    const token = authApi.getToken();
    if (token && storedUser) {
      set({ currentUser: storedUser, token, isAuthenticated: true });
    }
    // Refresh user details from server in background
    try {
      const liveUser = await authApi.getCurrentUser();
      if (liveUser) {
        set({ currentUser: liveUser, isAuthenticated: true });
      }
    } catch {
      // offline / stored state stays active
    }
  },

  login: async (identifier, password, rememberMe = true) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.login({ identifier, password, rememberMe });
      set({
        currentUser: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
        successMessage: `مرحباً بك مجدداً يا ${res.user.name}! 🌟`,
      });
      return true;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || 'فشل تسجيل الدخول. يرجى التحقق من البيانات.',
      });
      return false;
    }
  },

  register: async () => {
    const { registerData } = get();
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.register({
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
        branch: registerData.branch,
        wilayaCode: registerData.wilayaCode,
        wilayaName: registerData.wilayaName,
        highSchool: registerData.highSchool,
      });

      set({
        currentUser: res.user,
        token: res.token,
        isAuthenticated: true,
        isLoading: false,
        isAuthModalOpen: false,
        registerData: { ...DEFAULT_REGISTER_DATA },
        registerStep: 1,
        successMessage: `تهانينا يا ${res.user.name}! تم إنشاء حسابك في Atlas BAC بنجاح 🎓`,
      });
      return true;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      return false;
    }
  },

  logout: () => {
    authApi.clearSession();
    set({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      isAuthModalOpen: false,
      successMessage: 'تم تسجيل الخروج بنجاح. نراك قريباً!',
    });
  },
}));
