/**
 * Firebase config for Auth and Firestore. Login and game progress sync across devices.
 * Set env vars in .env (see .env.example). If missing, auth is skipped and the app still runs.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
const hasConfig = typeof apiKey === 'string' && apiKey.length > 0;

let auth: Auth | null = null;
let db: Firestore | null = null;

if (hasConfig) {
  const firebaseConfig = {
    apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };
export const isFirebaseConfigured = (): boolean => auth !== null;
