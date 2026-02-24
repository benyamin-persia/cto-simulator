/**
 * Auth state via Firebase Auth. Same account works from any device.
 * currentUser is set by onAuthStateChanged (see main.tsx); no persist needed.
 */

import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth } from '../firebase/config';

export interface CurrentUser {
  uid: string;
  email: string | null;
}

export interface AuthState {
  currentUser: CurrentUser | null;
  setCurrentUser: (user: CurrentUser | null) => void;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

function userToCurrentUser(user: User): CurrentUser {
  return { uid: user.uid, email: user.email ?? null };
}

export const useAuthStore = create<AuthState>()((set) => ({
  currentUser: null,

  setCurrentUser(user: CurrentUser | null) {
    set({ currentUser: user });
  },

  async login(email: string, password: string) {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      return { ok: false, error: 'Email and password required' };
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, trimmed, password);
      set({ currentUser: userToCurrentUser(userCred.user) });
      return { ok: true };
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Login failed';
      return { ok: false, error: message };
    }
  },

  async signUp(email: string, password: string) {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      return { ok: false, error: 'Email and password required' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters' };
    }
    try {
      const userCred = await createUserWithEmailAndPassword(auth, trimmed, password);
      set({ currentUser: userToCurrentUser(userCred.user) });
      return { ok: true };
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? String((err as { message: string }).message) : 'Sign up failed';
      return { ok: false, error: message };
    }
  },

  async logout() {
    await signOut(auth);
    set({ currentUser: null });
  },
}));
