'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AlertCircle, X, ShieldCheck } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface LoginRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (user: any) => void;
  onRegisterSuccess?: (user: any) => void;
}

type TabType = 'login' | 'register';

export function LoginRegisterModal({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterSuccess,
}: LoginRegisterModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [phoneError, setPhoneError] = useState('');
  const [codeError, setCodeError] = useState('');

  // 验证码倒计时
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 手机号验证
  const validatePhone = (value: string) => {
    if (!value) {
      setPhoneError('请输入手机号');
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(value)) {
      setPhoneError('请输入正确的手机号');
      return false;
    }
    setPhoneError('');
    return true;
  };

  // 验证码验证
  const validateCode = (value: string) => {
    if (!value) {
      setCodeError('请输入验证码');
      return false;
    }
    if (!/^\d{6}$/.test(value)) {
      setCodeError('请输入6位数字验证码');
      return false;
    }
    setCodeError('');
    return true;
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!validatePhone(phone)) {
      return;
    }

    if (countdown > 0) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          type: activeTab,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setCountdown(60);
        setError(null);
      } else {
        setError(result.message || '验证码发送失败');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 登录
  const handleLogin = async () => {
    if (!validatePhone(phone) || !validateCode(code)) {
      return;
    }

    if (!agreedToTerms) {
      setError('请先同意用户协议');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (onLoginSuccess) {
          onLoginSuccess(result.data.user);
        }
        onClose();
        // 清空表单
        setPhone('');
        setCode('');
        setPassword('');
        setNickname('');
        setAgreedToTerms(false);
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 注册
  const handleRegister = async () => {
    if (!validatePhone(phone) || !validateCode(code)) {
      return;
    }

    if (!nickname) {
      setError('请输入昵称');
      return;
    }

    if (!agreedToTerms) {
      setError('请先同意用户协议');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          code,
          password: password || undefined,
          nickname,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (onRegisterSuccess) {
          onRegisterSuccess(result.data.user);
        }
        onClose();
        // 清空表单
        setPhone('');
        setCode('');
        setPassword('');
        setNickname('');
        setAgreedToTerms(false);
      } else {
        setError(result.message || '注册失败');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // Tab 切换时保持手机号和验证码
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            {activeTab === 'login' ? '请先登录' : '欢迎加入燃场'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            {activeTab === 'login'
              ? '登录后即可使用全部功能'
              : '让经验被复用，让困境有回响，让下半场有伙伴'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => handleTabChange('register')}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md mt-4">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* 表单 */}
        <div className="space-y-4 mt-4">
          {/* 手机号 */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              手机号
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value) validatePhone(e.target.value);
              }}
              maxLength={11}
              className={phoneError ? 'border-red-500' : ''}
            />
            {phoneError && (
              <p className="text-xs text-red-500">{phoneError}</p>
            )}
          </div>

          {/* 验证码 */}
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-gray-700">
              验证码
            </label>
            <div className="flex space-x-2">
              <Input
                id="code"
                type="text"
                placeholder="请输入验证码"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (e.target.value) validateCode(e.target.value);
                }}
                maxLength={6}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleSendCode}
                disabled={countdown > 0 || isLoading || !phone}
                variant="outline"
                className="whitespace-nowrap"
              >
                {countdown > 0 ? `${countdown}s后重发` : '发送验证码'}
              </Button>
            </div>
            {codeError && (
              <p className="text-xs text-red-500">{codeError}</p>
            )}
          </div>

          {/* 注册专属字段 */}
          {activeTab === 'register' && (
            <>
              {/* 密码（可选） */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  密码（可选）
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请设置6-20位密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  maxLength={20}
                />
              </div>

              {/* 昵称 */}
              <div className="space-y-2">
                <label htmlFor="nickname" className="text-sm font-medium text-gray-700">
                  昵称
                </label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="请输入昵称"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  minLength={2}
                  maxLength={20}
                />
              </div>
            </>
          )}

          {/* 用户协议 */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) =>
                setAgreedToTerms(checked as boolean)
              }
              className="mt-0.5"
            />
            <label htmlFor="terms" className="text-xs text-gray-600 leading-relaxed">
              我已阅读并同意《用户协议》和《隐私政策》
            </label>
          </div>

          {/* 提交按钮 */}
          <Button
            onClick={activeTab === 'login' ? handleLogin : handleRegister}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
            disabled={isLoading}
          >
            {isLoading
              ? '处理中...'
              : activeTab === 'login'
              ? '登录'
              : '注册'}
          </Button>

          {/* 微信快捷登录 */}
          <div className="relative pt-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">其他登录方式</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full text-green-600 border-green-600 hover:bg-green-50"
            onClick={() => {
              setError('微信登录功能开发中，请使用手机号登录');
            }}
          >
            <ShieldCheck className="w-4 h-4 mr-2" />
            微信一键登录
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
