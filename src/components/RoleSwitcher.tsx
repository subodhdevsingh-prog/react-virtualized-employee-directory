import { useCallback, type ChangeEvent, type ReactElement } from 'react';
import type { UserRole } from '../types/auth.types';
import { useAuthStore } from '../store/authStore';
import { sanitizeDisplayString } from '../utils/sanitize';

const ROLE_OPTIONS: readonly UserRole[] = ['admin', 'manager', 'viewer'];

const ROLE_BADGE_CLASSES: Record<UserRole, string> = {
  admin: 'bg-emerald-100 text-emerald-800',
  manager: 'bg-amber-100 text-amber-800',
  viewer: 'bg-slate-200 text-slate-700',
};

/**
 * Header control that lets a reviewer switch the active role at runtime so the
 * role-based UI (salary visibility, edit button) can be demoed without code
 * changes.
 */
export function RoleSwitcher(): ReactElement {
  const role = useAuthStore((state) => state.role);
  const name = useAuthStore((state) => state.name);
  const setRole = useAuthStore((state) => state.setRole);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>): void => {
      setRole(event.target.value as UserRole);
    },
    [setRole],
  );

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-slate-600">{sanitizeDisplayString(name)}</span>
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_BADGE_CLASSES[role]}`}>
        {role}
      </span>
      <label className="sr-only" htmlFor="role-select">
        Select role
      </label>
      <select
        id="role-select"
        value={role}
        onChange={handleChange}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        {ROLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
