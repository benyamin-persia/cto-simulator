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

export async function saveGameState(uid: string, state: GameStateSnapshot): Promise<void> {
  if (!db) return;
  try {
    const ref = doc(db, USERS_COLLECTION, uid);
    await setDoc(ref, { gameState: state, updatedAt: new Date().toISOString() }, { merge: true });
  } catch {
    // ignore write errors (offline, permissions)
  }
}
