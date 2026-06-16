import { useRef, type ReactElement } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Employee } from '../../types/employee.types';
import type { SortDirection } from '../../hooks/useSortableData';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';

export interface VirtualTableProps {
  employees: Employee[];
  sortKey: keyof Employee;
  sortDirection: SortDirection;
  onSort: (key: keyof Employee) => void;
  onEdit: (employee: Employee) => void;
}

const ROW_HEIGHT = 48;

/**
 * Windowed employee table. Only the rows in (and slightly around) the viewport
 * are mounted via `@tanstack/react-virtual`, so the DOM stays small regardless
 * of dataset size.
 */
export function VirtualTable({
  employees,
  sortKey,
  sortDirection,
  onSort,
  onEdit,
}: VirtualTableProps): ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div ref={scrollRef} className="h-[600px] overflow-auto">
        <TableHeader sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} />
        {employees.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-slate-400">
            No employees match your filters.
          </div>
        ) : (
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualRows.map((virtualRow) => {
              const employee = employees[virtualRow.index];
              if (!employee) {
                return null;
              }
              return (
                <TableRow
                  key={employee.id}
                  employee={employee}
                  start={virtualRow.start}
                  height={virtualRow.size}
                  onEdit={onEdit}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
