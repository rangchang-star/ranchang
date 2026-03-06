'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LoginModalContextType {
  showLoginModal: () => void;
  hideLoginModal: () => void;
  isOpen: boolean;
}

const LoginModalContext = createContext<LoginModalContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

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
