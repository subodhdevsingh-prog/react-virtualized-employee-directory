import { memo, useCallback, type ReactElement } from 'react';
import type { Employee, EmployeeStatus } from '../../types/employee.types';
import { RoleGuard } from '../Auth/RoleGuard';
import { sanitizeDisplayString } from '../../utils/sanitize';
import { formatSalary } from '../../utils/format';
import { logger } from '../../utils/logger';
import { GRID_TEMPLATE } from './columns';

export interface TableRowProps {
  employee: Employee;
  start: number;
  height: number;
  onEdit: (employee: Employee) => void;
}

const STATUS_CLASSES: Record<EmployeeStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-slate-200 text-slate-600',
  'on-leave': 'bg-amber-100 text-amber-700',
};

const MASKED_SALARY = '₹ ••••••';

function TableRowComponent({ employee, start, height, onEdit }: TableRowProps): ReactElement {
  const handleEdit = useCallback((): void => {
    logger.debug('Edit requested for employee', employee.id);
    onEdit(employee);
  }, [employee, onEdit]);

  return (
    <div
      className={`${GRID_TEMPLATE} absolute left-0 top-0 w-full border-b border-slate-100 px-4 text-sm text-slate-700 hover:bg-indigo-50/40`}
      style={{ height: `${height}px`, transform: `translateY(${start}px)` }}
    >
      <div className="tabular-nums text-slate-400">{employee.id}</div>
      <div className="truncate font-medium text-slate-800">
        {sanitizeDisplayString(employee.name)}
      </div>
      <div className="truncate">{sanitizeDisplayString(employee.department)}</div>
      <div className="truncate">{sanitizeDisplayString(employee.role)}</div>
      <div className="tabular-nums">
        <RoleGuard
          allowedRoles={['admin']}
          fallback={<span className="text-slate-400">{MASKED_SALARY}</span>}
        >
          <span className="font-medium text-slate-800">{formatSalary(employee.salary)}</span>
        </RoleGuard>
      </div>
      <div>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[employee.status]}`}
        >
          {employee.status}
        </span>
      </div>
      <div className="text-right">
        <RoleGuard allowedRoles={['admin', 'manager']}>
          <button
            type="button"
            onClick={handleEdit}
            className="rounded border border-indigo-200 px-2 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
          >
            Edit
          </button>
        </RoleGuard>
      </div>
    </div>
  );
}

/**
 * Memoized employee row. `React.memo` prevents re-renders of off-screen or
 * unchanged rows while virtual scrolling, which is essential at 10k rows.
 */
export const TableRow = memo(TableRowComponent);
