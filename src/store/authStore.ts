import { create, type StoreApi, type UseBoundStore } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, UserRole } from '../types/auth.types';

export interface AuthStore extends AuthState {
  setRole: (role: UserRole) => void;
  setName: (name: string) => void;
}

const STORAGE_KEY = 'employee-directory-auth';

/**
 * Typed Zustand auth store.
 *
 * Persists to `sessionStorage` so the selected role survives reloads within a
 * tab but resets when the tab is closed (it is never written to localStorage).
 */
export const useAuthStore: UseBoundStore<StoreApi<AuthStore>> = create<AuthStore>()(
  persist(
    (set) => ({
      role: 'viewer',
      name: 'Demo User',
      setRole: (role: UserRole): void => set({ role }),
      setName: (name: string): void => set({ name }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
