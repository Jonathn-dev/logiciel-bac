import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FocusModeState } from '../../types';
import { PomodoroRing } from './PomodoroRing';
import { AmbientVisualizer } from './AmbientVisualizer';
import { Sparkles, Eye, X, Flame, BellRing, Settings2 } from 'lucide-react';

interface FocusToggleProps {
  focusState: FocusModeState;
  onToggleFocusMode: () => void;
  onTogglePomodoro: () => void;
  onResetPomodoro: (mins: number) => void;
  onSelectAmbientSound: (sound: FocusModeState['ambientSound']) => void;
  onVolumeChange: (vol: number) => void;
}

export const FocusToggle: React.FC<FocusToggleProps> = ({
  focusState,
  onToggleFocusMode,
  onTogglePomodoro,
  onResetPomodoro,
  onSelectAmbientSound,
  onVolumeChange,
}) => {
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);

  return (
    <>
      {/* Top Action Controls */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          id="btn-focus-mode-toggle"
          onClick={onToggleFocusMode}
          className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition-all ${
            focusState.isActive
              ? 'bg-amber-400 text-stone-950 shadow-lg shadow-amber-400/30'
              : 'border border-stone-700 bg-stone-900/80 text-stone-300 hover:border-amber-500/50 hover:text-amber-300'
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>{focusState.isActive ? 'وضع التركيز العميق مفعّل' : 'وضع التركيز'}</span>
        </motion.button>

        <button
          id="btn-focus-settings"
          onClick={() => setShowSettingsDrawer(true)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-700 bg-stone-900/80 text-stone-300 hover:border-stone-600 hover:text-white"
          title="إعدادات بومودورو والمؤثرات الصوتية"
        >
          <Settings2 className="h-4 w-4" />
        </button>
      </div>

      {/* Focus Mode Backdrop Filter Blur (20px) overlay when active */}
      {focusState.isActive && (
        <div
          className="pointer-events-none fixed inset-0 z-20 transition-all"
          style={{
            backdropFilter: 'blur(1px)',
            backgroundColor: 'rgba(3, 7, 18, 0.45)',
          }}
        />
      )}

      {/* Settings Modal Drawer */}
      <AnimatePresence>
        {showSettingsDrawer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-stone-800 bg-[#09101d] p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-stone-100">
                      إدارة التركيز والمؤقت البيداغوجي
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      تقنية بومودورو ومؤثرات بيئة الاستيعاب
                    </p>
                  </div>
                </div>

                <button
                  id="btn-close-focus-settings"
                  onClick={() => setShowSettingsDrawer(false)}
                  className="rounded-lg p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Pomodoro Timer */}
              <div className="rounded-2xl border border-stone-800/80 bg-stone-950/40 p-4">
                <PomodoroRing
                  minutes={focusState.pomodoroMinutes}
                  seconds={focusState.pomodoroSeconds}
                  isRunning={focusState.isRunning}
                  mode={focusState.mode}
                  onToggle={onTogglePomodoro}
                  onReset={onResetPomodoro}
                />
              </div>

              {/* Ambient Sounds */}
              <div>
                <h4 className="text-xs font-bold text-stone-300 mb-2">المحيط الصوتي المساعد:</h4>
                <AmbientVisualizer
                  currentSound={focusState.ambientSound}
                  volume={focusState.volume}
                  onSelectSound={onSelectAmbientSound}
                  onVolumeChange={onVolumeChange}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
