'use client';
import { useEffect, useRef, useState } from 'react';

export function useCountdown(seconds: number, enabled: boolean) {
  const [remaining, setRemaining] = useState<number>(seconds);
  const started = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;
    if (!started.current) {
      setRemaining(seconds);
      started.current = true;
    }
    if (remaining <= 0) return;

    const id = setTimeout(() => setRemaining((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [enabled, remaining, seconds]);

  const reset = () => {
    started.current = false;
    setRemaining(seconds);
  };

  return { remaining, reset };
}