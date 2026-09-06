import React from 'react';
import { AnalyticsDashboardModal } from '../Analytics/AnalyticsDashboardModal';
import { UserStats } from '../../types';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStats: UserStats;
  onNavigateToTool?: (route: string) => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  userStats,
  onNavigateToTool,
}) => {
  return (
    <AnalyticsDashboardModal
      isOpen={isOpen}
      onClose={onClose}
      userStats={userStats}
      onNavigateToTool={onNavigateToTool}
    />
  );
};
