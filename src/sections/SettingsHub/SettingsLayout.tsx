import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Settings,
  Save,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { SettingsSidebar, SETTINGS_CATEGORIES } from './SettingsSidebar';
import { AccountProfile } from './categories/AccountProfile';
import { NotebookManager } from './categories/NotebookManager';
import { AppearanceSettings } from './categories/AppearanceSettings';
import { NotificationSettings } from './categories/NotificationSettings';
import { LearningPreferences } from './categories/LearningPreferences';
import { PrivacySecurity } from './categories/PrivacySecurity';
import { SubscriptionSettings } from './categories/SubscriptionSettings';
import { BackupExport } from './categories/BackupExport';
import { UnsavedChangesBar } from '../../components/settings/UnsavedChangesBar';

interface SettingsLayoutProps {
  onClose?: () => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ onClose }) => {
  const {
    activeCategory,
    setActiveCategory,
    hasUnsavedChanges,
    isSaving,
    saveSettings,
    discardChanges,
    resetToDefaults,
  } = useSettingsStore();

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = async () => {
    await saveSettings();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const renderActiveCategory = () => {
    switch (activeCategory) {
      case 'account':
        return <AccountProfile />;
      case 'notebooks':
        return <NotebookManager />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'learning':
        return <LearningPreferences />;
      case 'privacy':
        return <PrivacySecurity />;
      case 'subscription':
        return <SubscriptionSettings />;
      case 'backup':
        return <BackupExport />;
      default:
        return <AccountProfile />;
    }
  };

  const activeCategoryMeta = SETTINGS_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="relative min-h-screen bg-[#04081c] text-white selection:bg-amber-400 selection:text-stone-950 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Hub Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-[#081133]/80 border border-white/10 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-300 text-stone-950 shadow-lg shadow-amber-500/20">
              <Settings className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-2xl font-black font-serif text-white tracking-wide">
                  مركز الإعدادات والتحكم الشامل
                </h1>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Settings Hub
                </span>
              </div>
              <p className="text-xs text-[#a2a6d0] mt-0.5">
                تخصيص كامل لمعايير البكالوريا، حارس سياق كراس الطالب RAG، والسمات البصرية
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 cursor-pointer transition-all"
                title="الرجوع للوحة التحكم الرئيسية"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SETTINGS_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const IconComponent = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                    : 'bg-[#081133] text-[#a2a6d0] border border-white/10'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Grid: Sidebar + Content Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <SettingsSidebar
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
            />
          </div>

          {/* Active Category Content */}
          <div className="flex-1 w-full min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderActiveCategory()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Floating Bar */}
      <UnsavedChangesBar
        isVisible={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onDiscard={discardChanges}
      />

      {/* Saved Success Toast Notification */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-emerald-500 text-stone-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl shadow-emerald-500/40"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>تم حفظ كافة الإعدادات وتحديث ملف الطالب بنجاح!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
