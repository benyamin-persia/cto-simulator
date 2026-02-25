/**
 * Protects game routes: redirects to /login if no user is logged in.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { isFirebaseConfigured } from '../firebase/config';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const location = useLocation();

  // When Firebase is not configured, allow access (app works without login).
  if (!isFirebaseConfigured()) return <>{children}</>;
  if (currentUser == null) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
