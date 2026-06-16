import { useEffect, useState } from 'react';

/**
 * Returns a debounced copy of a value that only updates after `delay`
 * milliseconds have passed without the input changing.
 *
 * @typeParam T - The type of the value being debounced.
 * @param value - The fast-changing source value.
 * @param delay - Debounce delay in milliseconds.
 * @returns The value as of the last time it was stable for `delay` ms.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect((): (() => void) => {
    const timer = window.setTimeout((): void => setDebounced(value), delay);
    return (): void => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
