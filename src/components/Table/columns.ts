import type { Employee } from '../../types/employee.types';

export interface ColumnDef {
  key: keyof Employee;
  label: string;
  numeric: boolean;
}

/** Column definitions rendered by both the header and each row. */
export const COLUMNS: readonly ColumnDef[] = [
  { key: 'id', label: 'ID', numeric: true },
  { key: 'name', label: 'Name', numeric: false },
  { key: 'department', label: 'Department', numeric: false },
  { key: 'role', label: 'Role', numeric: false },
  { key: 'salary', label: 'Salary', numeric: true },
  { key: 'status', label: 'Status', numeric: false },
];

/**
 * Static Tailwind grid template shared by the header and rows so columns stay
 * aligned. Kept as a literal class string (no runtime-interpolated values) to
 * remain CSP-safe.
 */
export const GRID_TEMPLATE =
  'grid grid-cols-[72px_minmax(160px,1fr)_140px_120px_160px_110px_96px] items-center';
