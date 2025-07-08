import { useCallback, useEffect, useRef, useState } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const targetTimeRef = useRef<number>(new Date(targetDate).getTime() - 30000);

  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date().getTime();
    const timeDiff = targetTimeRef.current - now;

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return { days, hours, minutes, seconds };
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    targetTimeRef.current = new Date(targetDate).getTime() - 30000;
    setTimeLeft(calculateTimeLeft());
  }, [targetDate, calculateTimeLeft]);

  useEffect(() => {
    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Stop interval when countdown reaches zero
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    };

    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [calculateTimeLeft]);

  const formatTimeValue = (value: number, label: string): string => {
    return value > 0 ? `${value}${label} ` : "";
  };

  return (
    <span>
      {formatTimeValue(timeLeft.days, "d")}
      {formatTimeValue(timeLeft.hours, "h")}
      {formatTimeValue(timeLeft.minutes, "m")}
      {formatTimeValue(timeLeft.seconds, "s")}
    </span>
  );
};

export default CountdownTimer;
