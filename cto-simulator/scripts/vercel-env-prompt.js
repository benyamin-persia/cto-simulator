/**
 * Reads .env and prints VITE_FIREBASE_* vars for copy-paste into Vercel.
 * Run from cto-simulator: npm run vercel:env
 * Then paste the output into Vercel → Project → Settings → Environment Variables.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const envPath = resolve(process.cwd(), '.env');
if (!existsSync(envPath)) {
  console.error('No .env file. Copy .env.example to .env and add your Firebase config first.');
  process.exit(1);
}

const raw = readFileSync(envPath, 'utf-8');
const keys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const lines = raw.split('\n');
const env = {};
for (const line of lines) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
}

console.log('Add these in Vercel → Project → Settings → Environment Variables:\n');
keys.forEach((k) => {
  if (env[k]) console.log(`${k}=${env[k]}`);
});
console.log('\nPaste each line as Name = value (Production, Preview, Development).');
