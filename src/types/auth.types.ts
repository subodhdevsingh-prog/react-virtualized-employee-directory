export type UserRole = 'admin' | 'viewer' | 'manager';

export interface AuthState {
  role: UserRole;
  name: string;
}
