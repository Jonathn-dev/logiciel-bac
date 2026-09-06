import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Save, AlertCircle, RefreshCw, X } from 'lucide-react';

interface UnsavedChangesBarProps {
  isVisible: boolean;
  isSaving: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const UnsavedChangesBar: React.FC<UnsavedChangesBarProps> = ({
  isVisible,
  isSaving,
  onSave,
  onDiscard,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-[#091338]/95 backdrop-blur-xl border border-amber-400/50 rounded-2xl p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-right flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-bold text-white block">
                لديك تعديلات غير محفوظة في الإعدادات!
              </span>
              <span className="text-[11px] text-[#a2a6d0]">
                احفظ التغييرات الآن لتطبيقها ومزامنتها مع حسابك
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onDiscard}
              disabled={isSaving}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              إلغاء التعديل
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-stone-950 font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ التغييرات</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
