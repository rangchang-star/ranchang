'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleWeChatLogin = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('请填写完整信息');
      return;
    }

    // 创建用户对象 - 使用 auth-context 中定义的 User 接口
    const user = {
      id: Date.now(), // 数字 ID
      phone: phone.trim(),
      password: '', // 暂时为空
      nickname: name.trim(),
      name: name.trim(),
      avatar: '/avatar-1.jpg',
      age: 35, // 默认值
      company: '',
      position: '',
      industry: '',
      bio: '',
      need: '',
      tagStamp: 'pureExchange',
      tags: [],
      hardcoreTags: ['AI技术', '搞定自己', '会说人话'], // 默认硬核标签
      resourceTags: ['人才', '技术'], // 默认资源标签
      isTrusted: false,
      isFeatured: false,
      role: 'user',
      status: 'active',
      connectionCount: 0,
      activityCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 先保存用户到localStorage（模拟登录状态）
    localStorage.setItem('currentUser', JSON.stringify(user));

    // 登录
    await login(phone.trim());

    // 跳转到首页
    router.push('/discovery');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航 */}
      <div className="px-5 pt-6 pb-4 border-b border-[rgba(0,0,0,0.05)]">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
        </Link>
      </div>

      {/* 内容 */}
      <div className="px-5 py-8 max-w-md mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">登录/注册</h1>
          <p className="text-sm text-[rgba(0,0,0,0.6)]">
            完善信息后使用微信登录
          </p>
        </div>

        {/* 表单 */}
        <div className="space-y-4">
          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              姓名 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                placeholder="请输入您的姓名"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 手机号 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              手机号 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgba(0,0,0,0.4)]" />
              <Input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 微信登录按钮 */}
          <Button
            onClick={handleWeChatLogin}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            微信登录
          </Button>

          {/* 说明 */}
          <div className="mt-4 text-xs text-[rgba(0,0,0,0.4)] text-center">
            <p>登录即表示同意《用户协议》和《隐私政策》</p>
          </div>
        </div>
      </div>
    </div>
  );
}
