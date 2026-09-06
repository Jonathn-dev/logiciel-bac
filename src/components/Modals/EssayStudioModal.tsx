import React from 'react';
import { EssayModal } from './EssayModal';

export const EssayStudioModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onRewardXP?: (xp: number, reason: string) => void;
}> = ({ isOpen, onClose, onRewardXP }) => {
  return (
    <EssayModal
      isOpen={isOpen}
      onClose={onClose}
      onRewardXP={onRewardXP || (() => {})}
    />
  );
};

