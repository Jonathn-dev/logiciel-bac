import { create } from 'zustand';

export interface Profile {
  name: string;
  email: string;
  avatar: string;
  state: string; // الولاية
  level: string; // الشعبة والمستوى
  bacYear: string; // سنة البكالوريا
  targetGrade: number; // المعدل المستهدف
  bio?: string;
}

export interface NotebookItem {
  id: string;
  title: string;
  subject: 'history' | 'geography' | 'all';
  vectorCount: number;
  lastUpdated: string;
  sizeBytes: number;
  summary: string;
  status: 'indexed' | 'processing' | 'error';
  tags: string[];
}

export interface SubscriptionData {
  plan: 'free' | 'pro_bac' | 'vip_academy';
  status: 'active' | 'trial' | 'expired';
  expiresAt: string;
  aiQueriesUsed: number;
  aiQueriesLimit: number;
  vectorStorageUsedMb: number;
  vectorStorageLimitMb: number;
  ocrScansUsed: number;
  ocrScansLimit: number;
  renewsAuto: boolean;
}

export interface SettingsState {
  // Account
  profile: Profile;

  // Notebooks (RAG)
  notebooks: NotebookItem[];
  activeNotebookId: string | null;
  strictMode: boolean;
  ragTemperature: number;

  // Appearance
  theme: 'dark' | 'light' | 'system';
  animationIntensity: 'low' | 'medium' | 'high';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  language: 'ar' | 'fr' | 'en';
  highContrast: boolean;

  // Notifications
  notifications: {
    master: boolean;
    dailyReminder: boolean;
    dailyReminderTime: string;
    streakWarning: boolean;
    streakWarningThreshold: number; // بالساعات قبل انتهاء اليوم
    achievements: boolean;
    newChallenges: boolean;
    aiTips: boolean;
    soundEnabled: boolean;
  };

  // Learning
  dailyGoalMinutes: number;
  subjectPriority: ('history' | 'geography')[];
  difficultyBaseline: 'beginner' | 'intermediate' | 'advanced';
  focusModeDefaults: {
    pomodoroDuration: number;
    breakDuration: number;
    ambientSound: 'library' | 'rain' | 'silence' | 'waves';
    autoStartBreaks: boolean;
  };
  aiPersona: 'strict' | 'friendly' | 'concise';

  // Privacy & Security
  privacy: {
    progressVisibility: 'private' | 'friends' | 'public';
    shareStudyStats: boolean;
    allowAiTelemetry: boolean;
    twoFactorEnabled: boolean;
    sessionTimeoutMinutes: number;
  };

  // Subscription
  subscription: SubscriptionData;

  // UI / State Tracking
  hasUnsavedChanges: boolean;
  activeCategory: string;
  isSaving: boolean;

  // Actions
  updateProfile: (profile: Partial<Profile>) => void;
  setNotebooks: (notebooks: NotebookItem[]) => void;
  addNotebook: (notebook: NotebookItem) => void;
  removeNotebook: (id: string) => void;
  setActiveNotebook: (id: string | null) => void;
  toggleStrictMode: () => void;
  setRAGTemperature: (temp: number) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  updateAppearance: (appearance: Partial<Pick<SettingsState, 'theme' | 'animationIntensity' | 'fontSize' | 'reducedMotion' | 'language' | 'highContrast'>>) => void;
  updateNotifications: (settings: Partial<SettingsState['notifications']>) => void;
  updateLearning: (settings: Partial<Pick<SettingsState, 'dailyGoalMinutes' | 'subjectPriority' | 'difficultyBaseline' | 'focusModeDefaults' | 'aiPersona'>>) => void;
  updatePrivacy: (settings: Partial<SettingsState['privacy']>) => void;
  setActiveCategory: (cat: string) => void;
  markChanged: () => void;
  saveSettings: () => Promise<void>;
  resetToDefaults: () => void;
  discardChanges: () => void;
}

const DEFAULT_SETTINGS = {
  profile: {
    name: 'مروان البارودي',
    email: 'marouane.bac2026@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    state: '16 - الجزائر العاصمة',
    level: '3 ثانوي - شعبة آداب وفلسفة',
    bacYear: '2026',
    targetGrade: 18.5,
    bio: 'طالب بكالوريا 2026 طموح لتحقيق امتياز في مادتي التاريخ والجغرافيا وبناء مقالات منهجية متكاملة 🇩🇿',
  },
  notebooks: [
    {
      id: 'nb-1',
      title: 'كراس التاريخ الشامل - الحرب الباردة والثورة',
      subject: 'history' as const,
      vectorCount: 142,
      lastUpdated: '2026-08-28',
      sizeBytes: 1024 * 450,
      summary: 'ملخص متكامل يحتوي على معايير تشكل العالم، الصراع الإيديولوجي، وهجمات الشمال القسنطيني ومؤتمر الصومام.',
      status: 'indexed' as const,
      tags: ['تاريخ', 'الحرب الباردة', 'الثورة الجزائرية'],
    },
    {
      id: 'nb-2',
      title: 'دفتر الجغرافيا - أسواق الطاقة والقوى الاقتصادية',
      subject: 'geography' as const,
      vectorCount: 98,
      lastUpdated: '2026-08-25',
      sizeBytes: 1024 * 320,
      summary: 'مفاهيم البترول، منظمة أوبك، الاتحاد الأوروبي، وحزام الشمس في الولايات المتحدة الأمريكية.',
      status: 'indexed' as const,
      tags: ['جغرافيا', 'أوبك', 'القوى الاقتصادية'],
    },
    {
      id: 'nb-3',
      title: 'بنك المصطلحات والشخصيات المعتمدة وزارياً',
      subject: 'all' as const,
      vectorCount: 220,
      lastUpdated: '2026-08-30',
      sizeBytes: 1024 * 780,
      summary: 'قاعدة بيانات تضم 180 مصطلحاً و70 شخصية تاريخية وفق الإطار المرجعي الرسمي.',
      status: 'indexed' as const,
      tags: ['مصطلحات', 'شخصيات', 'تواريخ'],
    },
  ],
  activeNotebookId: 'nb-1',
  strictMode: true,
  ragTemperature: 0.0,
  theme: 'dark' as const,
  animationIntensity: 'high' as const,
  fontSize: 'medium' as const,
  reducedMotion: false,
  language: 'ar' as const,
  highContrast: false,
  notifications: {
    master: true,
    dailyReminder: true,
    dailyReminderTime: '18:30',
    streakWarning: true,
    streakWarningThreshold: 3,
    achievements: true,
    newChallenges: true,
    aiTips: true,
    soundEnabled: true,
  },
  dailyGoalMinutes: 45,
  subjectPriority: ['history', 'geography'] as ('history' | 'geography')[],
  difficultyBaseline: 'intermediate' as const,
  focusModeDefaults: {
    pomodoroDuration: 25,
    breakDuration: 5,
    ambientSound: 'library' as const,
    autoStartBreaks: true,
  },
  aiPersona: 'strict' as const,
  privacy: {
    progressVisibility: 'public' as const,
    shareStudyStats: true,
    allowAiTelemetry: true,
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
  },
  subscription: {
    plan: 'pro_bac' as const,
    status: 'active' as const,
    expiresAt: '2026-06-30',
    aiQueriesUsed: 840,
    aiQueriesLimit: 2500,
    vectorStorageUsedMb: 12.4,
    vectorStorageLimitMb: 50.0,
    ocrScansUsed: 42,
    ocrScansLimit: 150,
    renewsAuto: true,
  },
};

const STORAGE_KEY = 'atlas_bac_settings_store_v1';

// Load stored settings safely
function getInitialSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Failed to load settings from storage:', err);
  }
  return DEFAULT_SETTINGS;
}

export const useSettingsStore = create<SettingsState>((set, get) => {
  const initial = getInitialSettings();

  return {
    ...initial,
    hasUnsavedChanges: false,
    activeCategory: 'account',
    isSaving: false,

    updateProfile: (profileUpdate) => {
      set((state) => ({
        profile: { ...state.profile, ...profileUpdate },
        hasUnsavedChanges: true,
      }));
    },

    setNotebooks: (notebooks) => {
      set({ notebooks, hasUnsavedChanges: true });
    },

    addNotebook: (notebook) => {
      set((state) => ({
        notebooks: [notebook, ...state.notebooks],
        hasUnsavedChanges: true,
      }));
    },

    removeNotebook: (id) => {
      set((state) => ({
        notebooks: state.notebooks.filter((n) => n.id !== id),
        activeNotebookId: state.activeNotebookId === id ? (state.notebooks[0]?.id || null) : state.activeNotebookId,
        hasUnsavedChanges: true,
      }));
    },

    setActiveNotebook: (id) => {
      set({ activeNotebookId: id, hasUnsavedChanges: true });
    },

    toggleStrictMode: () => {
      set((state) => ({
        strictMode: !state.strictMode,
        ragTemperature: !state.strictMode ? 0.0 : 0.2,
        hasUnsavedChanges: true,
      }));
    },

    setRAGTemperature: (temp) => {
      set({ ragTemperature: temp, hasUnsavedChanges: true });
    },

    setTheme: (theme) => {
      set({ theme, hasUnsavedChanges: true });
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : {};
        parsed.theme = theme;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    },

    updateAppearance: (appearance) => {
      set((state) => {
        const nextState = { ...state, ...appearance, hasUnsavedChanges: true };
        try {
          const saved = localStorage.getItem(STORAGE_KEY);
          const parsed = saved ? JSON.parse(saved) : {};
          if (appearance.theme) parsed.theme = appearance.theme;
          if (appearance.fontSize) parsed.fontSize = appearance.fontSize;
          if (appearance.animationIntensity) parsed.animationIntensity = appearance.animationIntensity;
          if (appearance.highContrast !== undefined) parsed.highContrast = appearance.highContrast;
          if (appearance.reducedMotion !== undefined) parsed.reducedMotion = appearance.reducedMotion;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch {
          // ignore
        }
        return nextState;
      });
    },

    updateNotifications: (notifUpdate) => {
      set((state) => ({
        notifications: { ...state.notifications, ...notifUpdate },
        hasUnsavedChanges: true,
      }));
    },

    updateLearning: (learningUpdate) => {
      set((state) => ({
        ...state,
        ...learningUpdate,
        hasUnsavedChanges: true,
      }));
    },

    updatePrivacy: (privacyUpdate) => {
      set((state) => ({
        privacy: { ...state.privacy, ...privacyUpdate },
        hasUnsavedChanges: true,
      }));
    },

    setActiveCategory: (cat) => {
      set({ activeCategory: cat });
    },

    markChanged: () => {
      set({ hasUnsavedChanges: true });
    },

    saveSettings: async () => {
      set({ isSaving: true });
      await new Promise((res) => setTimeout(res, 400));
      const current = get();
      try {
        const payloadToSave = {
          profile: current.profile,
          notebooks: current.notebooks,
          activeNotebookId: current.activeNotebookId,
          strictMode: current.strictMode,
          ragTemperature: current.ragTemperature,
          theme: current.theme,
          animationIntensity: current.animationIntensity,
          fontSize: current.fontSize,
          reducedMotion: current.reducedMotion,
          language: current.language,
          highContrast: current.highContrast,
          notifications: current.notifications,
          dailyGoalMinutes: current.dailyGoalMinutes,
          subjectPriority: current.subjectPriority,
          difficultyBaseline: current.difficultyBaseline,
          focusModeDefaults: current.focusModeDefaults,
          aiPersona: current.aiPersona,
          privacy: current.privacy,
          subscription: current.subscription,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadToSave));
      } catch (err) {
        console.error('Failed to save settings:', err);
      }
      set({ isSaving: false, hasUnsavedChanges: false });
    },

    discardChanges: () => {
      const restored = getInitialSettings();
      set({
        ...restored,
        hasUnsavedChanges: false,
      });
    },

    resetToDefaults: () => {
      set({
        ...DEFAULT_SETTINGS,
        hasUnsavedChanges: true,
      });
    },
  };
});
