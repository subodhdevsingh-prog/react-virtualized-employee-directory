import { useCallback, useEffect, type MouseEvent, type ReactElement } from 'react';
import type { Employee } from '../types/employee.types';
import { sanitizeDisplayString } from '../utils/sanitize';
import { formatSalary } from '../utils/format';
import { RoleGuard } from './Auth/RoleGuard';

export interface EditEmployeeModalProps {
  employee: Employee;
  onClose: () => void;
}

/**
 * Read-only "edit" dialog shown when a privileged user clicks Edit on a row.
 * It demonstrates the role-gated action wiring without a real persistence
 * layer; salary remains admin-only inside the modal as well.
 */
export function EditEmployeeModal({ employee, onClose }: EditEmployeeModalProps): ReactElement {
  useEffect((): (() => void) => {
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return (): void => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const stop = useCallback((event: MouseEvent<HTMLDivElement>): void => {
    event.stopPropagation();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit employee"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
    >
      <div onClick={stop} className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Edit employee</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">ID</dt>
            <dd className="font-medium tabular-nums text-slate-800">{employee.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Name</dt>
            <dd className="font-medium text-slate-800">{sanitizeDisplayString(employee.name)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Department</dt>
            <dd className="font-medium text-slate-800">
              {sanitizeDisplayString(employee.department)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Role</dt>
            <dd className="font-medium text-slate-800">{sanitizeDisplayString(employee.role)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Salary</dt>
            <dd className="font-medium text-slate-800">
              <RoleGuard
                allowedRoles={['admin']}
                fallback={<span className="text-slate-400">₹ ••••••</span>}
              >
                {formatSalary(employee.salary)}
              </RoleGuard>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Status</dt>
            <dd className="font-medium text-slate-800">{employee.status}</dd>
          </div>
        </dl>

        <p className="mt-5 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Demo only: this dialog is read-only and does not persist changes.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
