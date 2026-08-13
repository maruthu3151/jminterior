import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthSession } from '../types';
import { getAdminSession, setAdminSession, clearAdminSession, validateAdminLogin } from '../services/auth';

interface AuthContextType {
  session: AuthSession;
  login: (username: string, passkey: string, storedPasskey: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession>(getAdminSession());

  useEffect(() => {
    setSession(getAdminSession());
  }, []);

  const login = (usernameInput: string, passkeyInput: string, storedPasskey: string): boolean => {
    if (validateAdminLogin(usernameInput, passkeyInput, storedPasskey)) {
      const newSession = setAdminSession(usernameInput);
      setSession(newSession);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAdminSession();
    setSession({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
