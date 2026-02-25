/**
 * Sync game progress to Firestore so the same user sees the same XP/levels on every device.
 * Uses collection "users", document id = uid, field "gameState" = serializable store state.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './config';

const USERS_COLLECTION = 'users';

/** Serializable game state (no functions). Matches what we persist in the store. */
export interface GameStateSnapshot {
  totalXp?: number;
  currentLevelId?: number;
  levels?: Record<number, unknown>;
  startupHealth?: number;
  decisionsByLevel?: Record<number, Record<string, unknown>>;
  levelResetKey?: Partial<Record<number, number>>;
  tooltipsEnabled?: boolean;
  sidebarOpen?: boolean;
  sidebarVisible?: boolean;
}

export async function loadGameState(uid: string): Promise<GameStateSnapshot | null> {
  if (!db) return null;
  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    const snap = await getDoc(ref);
    const data = snap.data();
    const gameState = data?.gameState;
    if (gameState && typeof gameState === 'object') {
      return gameState as GameStateSnapshot;
    }
    return null;
  } catch {
    return null;
  }
}

/** Max ms to wait for Firestore before falling back to localStorage (e.g. when blocked by extension). */
const LOAD_TIMEOUT_MS = 4000;

/**
 * Load game state from Firestore with a timeout. If Firestore is blocked (e.g. ERR_BLOCKED_BY_CLIENT
 * from an ad blocker) or slow, we return null so the app can load from localStorage and keep progress on this device.
 */
export function loadGameStateWithTimeout(uid: string): Promise<GameStateSnapshot | null> {
  return Promise.race([
    loadGameState(uid),
    new Promise<null>((resolve) => setTimeout(() => resolve(null), LOAD_TIMEOUT_MS)),
  ]);
}

export async function saveGameState(uid: string, state: GameStateSnapshot): Promise<void> {
  if (!db) return;
  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    await setDoc(ref, { gameState: state, updatedAt: new Date().toISOString() }, { merge: true });
  } catch {
    // ignore write errors (offline, permissions)
  }
}
