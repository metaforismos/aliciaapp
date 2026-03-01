import { useState, useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';

// ────────────────────────────────────────────
// Hook interface
// ────────────────────────────────────────────

export interface UseTimerReturn {
  /** Elapsed time in seconds since the timer started */
  elapsed: number;
  /** Whether the session has exceeded maxSessionMinutes */
  isOvertime: boolean;
  /** Start (or resume) the timer */
  start: () => void;
  /** Pause the timer without resetting */
  pause: () => void;
  /** Reset the timer to zero and stop it */
  reset: () => void;
}

// ────────────────────────────────────────────
// Hook implementation
// ────────────────────────────────────────────

export function useTimer(): UseTimerReturn {
  const { maxSessionMinutes } = useSettingsStore();

  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Compute overtime status
  const isOvertime = elapsed >= maxSessionMinutes * 60;

  // ── Tick effect ──

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // ── Actions ──

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
  }, []);

  return {
    elapsed,
    isOvertime,
    start,
    pause,
    reset,
  };
}
