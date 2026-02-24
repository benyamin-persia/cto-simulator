/**
 * In-memory "user database" stored as JSON in localStorage.
 * Key: cto-simulator-users
 * Shape: { users: { [username]: { passwordHash, salt, createdAt } } }
 * No external DB; all data stays in the browser.
 */

const USERS_KEY = 'cto-simulator-users';

export interface StoredUser {
  passwordHash: string;
  salt: string;
  createdAt: number;
}

export interface UsersData {
  users: Record<string, StoredUser>;
}

function read(): UsersData {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return { users: {} };
    const data = JSON.parse(raw) as UsersData;
    return data && typeof data.users === 'object' ? data : { users: {} };
  } catch {
    return { users: {} };
  }
}

function write(data: UsersData): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(data));
}

export function getUser(username: string): StoredUser | undefined {
  return read().users[username];
}

export function setUser(username: string, user: StoredUser): void {
  const data = read();
  data.users[username] = user;
  write(data);
}

export function userExists(username: string): boolean {
  return !!getUser(username);
}
