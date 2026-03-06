'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  phone: string;
  nickname: string;
  name: string;
  avatar: string;
  age: number;
  company: string;
  position: string;
  industry: string;
  bio: string;
  need: string;
  tagStamp: string;
  tags: string[];
  abilityTags: string[];
  resourceTags: string[];
  isTrusted: boolean;
  role: string;
  status: string;
  connectionCount: number;
  activityCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 从 localStorage 加载登录状态
  useEffect(() => {
    const loadAuthState = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

        if (storedUser && storedIsLoggedIn === 'true') {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to load auth state:', error);
      }
    };

    loadAuthState();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    // 保存到 localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    // 保存用户ID
    localStorage.setItem('currentUserId', userData.id.toString());
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    // 清除 localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUserId');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
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
