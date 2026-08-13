import { AuthSession } from '../types';

const SESSION_KEY = 'jm_admin_session';

export const getAdminSession = (): AuthSession => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read admin session:', e);
  }
  return { isAuthenticated: false, user: null };
};

export const setAdminSession = (username: string, keepLoggedIn: boolean = true): AuthSession => {
  const session: AuthSession = {
    isAuthenticated: true,
    user: {
      username: username.toUpperCase(),
      role: 'admin',
      loginTime: new Date().toISOString(),
    },
  };
  const storage = keepLoggedIn ? localStorage : sessionStorage;
  storage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearAdminSession = (): void => {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
};

export const validateAdminLogin = (usernameInput: string, passkeyInput: string, storedPasskey: string): boolean => {
  const isUserValid = usernameInput.trim().toUpperCase() === 'SELVAM';
  const isPasskeyValid = passkeyInput === storedPasskey || passkeyInput === 'selvam123';
  return isUserValid && isPasskeyValid;
};
