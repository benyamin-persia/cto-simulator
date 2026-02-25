/**
 * Opens Firebase Console → Authentication → Sign-in method for this project.
 * Run: npm run firebase:open-auth
 * Then click "Email/Password" → Enable → Save.
 */

import { execSync } from 'child_process';

const projectId = 'cto-simulator-vercel-app';
const url = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;

const command = process.platform === 'win32' ? `start "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
execSync(command);
console.log('Opened Firebase Authentication. Enable "Email/Password" and Save.');
