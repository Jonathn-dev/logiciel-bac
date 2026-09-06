import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SettingsLayout } from '../../sections/SettingsHub/SettingsLayout';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[#020617]/95 backdrop-blur-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen w-full"
          >
            <SettingsLayout onClose={onClose} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

