// Minimal local auth helper for extension UI
// - No auto-creation of admin on first-run
// - Provides createAdmin(username, password)
// - Bootstraps a dev-only default user when running in development

export type User = {
  username: string;
  passwordHash: string; // simple placeholder; in real app use proper hashing
  isAdmin?: boolean;
};

const USERS_KEY = 'local_auth_users';

function readUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('failed to read users', e);
    return [];
  }
}

function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function simpleHash(password: string) {
  // NOT SECURE: placeholder for local/dev use only
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i);
    h |= 0;
  }
  return String(h);
}

export function createAdmin(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    if (!username || !password) return reject(new Error('username and password required'));
    const users = readUsers();
    if (users.find(u => u.username === username)) return reject(new Error('user already exists'));
    const user: User = { username, passwordHash: simpleHash(password), isAdmin: true };
    users.push(user);
    writeUsers(users);
    resolve(user);
  });
}

export function createUser(username: string, password: string, isAdmin = false): Promise<User> {
  return new Promise((resolve, reject) => {
    if (!username || !password) return reject(new Error('username and password required'));
    const users = readUsers();
    if (users.find(u => u.username === username)) return reject(new Error('user already exists'));
    const user: User = { username, passwordHash: simpleHash(password), isAdmin };
    users.push(user);
    writeUsers(users);
    resolve(user);
  });
}

export function authenticate(username: string, password: string): Promise<User | null> {
  return new Promise(resolve => {
    const users = readUsers();
    const hash = simpleHash(password);
    const u = users.find(x => x.username === username && x.passwordHash === hash) || null;
    resolve(u);
  });
}

export function adminExists(): Promise<boolean> {
  return new Promise(resolve => {
    const users = readUsers();
    resolve(users.some(u => u.isAdmin));
  });
}

export function bootstrapLocalAuth(): Promise<void> {
  return new Promise(resolve => {
    // Do not auto-create an admin on first run.
    // If in development, ensure a dev-only default user exists for convenience.
    try {
      const users = readUsers();
      const isDev = (process && process.env && process.env.NODE_ENV === 'development') || false;
      if (isDev) {
        const devUser = users.find(u => u.username === 'dev');
        if (!devUser) {
          const user: User = { username: 'dev', passwordHash: simpleHash('Soulenchanter#3'), isAdmin: true };
          users.push(user);
          writeUsers(users);
          console.info('[localAuth] dev user created');
        }
      }
    } catch (e) {
      console.warn('bootstrapLocalAuth failed', e);
    }
    resolve();
  });
}

// Export simple user list helper for UI use
export function listUsers(): Promise<User[]> {
  return Promise.resolve(readUsers());
}

export default {
  createAdmin,
  createUser,
  authenticate,
  adminExists,
  bootstrapLocalAuth,
  listUsers,
};
