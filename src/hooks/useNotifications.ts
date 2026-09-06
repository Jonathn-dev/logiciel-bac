import { useSettingsStore } from '../store/settingsStore';

export function useNotifications() {
  const { notifications, updateNotifications } = useSettingsStore();

  const toggleMaster = () => {
    updateNotifications({ master: !notifications.master });
  };

  const toggleDailyReminder = () => {
    updateNotifications({ dailyReminder: !notifications.dailyReminder });
  };

  const setDailyReminderTime = (time: string) => {
    updateNotifications({ dailyReminderTime: time });
  };

  const toggleStreakWarning = () => {
    updateNotifications({ streakWarning: !notifications.streakWarning });
  };

  const setStreakWarningThreshold = (hours: number) => {
    updateNotifications({ streakWarningThreshold: hours });
  };

  const toggleAchievements = () => {
    updateNotifications({ achievements: !notifications.achievements });
  };

  const toggleNewChallenges = () => {
    updateNotifications({ newChallenges: !notifications.newChallenges });
  };

  const toggleAiTips = () => {
    updateNotifications({ aiTips: !notifications.aiTips });
  };

  const toggleSound = () => {
    updateNotifications({ soundEnabled: !notifications.soundEnabled });
  };

  return {
    notifications,
    toggleMaster,
    toggleDailyReminder,
    setDailyReminderTime,
    toggleStreakWarning,
    setStreakWarningThreshold,
    toggleAchievements,
    toggleNewChallenges,
    toggleAiTips,
    toggleSound,
    updateNotifications,
  };
}
