'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  fallback?: ReactNode;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // 如果需要登录但用户未登录
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // 默认行为：显示登录提示并跳转到登录页
    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="text-center">
          <p className="text-base text-[rgba(0,0,0,0.6)] mb-4">
            该功能需要登录后使用
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-blue-400 hover:bg-blue-500 text-white text-sm rounded-lg"
          >
            去登录
          </button>
        </div>
      </div>
    );
  }

  // 如果用户是游客且需要真实用户
  if (requireAuth && isAuthenticated && user?.isGuest) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-white p-4">
        <div className="text-center">
          <p className="text-base text-[rgba(0,0,0,0.6)] mb-4">
            该功能需要正式登录后使用
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2.5 bg-blue-400 hover:bg-blue-500 text-white text-sm rounded-lg"
          >
            完善信息登录
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
