import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const {
    currentUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    isAuthModalOpen,
    currentMode,
    registerStep,
    forgotPasswordStep,
    setAuthModalOpen,
    setAuthMode,
    setRegisterStep,
    setForgotPasswordStep,
    updateRegisterData,
    updateForgotPasswordData,
    setError,
    setSuccessMessage,
    initSession,
    login,
    register,
    logout,
  } = useAuthStore();

  useEffect(() => {
    initSession();
  }, [initSession]);

  return {
    currentUser,
    token,
    isAuthenticated,
    isLoading,
    error,
    successMessage,
    isAuthModalOpen,
    currentMode,
    registerStep,
    forgotPasswordStep,
    setAuthModalOpen,
    setAuthMode,
    setRegisterStep,
    setForgotPasswordStep,
    updateRegisterData,
    updateForgotPasswordData,
    setError,
    setSuccessMessage,
    login,
    register,
    logout,
  };
}
