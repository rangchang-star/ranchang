'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Shield, HelpCircle, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    if (confirm('确定要退出登录吗？')) {
      setIsLoggingOut(true);
      // 这里应该调用退出登录API
      console.log('退出登录');
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="w-full max-w-md mx-auto">
        {/* 顶部导航 */}
        <div className="sticky top-0 bg-white z-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <Link href="/profile">
              <Button variant="ghost" className="p-2">
                <ArrowLeft className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />
              </Button>
            </Link>
            <h1 className="text-[15px] font-semibold text-gray-900">设置</h1>
            <div className="w-10" />
          </div>
        </div>

        <div className="px-5 space-y-6">
          {/* 账号设置 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">账号设置</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <Link href="/profile/edit" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">编辑个人资料</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/password" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">修改密码</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/bind-phone" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">绑定手机号</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/settings/delete-account" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-red-400">注销账号</span>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </Link>
            </div>
          </div>

          {/* 帮助与反馈 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <HelpCircle className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">帮助与反馈</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <Link href="/help" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">帮助中心</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/feedback" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">意见反馈</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/about" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">关于我们</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/privacy" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">隐私政策</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
              <Link href="/terms" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">用户协议</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
            </div>
          </div>

          {/* 管理后台 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <LayoutDashboard className="w-5 h-5 text-[rgba(0,0,0,0.4)]" />
              <h2 className="text-[15px] font-semibold text-gray-900">管理后台</h2>
            </div>
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              <Link href="/admin" className="flex items-center justify-between py-4 hover:bg-[rgba(0,0,0,0.02)]">
                <span className="text-[13px] text-gray-900">进入管理后台</span>
                <ChevronRight className="w-5 h-5 text-[rgba(0,0,0,0.3)]" />
              </Link>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="text-center py-4">
            <p className="text-[11px] text-[rgba(0,0,0,0.3)]">
              燃场 v1.0.0
            </p>
          </div>

          {/* 退出登录 */}
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full bg-blue-400 hover:bg-blue-500 text-white font-normal text-[13px] h-10"
          >
            <LogOut className={`w-4 h-4 mr-2 ${isLoggingOut ? 'animate-spin' : ''}`} />
            {isLoggingOut ? '退出中...' : '退出登录'}
          </Button>
        </div>
      </div>
    </div>
  );
}
