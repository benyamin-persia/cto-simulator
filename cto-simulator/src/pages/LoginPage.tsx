/**
 * Login / Sign up via Firebase Auth. Same account works from any device.
 * After login/signup we load this user's game state (by uid) and redirect home.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useGameStore } from '../store/gameStore';
import { auth, isFirebaseConfigured } from '../firebase/config';

type Mode = 'login' | 'signup';

export function LoginPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const login = useAuthStore((s) => s.login);
  const signUp = useAuthStore((s) => s.signUp);
  const loadGameForUser = useGameStore((s) => s.loadGameForUser);

  useEffect(() => {
    if (currentUser) navigate('/', { replace: true });
  }, [currentUser, navigate]);

  if (currentUser) return null;

  const configured = isFirebaseConfigured();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = mode === 'login' ? await login(email, password) : await signUp(email, password);
      if (result.ok && auth?.currentUser) {
        loadGameForUser(auth.currentUser.uid);
        navigate('/', { replace: true });
      } else if (!result.ok) {
        setError(result.error ?? 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
      <motion.div
        className="w-full max-w-sm rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="mb-1 text-xl font-bold text-[var(--text-primary)]">CTO Simulator</h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          {configured
            ? 'Sign in or create an account. Use the same email on any device to continue your progress.'
            : 'Firebase is not configured. Add VITE_FIREBASE_* to .env (see .env.example) to enable login from any device.'}
        </p>
        {!configured && (
          <p className="mb-4 text-sm text-[var(--accent-neon)]">
            You can still use the app: go back and open the home page (login is skipped when Firebase is missing).
          </p>
        )}

        <div className="mb-4 flex gap-2 rounded-lg bg-[var(--bg-card)] p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'login' ? 'bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${
              mode === 'signup' ? 'bg-[var(--accent-neon)]/20 text-[var(--accent-neon)]' : 'text-[var(--text-muted)]'
            }`}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--text-primary)]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--text-primary)]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-2 text-[var(--text-primary)] focus:border-[var(--accent-neon)] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !configured}
            className="rounded-lg bg-[var(--accent-neon)] px-4 py-2.5 font-semibold text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Please wait…' : !configured ? 'Configure Firebase first' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
          {!configured && (
            <button
              type="button"
              onClick={() => navigate('/', { replace: true })}
              className="rounded-lg border border-[var(--border-subtle)] px-4 py-2.5 font-medium text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            >
              Use app without account
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
}
