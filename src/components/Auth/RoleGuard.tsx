import type { ReactElement, ReactNode } from 'react';
import type { UserRole } from '../../types/auth.types';
import { useAuthStore } from '../../store/authStore';

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Renders its children only when the current user's role is in `allowedRoles`.
 * Otherwise it renders `fallback` (or nothing). This keeps sensitive UI out of
 * the rendered tree entirely rather than merely hiding it with CSS.
 */
export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps): ReactElement {
  const role = useAuthStore((state) => state.role);
  const isAllowed = allowedRoles.includes(role);
  return <>{isAllowed ? children : fallback}</>;
}
