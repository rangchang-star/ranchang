'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  avatar?: string;
  isGuest: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasLoginPromptShown: boolean;
  markLoginPromptShown: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasLoginPromptShown, setHasLoginPromptShown] = useState(false);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPromptShown = localStorage.getItem('loginPromptShown');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedPromptShown) {
      setHasLoginPromptShown(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const markLoginPromptShown = () => {
    setHasLoginPromptShown(true);
    localStorage.setItem('loginPromptShown', 'true');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        hasLoginPromptShown,
        markLoginPromptShown,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
