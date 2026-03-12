'use client';

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

// 创建一个 Context 来管理登录模态框的显示状态和登录逻辑
interface LoginModalContextType {
  showLoginModal: () => void;
  hideLoginModal: () => void;
  isOpen: boolean;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const showLoginModal = useCallback(() => {
    console.log('showLoginModal 被调用');
    setIsOpen(true);
    setError('');
    setPhone('');
    setPassword('');
  }, []);

  const hideLoginModal = useCallback(() => {
    setIsOpen(false);
    setError('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!phone || !password) {
      setError('请输入手机号和密码');
      setIsLoading(false);
      return;
    }

    const result = await login(phone, password);

    if (result.success) {
      hideLoginModal();
    } else {
      setError(result.error || '登录失败，请稍后重试');
    }

    setIsLoading(false);
  };

  return (
    <LoginModalContext.Provider value={{ showLoginModal, hideLoginModal, isOpen }}>
      {children}
      
      {/* 登录模态框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>登录</DialogTitle>
              <DialogDescription>请输入手机号和密码登录燃场</DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </Button>

            <div className="text-center text-sm text-gray-500">
              <p>还没有账号？请联系管理员注册</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
}
