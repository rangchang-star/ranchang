import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, User, Lock } from 'lucide-react';

type TabType = 'login' | 'register';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (phone: string, password?: string) => Promise<{ success: boolean; error?: string }>;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // 验证码倒计时
  const handleSendCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'register' }),
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password,
          loginType: 'password',
        }),
      });

      const result = await response.json();

      if (result.success) {
        onClose();
        window.location.reload();
      } else {
        setError(result.message || '登录失败');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }
    if (!code || !/^\d{6}$/.test(code)) {
      setError('请输入6位验证码');
      return;
    }
    if (!nickname) {
      setError('请输入昵称');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, nickname }),
      });

      const result = await response.json();

      if (result.success) {
        // 注册成功后自动登录
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone,
            password: '',
            loginType: 'password',
          }),
        });

        const loginResult = await loginResponse.json();
        if (loginResult.success) {
          onClose();
          window.location.reload();
        }
      } else {
        setError(result.message || '注册失败');
      }
    } catch (err) {
      setError('网络异常，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {activeTab === 'login' ? '登录燃场' : '注册燃场'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {activeTab === 'login' ? '请输入您的手机号和密码登录' : '完善信息后开始使用'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab 切换 */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            注册
          </button>
        </div>

        <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4 mt-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-700">
              手机号
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
                required
                maxLength={11}
              />
            </div>
          </div>

          {activeTab === 'register' && (
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                验证码
              </label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0 || isLoading}
                  variant="outline"
                  className="flex-shrink-0"
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
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
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              密码
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder={activeTab === 'login' ? '请输入密码（可为空）' : '设置密码（可为空）'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white"
            disabled={isLoading}
          >
            {isLoading ? '处理中...' : activeTab === 'login' ? '登录' : '注册并登录'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
