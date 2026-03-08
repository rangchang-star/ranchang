'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRegisterModal } from '@/components/login-register-modal';

export default function LoginPromptModal() {
  const router = useRouter();
  const { isAuthenticated, hasLoginPromptShown, markLoginPromptShown } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // 如果已经登录或已显示过登录提示，则不再显示
    if (isAuthenticated || hasLoginPromptShown) {
      return;
    }

    // 延迟 1 秒显示登录提示
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, hasLoginPromptShown]);

  const handleClose = () => {
    setIsOpen(false);
    markLoginPromptShown();
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: '游客',
      isGuest: true,
    };

    // 通过 localStorage 暂存
    localStorage.setItem('user', JSON.stringify(guestUser));
    window.location.reload();
  };

  const handleLoginRegister = () => {
    setIsOpen(false);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: any) => {
    setShowLoginModal(false);
    // 刷新页面以更新登录状态
    window.location.reload();
  };

  const handleRegisterSuccess = (user: any) => {
    setShowLoginModal(false);
    // 刷新页面以更新登录状态
    window.location.reload();
  };

  if (!isOpen || isAuthenticated || hasLoginPromptShown) {
    return (
      <>
        {showLoginModal && (
          <LoginRegisterModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">欢迎来到燃场</h2>
          <p className="text-sm text-[rgba(0,0,0,0.6)]">
            让经验被复用，让困境有回响，让下半场有伙伴
          </p>
        </div>

        {/* 选项 */}
        <div className="space-y-3">
          <Button
            onClick={handleLoginRegister}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white text-sm"
          >
            登录/注册
          </Button>
          <Button
            onClick={handleGuestLogin}
            variant="outline"
            className="w-full text-sm border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.02)]"
          >
            游客浏览
          </Button>
        </div>

        {/* 说明 */}
        <div className="mt-4 text-xs text-[rgba(0,0,0,0.4)] text-center">
          <p>游客登录仅可浏览基础内容，完整功能需登录</p>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[rgba(0,0,0,0.4)] hover:text-[rgba(0,0,0,0.6)] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 登录/注册弹窗 */}
      {showLoginModal && (
        <LoginRegisterModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
}
