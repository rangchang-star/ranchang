'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// 用户信息类型
export interface User {
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
  hardcoreTags: string[];
  resourceTags: string[];
  isTrusted: boolean;
  isFeatured: boolean;
  role: 'user' | 'admin';
  status: string;
  connectionCount: number;
  activityCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  setUserRole: (role: 'user' | 'admin') => void;
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
        body: JSON.stringify({ phone, password }),
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

  // 更新用户角色（用于管理员登录）
  const setUserRole = useCallback((role: 'user' | 'admin') => {
    if (!user) return;

    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }, [user]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    logout,
    refreshUser,
    setUserRole,
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
