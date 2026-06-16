import { VirtualTable } from './VirtualTable';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

export type { VirtualTableProps } from './VirtualTable';
export type { TableHeaderProps } from './TableHeader';
export type { TableRowProps } from './TableRow';

/**
 * Compound table API. Consumers use `Table.Virtual` for the full virtualized
 * table, or `Table.Header` / `Table.Row` to compose a custom layout.
 */
export const Table = {
  Virtual: VirtualTable,
  Header: TableHeader,
  Row: TableRow,
} as const;
