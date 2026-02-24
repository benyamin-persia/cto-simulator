/**
 * App: root component. Sets up React Router and game layout.
 * Routes: / (home), /level/:id (levels 1–6), /final (summary and restart).
 * GameLayout syncs currentLevelId from URL so sidebar and header stay correct.
 */

import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { useGameStore } from './store/gameStore';
import { GameLayout } from './components/GameLayout';
import { ResetKeyHandler } from './components/ResetKeyHandler';
import { HomePage } from './pages/HomePage';
import { FinalScreen } from './pages/FinalScreen';
import { Level1ProjectPlanning } from './levels/Level1ProjectPlanning';
import { Level2Architecture } from './levels/Level2Architecture';
import { Level3Database } from './levels/Level3Database';
import { Level4Git } from './levels/Level4Git';
import { Level5CICD } from './levels/Level5CICD';
import { Level6Documentation } from './levels/Level6Documentation';
import type { LevelId } from './types/game';

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
  return (
    <BrowserRouter>
      <ResetKeyHandler />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="level/:id" element={<GameLayout />}>
          <Route index element={<LevelRoute />} />
        </Route>
        <Route path="final" element={<GameLayout />}>
          <Route index element={<FinalScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
