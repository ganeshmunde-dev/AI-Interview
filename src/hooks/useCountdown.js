// src/hooks/useCountdown.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Robust deadline-based countdown timer hook.
 * Prevents timer drift by calculating remaining time against a timestamp deadline.
 *
 * @param {number} initialSeconds - Starting time in seconds
 * @param {function} onExpire - Callback triggered once when timer hits 0
 */
export function useCountdown(initialSeconds = 120, onExpire) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const deadlineRef = useRef(null);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  const hasExpiredRef = useRef(false);

  // Keep onExpire callback ref fresh
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // Clear any active interval
  const clearIntervalTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Stop timer
  const stop = useCallback(() => {
    clearIntervalTimer();
    setIsRunning(false);
  }, [clearIntervalTimer]);

  // Start timer with a given duration (or current totalSeconds)
  const start = useCallback((seconds) => {
    clearIntervalTimer();

    const duration = seconds !== undefined ? seconds : totalSeconds;
    setTotalSeconds(duration);
    setTimeLeft(duration);
    setIsExpired(false);
    hasExpiredRef.current = false;

    const now = Date.now();
    const deadline = now + duration * 1000;
    deadlineRef.current = deadline;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      const remainingMs = deadlineRef.current - Date.now();
      const remaining = Math.max(0, Math.ceil(remainingMs / 1000));

      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsRunning(false);
        setIsExpired(true);

        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          if (onExpireRef.current) {
            onExpireRef.current();
          }
        }
      }
    }, 250); // Check frequently (every 250ms) to ensure exact second transitions
  }, [clearIntervalTimer, totalSeconds]);

  // Reset timer
  const reset = useCallback((seconds) => {
    clearIntervalTimer();
    const duration = seconds !== undefined ? seconds : initialSeconds;
    setTotalSeconds(duration);
    setTimeLeft(duration);
    setIsRunning(false);
    setIsExpired(false);
    hasExpiredRef.current = false;
    deadlineRef.current = null;
  }, [clearIntervalTimer, initialSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearIntervalTimer();
    };
  }, [clearIntervalTimer]);

  const elapsedSeconds = Math.max(0, totalSeconds - timeLeft);
  const percentageRemaining = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const isCritical = timeLeft <= 15 || percentageRemaining <= 25;
  const isWarning = !isCritical && percentageRemaining <= 50;

  return {
    timeLeft,
    totalSeconds,
    isRunning,
    isExpired,
    elapsedSeconds,
    percentageRemaining,
    isCritical,
    isWarning,
    start,
    stop,
    reset,
  };
}

export default useCountdown;
