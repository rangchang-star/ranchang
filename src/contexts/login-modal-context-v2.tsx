'use client';

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!phone || !password) {
      setError('请填写手机号和密码');
      setIsLoading(false);
      return;
    }

    // 调用注册API
    const registerResult = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });

    const data = await registerResult.json();

    if (data.success) {
      // 注册成功后自动登录
      const loginResult = await login(phone, password);
      if (loginResult.success) {
        hideLoginModal();
      } else {
        setError('注册成功但登录失败，请手动登录');
      }
    } else {
      setError(data.error || '注册失败，请稍后重试');
    }

    setIsLoading(false);
  };

  return (
    <LoginModalContext.Provider value={{ showLoginModal, hideLoginModal, isOpen }}>
      {children}
      
      {/* 登录/注册模态框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>登录</DialogTitle>
              <DialogDescription>登录或注册燃场账号</DialogDescription>
            </DialogHeader>
          </VisuallyHidden>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>

            {/* 登录表单 */}
            <TabsContent value="login" className="space-y-4 py-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-phone">手机号</Label>
                  <Input
                    id="login-phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">密码</Label>
                  <Input
                    id="login-password"
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
                  disabled={isLoading}
                >
                  {isLoading ? '登录中...' : '登录'}
                </Button>
              </form>
            </TabsContent>

            {/* 注册表单 */}
            <TabsContent value="register" className="space-y-4 py-4">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-phone">手机号 *</Label>
                  <Input
                    id="register-phone"
                    type="tel"
                    placeholder="请输入手机号"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">密码 *</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="请输入密码（6-20位）"
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
                  disabled={isLoading}
                >
                  {isLoading ? '注册中...' : '注册'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
