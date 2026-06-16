import { type ReactElement } from 'react';
import type { Employee } from '../../types/employee.types';
import type { SortDirection } from '../../hooks/useSortableData';
import { RoleGuard } from '../Auth/RoleGuard';
import { COLUMNS, GRID_TEMPLATE } from './columns';

export interface TableHeaderProps {
  sortKey: keyof Employee;
  sortDirection: SortDirection;
  onSort: (key: keyof Employee) => void;
}

function SortIndicator({ active, direction }: { active: boolean; direction: SortDirection }): ReactElement {
  if (!active) {
    return <span className="text-slate-300">↕</span>;
  }
  return <span className="text-indigo-600">{direction === 'asc' ? '↑' : '↓'}</span>;
}

/**
 * Sticky table header with clickable, sortable columns. The Salary column is
 * wrapped in a {@link RoleGuard} so only admins see its label; other roles see
 * a neutral "Compensation" placeholder header instead.
 */
export function TableHeader({ sortKey, sortDirection, onSort }: TableHeaderProps): ReactElement {
  return (
    <div
      className={`${GRID_TEMPLATE} sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500`}
    >
      {COLUMNS.map((column) => {
        const isActive = sortKey === column.key;
        const button = (
          <button
            type="button"
            onClick={() => onSort(column.key)}
            className="flex items-center gap-1 text-left hover:text-slate-800"
          >
            <span>{column.label}</span>
            <SortIndicator active={isActive} direction={sortDirection} />
          </button>
        );

        if (column.key === 'salary') {
          return (
            <div key={column.key}>
              <RoleGuard
                allowedRoles={['admin']}
                fallback={<span className="text-slate-400">Compensation</span>}
              >
                {button}
              </RoleGuard>
            </div>
          );
        }

        return <div key={column.key}>{button}</div>;
      })}
      <div className="text-right">Actions</div>
    </div>
  );
}
