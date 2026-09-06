import { useSettingsStore } from '../store/settingsStore';

export function useSubscription() {
  const { subscription } = useSettingsStore();

  const aiPercentage = Math.min(
    100,
    Math.round((subscription.aiQueriesUsed / subscription.aiQueriesLimit) * 100)
  );

  const storagePercentage = Math.min(
    100,
    Math.round((subscription.vectorStorageUsedMb / subscription.vectorStorageLimitMb) * 100)
  );

  const ocrPercentage = Math.min(
    100,
    Math.round((subscription.ocrScansUsed / subscription.ocrScansLimit) * 100)
  );

  const isPro = subscription.plan === 'pro_bac' || subscription.plan === 'vip_academy';

  return {
    subscription,
    aiPercentage,
    storagePercentage,
    ocrPercentage,
    isPro,
  };
}
