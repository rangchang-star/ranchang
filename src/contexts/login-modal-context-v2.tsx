'use client';

import React, { ReactNode, createContext, useContext, useState, useCallback } from 'react';
import { useAuth } from './auth-context';

// 创建一个 Context 来管理登录模态框的显示状态和登录逻辑
interface LoginModalContextType {
  showLoginModal: () => void;
  hideLoginModal: () => void;
  isOpen: boolean;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { login } = useAuth();

  const showLoginModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const hideLoginModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <LoginModalContext.Provider value={{ showLoginModal, hideLoginModal, isOpen }}>
      {children}
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
