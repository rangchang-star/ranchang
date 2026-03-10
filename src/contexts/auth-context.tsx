'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// 用户信息类型
export interface User {
  id: string; // UUID
  phone: string;
  name: string;
  avatar: string;
  gender: string;
  age: number;
  email: string;
  company: string;
  companyScale: string;
  position: string;
  industry: string;
  bio: string;
  need: string;
  tagStamp: string;
  abilityTags: string[];
  hardcoreTags: string[];
  resourceTags: string[];
  level: string;
  connectionType: string;
  isFeatured: boolean;
  status: string;
  joinDate: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        localStorage.removeItem('currentUser');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // 用户登录
  const login = useCallback(async (phone: string, password?: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password, loginType: 'password' }),
      });

      const data = await response.json();

      if (data.success && data.data.user) {
        setUser(data.data.user);
        localStorage.setItem('currentUser', JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || '登录失败' };
      }
    } catch (error: any) {
      console.error('登录失败:', error);
      return { success: false, error: '网络错误，请重试' };
    }
  }, []);

  // 用户登出
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  // 刷新用户信息
  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/users/${user.id}`);
      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
        localStorage.setItem('currentUser', JSON.stringify(data.data));
      }
    } catch (error) {
      console.error('刷新用户信息失败:', error);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
