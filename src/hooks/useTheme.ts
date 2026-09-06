import { useSettingsStore } from '../store/settingsStore';

export function useTheme() {
  const {
    theme,
    animationIntensity,
    fontSize,
    reducedMotion,
    language,
    highContrast,
    setTheme,
    updateAppearance,
  } = useSettingsStore();

  return {
    theme,
    animationIntensity,
    fontSize,
    reducedMotion,
    language,
    highContrast,
    setTheme,
    setAnimationIntensity: (intensity: 'low' | 'medium' | 'high') =>
      updateAppearance({ animationIntensity: intensity }),
    setFontSize: (size: 'small' | 'medium' | 'large') =>
      updateAppearance({ fontSize: size }),
    setReducedMotion: (reduced: boolean) =>
      updateAppearance({ reducedMotion: reduced }),
    setLanguage: (lang: 'ar' | 'fr' | 'en') =>
      updateAppearance({ language: lang }),
    setHighContrast: (contrast: boolean) =>
      updateAppearance({ highContrast: contrast }),
  };
}
