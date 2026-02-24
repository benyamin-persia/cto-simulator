/**
 * ResetKeyHandler: global keyboard shortcut to reset the game.
 * Press Ctrl+Shift+R anywhere to clear progress (localStorage) and go to Level 1.
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';

export function ResetKeyHandler() {
  const navigate = useNavigate();
  const resetGame = useGameStore((s) => s.resetGame);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        resetGame();
        navigate('/level/1');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, resetGame]);

  return null;
}
