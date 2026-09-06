import { useState, useEffect, useRef, useCallback } from 'react';
import { FocusModeState } from '../types';

export function useFocusMode() {
  const [focusState, setFocusState] = useState<FocusModeState>({
    isActive: false,
    pomodoroMinutes: 25,
    pomodoroSeconds: 0,
    isRunning: false,
    mode: 'study',
    ambientSound: 'none',
    volume: 0.5,
  });

  const [reducedMotion, setReducedMotion] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Pomodoro Countdown interval
  useEffect(() => {
    let interval: any = null;

    if (focusState.isRunning) {
      interval = setInterval(() => {
        setFocusState((prev) => {
          if (prev.pomodoroSeconds > 0) {
            return { ...prev, pomodoroSeconds: prev.pomodoroSeconds - 1 };
          } else if (prev.pomodoroMinutes > 0) {
            return {
              ...prev,
              pomodoroMinutes: prev.pomodoroMinutes - 1,
              pomodoroSeconds: 59,
            };
          } else {
            // Timer complete! Switch mode
            const nextMode = prev.mode === 'study' ? 'short_break' : 'study';
            const nextMinutes = nextMode === 'study' ? 25 : 5;
            playChime();
            return {
              ...prev,
              isRunning: false,
              mode: nextMode,
              pomodoroMinutes: nextMinutes,
              pomodoroSeconds: 0,
            };
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusState.isRunning]);

  // Web Audio Synthesizer for Ambient Sound
  const startAmbientSound = useCallback((type: FocusModeState['ambientSound'], volume: number) => {
    stopAmbientSound();
    if (type === 'none') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brown / pink noise for rain/cafe atmosphere
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'library_rain') {
          // Brown noise (deep rumble + rain texture)
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else if (type === 'study_cafe') {
          // Pink noise filter
          data[i] = (Math.sin(i / 20) * 0.1 + (white * 0.05));
        } else {
          // Lo-fi calming drone
          const t = i / ctx.sampleRate;
          data[i] = Math.sin(2 * Math.PI * 110 * t) * 0.04 + white * 0.02;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter for warm soft atmosphere
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = type === 'library_rain' ? 800 : 400;

      const gain = ctx.createGain();
      gain.gain.value = volume * 0.3;
      gainNodeRef.current = gain;

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseNodeRef.current = noiseSource;
    } catch (e) {
      console.warn('Web Audio synthesis not allowed yet or error', e);
    }
  }, []);

  const stopAmbientSound = useCallback(() => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop?.();
      } catch (e) {
        // ignore
      }
      noiseNodeRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
      audioContextRef.current = null;
    }
  }, []);

  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // Audio autoplay restrictions
    }
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusState((prev) => {
      const nextActive = !prev.isActive;
      if (!nextActive) {
        stopAmbientSound();
      } else if (prev.ambientSound !== 'none') {
        startAmbientSound(prev.ambientSound, prev.volume);
      }
      return {
        ...prev,
        isActive: nextActive,
      };
    });
  }, [startAmbientSound, stopAmbientSound]);

  const togglePomodoro = useCallback(() => {
    setFocusState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  }, []);

  const resetPomodoro = useCallback((minutes: number = 25) => {
    setFocusState((prev) => ({
      ...prev,
      isRunning: false,
      pomodoroMinutes: minutes,
      pomodoroSeconds: 0,
    }));
  }, []);

  const setAmbientSound = useCallback(
    (sound: FocusModeState['ambientSound']) => {
      setFocusState((prev) => {
        if (prev.isActive && sound !== 'none') {
          startAmbientSound(sound, prev.volume);
        } else {
          stopAmbientSound();
        }
        return { ...prev, ambientSound: sound };
      });
    },
    [startAmbientSound, stopAmbientSound]
  );

  const setVolume = useCallback((vol: number) => {
    setFocusState((prev) => {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.value = vol * 0.3;
      }
      return { ...prev, volume: vol };
    });
  }, []);

  return {
    focusState,
    reducedMotion,
    setReducedMotion,
    toggleFocusMode,
    togglePomodoro,
    resetPomodoro,
    setAmbientSound,
    setVolume,
    playChime,
  };
}
