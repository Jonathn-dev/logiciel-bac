import { useState, useEffect } from 'react';

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isExpired: boolean;
  formattedDays: string;
  formattedHours: string;
  formattedMinutes: string;
  formattedSeconds: string;
}

export function useCountdown(targetDateIso: string): CountdownTime {
  const calculateTimeLeft = (): CountdownTime => {
    const target = new Date(targetDateIso).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: true,
        formattedDays: '00',
        formattedHours: '00',
        formattedMinutes: '00',
        formattedSeconds: '00',
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: Math.floor(difference / 1000),
      isExpired: false,
      formattedDays: days < 10 ? `0${days}` : `${days}`,
      formattedHours: hours < 10 ? `0${hours}` : `${hours}`,
      formattedMinutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      formattedSeconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
  };

  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft);

  useEffect(() => {
    // Initial sync
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateIso]);

  return timeLeft;
}
