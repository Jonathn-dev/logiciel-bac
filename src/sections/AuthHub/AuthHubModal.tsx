import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthLayout } from './AuthLayout';
import { useAuthStore } from '../../store/authStore';

interface AuthHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthHubModal: React.FC<AuthHubModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md"
      >
        <AuthLayout onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
};
