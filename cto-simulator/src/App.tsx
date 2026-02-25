/**
 * App: root component. Sets up React Router and game layout.
 * Firebase Auth + Firestore: same account and progress on every device.
 */

import { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config';
import { loadGameStateWithTimeout, saveGameState, type GameStateSnapshot } from './firebase/gameSync';
import { useAuthStore } from './store/authStore';
import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/GameLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ResetKeyHandler } from './components/ResetKeyHandler';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { FinalScreen } from './pages/FinalScreen';
import { Level1ProjectPlanning } from './levels/Level1ProjectPlanning';
import { Level2Architecture } from './levels/Level2Architecture';
import { Level3Database } from './levels/Level3Database';
import { Level4Git } from './levels/Level4Git';
import { Level5CICD } from './levels/Level5CICD';
import { Level6Documentation } from './levels/Level6Documentation';
import type { LevelId } from './types/game';

const SAVE_DEBOUNCE_MS = 1500;

function pickSnapshot(state: Record<string, unknown>): GameStateSnapshot {
  return {
    totalXp: state.totalXp as number,
    currentLevelId: state.currentLevelId as number,
    startupHealth: state.startupHealth as number,
    levels: state.levels as GameStateSnapshot['levels'],
    decisionsByLevel: state.decisionsByLevel as GameStateSnapshot['decisionsByLevel'],
    levelResetKey: state.levelResetKey as GameStateSnapshot['levelResetKey'],
    tooltipsEnabled: state.tooltipsEnabled as boolean,
    sidebarOpen: state.sidebarOpen as boolean,
    sidebarVisible: state.sidebarVisible as boolean,
  };
}

/** Sync Firebase auth state and load game when user logs in. Load from localStorage first so progress shows immediately; then try Firestore and overwrite if we get cloud data. */
function useAuthSync() {
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (user) => {
      const setCurrentUser = useAuthStore.getState().setCurrentUser;
      const loadGameForUser = useGameStore.getState().loadGameForUser;
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email ?? null });
        // Load from localStorage immediately so user sees their progress right away (no wait for Firestore)
        loadGameForUser(user.uid, undefined);
        // Then try Firestore; if we get data, overwrite for cross-device sync
        const remoteState = await loadGameStateWithTimeout(user.uid);
        if (remoteState != null && typeof remoteState === 'object') {
          loadGameForUser(user.uid, remoteState as Record<string, unknown>);
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsub();
  }, []);
}

/** When user is logged in, save game state to Firestore (debounced) so progress syncs across devices. */
function useGameSync() {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsub = useGameStore.subscribe((state) => {
      const uid = useAuthStore.getState().currentUser?.uid;
      if (!uid) return;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null;
        saveGameState(uid, pickSnapshot(state as unknown as Record<string, unknown>));
      }, SAVE_DEBOUNCE_MS);
    });
    return () => {
      unsub();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);
}

/** After loading game from Firestore (or when at home with progress), redirect to the level they were on so they continue where they left off. */
function RedirectToLevelAfterLoad() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const loadedFromRemote = useGameStore((s) => s.loadedFromRemote);
  const currentLevelId = useGameStore((s) => s.currentLevelId);
  const totalXp = useGameStore((s) => s.totalXp);
  const clearLoadedFromRemote = useGameStore.getState().clearLoadedFromRemote;

  useEffect(() => {
    if (!currentUser || location.pathname !== '/' || currentLevelId < 1 || currentLevelId > 6) return;
    // Redirect when we just loaded from Firestore, or when we have progress (so refresh on home still sends them to current level)
    const hasProgress = currentLevelId > 1 || totalXp > 0;
    if (loadedFromRemote || hasProgress) {
      clearLoadedFromRemote();
      navigate(`/level/${currentLevelId}`, { replace: true });
    }
  }, [currentUser, loadedFromRemote, location.pathname, currentLevelId, totalXp, navigate, clearLoadedFromRemote]);

  return null;
}

function LevelRoute() {
  const { id } = useParams<{ id: string }>();
  const setCurrentLevel = useGameStore((s) => s.setCurrentLevel);
  const getLevelResetKey = useGameStore((s) => s.getLevelResetKey);

  useEffect(() => {
    const num = parseInt(id ?? '1', 10);
    if (num >= 1 && num <= 6) {
      setCurrentLevel(num as LevelId);
    }
  }, [id, setCurrentLevel]);

  const levelId = parseInt(id ?? '1', 10) as LevelId;
  const resetKey = id && levelId >= 1 && levelId <= 6 ? getLevelResetKey(levelId) : 0;

  switch (id) {
    case '1':
      return <Level1ProjectPlanning key={resetKey} />;
    case '2':
      return <Level2Architecture key={resetKey} />;
    case '3':
      return <Level3Database key={resetKey} />;
    case '4':
      return <Level4Git key={resetKey} />;
    case '5':
      return <Level5CICD key={resetKey} />;
    case '6':
      return <Level6Documentation key={resetKey} />;
    default:
      return <Navigate to="/level/1" replace />;
  }
}

export default function App() {
  useAuthSync();
  useGameSync();

  return (
    <BrowserRouter>
      <RedirectToLevelAfterLoad />
      <ResetKeyHandler />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="level/:id"
          element={
            <ProtectedRoute>
              <GameLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<LevelRoute />} />
        </Route>
        <Route
          path="final"
          element={
            <ProtectedRoute>
              <GameLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FinalScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
