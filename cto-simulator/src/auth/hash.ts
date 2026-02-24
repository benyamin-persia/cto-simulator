/**
 * Password hashing using Web Crypto API (SHA-256).
 * No server; used only for local storage so each user's progress is separate.
 * Salt is stored per user so we can verify on login.
 */

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Generate a random salt (16 bytes) for new users. */
export function generateSalt(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return bufferToHex(bytes.buffer);
}

/** Hash password with salt for storage. Returns hex string. */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hash);
}

/** Verify password against stored hash. */
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const hash = await hashPassword(password, salt);
  return hash === storedHash;
}
