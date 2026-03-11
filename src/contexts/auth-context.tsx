'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { User } from '@/lib/services/types'; // 使用统一的 User 类型

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;  // 添加 setUser
  setUserRole: (role: string) => void;   // 添加 setUserRole
  isAdmin: boolean;                      // 添加 isAdmin
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
  const [userRole, setUserRole] = useState<string>('user'); // 添加用户角色状态
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载用户信息
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedRole = localStorage.getItem('userRole');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedRole) {
          setUserRole(storedRole);
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userRole');
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
    setUserRole('user');  // 重置角色
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
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

  // 设置用户角色
  const handleSetUserRole = useCallback((role: string) => {
    setUserRole(role);
    localStorage.setItem('userRole', role);
  }, []);

  const value: AuthContextType = {
    user,
    setUser,                          // 添加 setUser
    setUserRole: handleSetUserRole,   // 添加 setUserRole
    isAdmin: userRole === 'admin',   // 添加 isAdmin
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
