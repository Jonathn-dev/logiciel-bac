import { useSettingsStore } from '../store/settingsStore';

export function useSettings() {
  const store = useSettingsStore();

  return {
    ...store,
    isDirty: store.hasUnsavedChanges,
    save: store.saveSettings,
    reset: store.resetToDefaults,
    discard: store.discardChanges,
  };
}
