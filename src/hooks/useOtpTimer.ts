import { useState, useEffect, useCallback } from 'react';

export function useOtpTimer(initialSeconds: number = 60) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining]);

  const startTimer = useCallback((seconds: number = initialSeconds) => {
    setSecondsRemaining(seconds);
    setIsActive(true);
  }, [initialSeconds]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsRemaining(initialSeconds);
  }, [initialSeconds]);

  const formattedTime = `${Math.floor(secondsRemaining / 60)
    .toString()
    .padStart(2, '0')}:${(secondsRemaining % 60).toString().padStart(2, '0')}`;

  return {
    secondsRemaining,
    formattedTime,
    canResend: !isActive || secondsRemaining === 0,
    startTimer,
    resetTimer,
  };
}
