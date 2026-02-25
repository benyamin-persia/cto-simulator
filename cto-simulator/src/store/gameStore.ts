/**
 * Global game state using Zustand.
 * Persists to localStorage per user (cto-simulator-game-${uid}) when logged in via Firebase.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LevelId, GameState, LevelConfig } from '../types/game';
import { DEFAULT_LEVELS, INITIAL_HEALTH, MAX_HEALTH, MIN_HEALTH } from '../types/game';
import { auth } from '../firebase/config';

const STORAGE_KEY = 'cto-simulator-game';

/** Use Firebase auth.currentUser?.uid when configured; otherwise default key. */
function getGameStorageKey(): string {
  const user = auth?.currentUser;
  return user ? `${STORAGE_KEY}-${user.uid}` : STORAGE_KEY;
}

const gameStorage = {
  getItem: (): unknown => {
    try {
      const s = localStorage.getItem(getGameStorageKey());
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  },
  setItem: (_name: string, value: unknown): void => {
    localStorage.setItem(getGameStorageKey(), JSON.stringify(value));
  },
  removeItem: (): void => {
    localStorage.removeItem(getGameStorageKey());
  },
};

function buildInitialLevels(): GameState['levels'] {
  const levels = {} as GameState['levels'];
  const ids: LevelId[] = [1, 2, 3, 4, 5, 6];
  ids.forEach((id) => {
    const def = DEFAULT_LEVELS[id];
    levels[id] = {
      ...def,
      unlocked: true,
      completed: false,
    };
  });
  return levels;
}

export interface GameStore extends GameState {
  /** Set by loadGameForUser when state was loaded from Firestore; used to redirect to current level once. Not persisted. */
  loadedFromRemote?: boolean;
  clearLoadedFromRemote: () => void;
  /** When true, clicking glossary keywords shows their definition in a tooltip; persisted with game state. Defaults to true if missing. */
  tooltipsEnabled?: boolean;
  setTooltipsEnabled: (enabled: boolean) => void;
  /** When true, the LEVELS sidebar is visible; user can toggle via header button or collapse icon. Persisted. */
  sidebarOpen?: boolean;
  setSidebarOpen: (open: boolean) => void;
  /** When false, sidebar is completely hidden (width 0); header shows "Show levels". When true, sidebar is shown (expanded or collapsed to numbers). Persisted. */
  sidebarVisible?: boolean;
  setSidebarVisible: (visible: boolean) => void;
  addXp: (amount: number) => void;
  setCurrentLevel: (id: LevelId) => void;
  setStartupHealth: (delta: number) => void;
  completeLevel: (levelId: LevelId) => void;
  recordDecisions: (levelId: LevelId, decisions: Record<string, unknown>) => void;
  /** Reset a single level (completed → false, clear decisions, subtract completion XP if completed). Level remounts via levelResetKey. */
  resetLevel: (levelId: LevelId) => void;
  /** Key for level id; use as React key to remount level when reset. */
  getLevelResetKey: (levelId: LevelId) => number;
  resetGame: () => void;
  getLevel: (id: LevelId) => LevelConfig;
  /** Load saved game for this user. If remoteState is provided (from Firestore), use it; else load from localStorage. */
  loadGameForUser: (uid: string, remoteState?: Record<string, unknown>) => void;
}

const initialState: GameState = {
  totalXp: 0,
  currentLevelId: 1,
  startupHealth: INITIAL_HEALTH,
  levels: buildInitialLevels(),
  decisionsByLevel: {} as GameState['decisionsByLevel'],
  levelResetKey: {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      loadedFromRemote: false,
      tooltipsEnabled: true,
      sidebarOpen: true,
      sidebarVisible: true,

      clearLoadedFromRemote() {
        set({ loadedFromRemote: false });
      },

      setTooltipsEnabled(enabled: boolean) {
        set({ tooltipsEnabled: enabled });
      },

      setSidebarOpen(open: boolean) {
        set({ sidebarOpen: open });
      },

      setSidebarVisible(visible: boolean) {
        set({ sidebarVisible: visible });
      },

      addXp(amount: number) {
        set((s) => ({ totalXp: s.totalXp + amount }));
      },

      setCurrentLevel(id: LevelId) {
        set({ currentLevelId: id });
      },

      setStartupHealth(delta: number) {
        set((s) => ({
          startupHealth: Math.max(MIN_HEALTH, Math.min(MAX_HEALTH, s.startupHealth + delta)),
        }));
      },

      completeLevel(levelId: LevelId) {
        const state = get();
        const level = state.levels[levelId];
        if (!level || level.completed) return;
        const levels = { ...state.levels };
        levels[levelId] = { ...level, completed: true };
        const nextId = (levelId + 1) as LevelId;
        if (nextId <= 6) {
          levels[nextId] = { ...levels[nextId], unlocked: true };
        }
        set({
          levels,
          totalXp: state.totalXp + level.completionXp,
        });
      },

      recordDecisions(levelId: LevelId, decisions: Record<string, unknown>) {
        set((s) => ({
          decisionsByLevel: {
            ...s.decisionsByLevel,
            [levelId]: { ...(s.decisionsByLevel[levelId] || {}), ...decisions },
          },
        }));
      },

      resetLevel(levelId: LevelId) {
        const state = get();
        const level = state.levels[levelId];
        if (!level) return;
        const levels = { ...state.levels };
        levels[levelId] = { ...level, completed: false };
        const decisionsByLevel = { ...state.decisionsByLevel };
        delete decisionsByLevel[levelId];
        const levelResetKey = { ...(state.levelResetKey ?? {}), [levelId]: Date.now() };
        const totalXp = level.completed ? Math.max(0, state.totalXp - level.completionXp) : state.totalXp;
        set({
          levels,
          decisionsByLevel,
          levelResetKey,
          totalXp,
        });
      },

      getLevelResetKey(levelId: LevelId) {
        return get().levelResetKey?.[levelId] ?? 0;
      },

      resetGame() {
        const tooltipsEnabled = get().tooltipsEnabled;
        const sidebarOpen = get().sidebarOpen;
        const sidebarVisible = get().sidebarVisible;
        set({
          ...initialState,
          levels: buildInitialLevels(),
          decisionsByLevel: {} as GameState['decisionsByLevel'],
          levelResetKey: {},
          tooltipsEnabled,
          sidebarOpen,
          sidebarVisible,
        });
      },

      getLevel(id: LevelId) {
        return get().levels[id];
      },

      loadGameForUser(uid: string, remoteState?: Record<string, unknown>) {
        if (remoteState != null && typeof remoteState === 'object') {
          set({ ...(remoteState as Partial<GameStore>), loadedFromRemote: true });
          return;
        }
        try {
          const key = `${STORAGE_KEY}-${uid}`;
          const raw = localStorage.getItem(key);
          if (!raw) return;
          const parsed = JSON.parse(raw) as { state?: Record<string, unknown> };
          const state = parsed?.state;
          if (state && typeof state === 'object') {
            set(state as Partial<GameStore>);
          }
        } catch {
          // ignore invalid or missing data
        }
      },
    }),
    // Persist only game data; exclude loadedFromRemote so it is not saved to localStorage or rehydrated
    {
      name: STORAGE_KEY,
      storage: gameStorage as unknown as import('zustand/middleware').PersistStorage<GameStore>,
      partialize: (s) => {
        const { loadedFromRemote: _, ...rest } = s;
        return rest;
      },
    }
  )
);
