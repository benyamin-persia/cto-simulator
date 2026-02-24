/**
 * Auth state: current logged-in user (username only).
 * User list and hashed passwords live in localStorage as JSON (see auth/usersStorage).
 * Persisted so refresh keeps you logged in.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { hashPassword, generateSalt, verifyPassword } from '../auth/hash';
import { getUser, setUser, userExists } from '../auth/usersStorage';

const AUTH_STORAGE_KEY = 'cto-simulator-auth';

export interface AuthState {
  currentUser: string | null;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,

      async login(username: string, password: string) {
        const normalized = username.trim().toLowerCase();
        if (!normalized || !password) {
          return { ok: false, error: 'Username and password required' };
        }
        const stored = getUser(normalized);
        if (!stored) {
          return { ok: false, error: 'User not found' };
        }
        const valid = await verifyPassword(password, stored.salt, stored.passwordHash);
        if (!valid) {
          return { ok: false, error: 'Invalid password' };
        }
        set({ currentUser: normalized });
        return { ok: true };
      },

      async signUp(username: string, password: string) {
        const normalized = username.trim().toLowerCase();
        if (!normalized || !password) {
          return { ok: false, error: 'Username and password required' };
        }
        if (normalized.length < 2) {
          return { ok: false, error: 'Username at least 2 characters' };
        }
        if (password.length < 4) {
          return { ok: false, error: 'Password at least 4 characters' };
        }
        if (userExists(normalized)) {
          return { ok: false, error: 'Username already taken' };
        }
        const salt = generateSalt();
        const passwordHash = await hashPassword(password, salt);
        setUser(normalized, { passwordHash, salt, createdAt: Date.now() });
        set({ currentUser: normalized });
        return { ok: true };
      },

      logout() {
        set({ currentUser: null });
      },
    }),
    { name: AUTH_STORAGE_KEY }
  )
);
