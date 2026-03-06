'use client';

import React, { ReactNode } from 'react';
import { useLoginModal } from '@/contexts/login-modal-context-v2';
import { useAuth } from '@/contexts/auth-context';
import { LoginModal } from '@/components/login-modal';

// 全局登录模态框组件，必须在 AuthProvider 和 LoginModalProvider 内部使用
export function GlobalLoginModal() {
  const { isOpen, hideLoginModal } = useLoginModal();
  const { login } = useAuth();

  return (
    <LoginModal
      isOpen={isOpen}
      onClose={hideLoginModal}
      onLoginSuccess={login}
    />
  );
}
