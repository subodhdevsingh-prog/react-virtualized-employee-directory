import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface UseSortableDataResult<T> {
  sortedData: T[];
  sortKey: keyof T;
  sortDirection: SortDirection;
  setSortKey: (key: keyof T) => void;
  toggleSort: () => void;
  requestSort: (key: keyof T) => void;
}

/**
 * Compares two unknown values for ordering.
 *
 * Numbers compare numerically, everything else compares as strings. Returns a
 * negative, zero, or positive number following the `Array.prototype.sort`
 * contract.
 */
function compareValues(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }
  return String(a).localeCompare(String(b));
}

/**
 * Generic client-side sorting hook.
 *
 * Produces a memoized sorted copy of `data` by the active key and direction,
 * and exposes handlers to change the key or flip direction. Clicking the same
 * key toggles direction; choosing a new key resets to ascending.
 *
 * @typeParam T - The element type of the data array.
 * @param data - The source array (never mutated).
 * @param initialKey - The key to sort by initially.
 * @returns Sorted data plus sort state and handlers.
 */
export function useSortableData<T>(data: T[], initialKey: keyof T): UseSortableDataResult<T> {
  const [sortKey, setSortKey] = useState<keyof T>(initialKey);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const toggleSort = useCallback((): void => {
    setSortDirection((prev): SortDirection => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const requestSort = useCallback((key: keyof T): void => {
    setSortKey((prevKey): keyof T => {
      if (prevKey === key) {
        setSortDirection((prev): SortDirection => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortDirection('asc');
      }
      return key;
    });
  }, []);

  const sortedData = useMemo((): T[] => {
    const copy = [...data];
    copy.sort((a, b): number => {
      const result = compareValues(a[sortKey], b[sortKey]);
      return sortDirection === 'asc' ? result : -result;
    });
    return copy;
  }, [data, sortKey, sortDirection]);

  return { sortedData, sortKey, sortDirection, setSortKey, toggleSort, requestSort };
}
