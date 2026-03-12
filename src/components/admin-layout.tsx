'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut, Bell, Settings, FileText, Eye, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

const navItems = [
  { href: '/admin', label: '数据看板', icon: LayoutDashboard },
  { href: '/admin/members', label: '会员管理', icon: Users },
  { href: '/admin/activities', label: '活动管理', icon: Calendar },
  { href: '/admin/visits', label: '探访管理', icon: Eye },
  { href: '/admin/materials', label: '资料管理', icon: FileText },
  { href: '/admin/messages', label: '消息管理', icon: Bell },
  { href: '/admin/consultations', label: '咨询管理', icon: MessageSquare },
  { href: '/admin/admin', label: '管理员管理', icon: Shield },
  { href: '/admin/settings', label: '页面设置', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 等待加载完成
    if (isLoading) return;

    setIsCheckingAuth(false);

    // 检查用户是否登录
    if (!user) {
      // 未登录，跳转到登录页
      router.push('/login');
      return;
    }

    // 检查用户是否为管理员
    if (!isAdmin) {
      // 不是管理员，显示错误或跳转到首页
      alert('您没有权限访问后台管理系统');
      router.push('/');
      return;
    }
  }, [user, isAdmin, isLoading, router]);

  // 加载中或检查权限中显示加载状态
  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          <p className="mt-4 text-[rgba(0,0,0,0.6)]">加载中...</p>
        </div>
      </div>
    );
  }

  // 用户未登录或不是管理员
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between h-full px-5">
          <div className="flex items-center space-x-2">
            <h1 className="text-[15px] font-bold text-gray-900">燃场后台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">
              {user.nickname || user.name}
            </span>
            <button
              onClick={() => {
                logout();
                router.push('/');
              }}
              className="flex items-center space-x-1 text-[13px] text-[rgba(0,0,0,0.6)] hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>退出</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-14">
        {/* 侧边栏 */}
        <aside className="fixed left-0 top-14 bottom-0 w-48 bg-white border-r border-[rgba(0,0,0,0.05)]">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 text-[13px] transition-colors',
                    isActive
                      ? 'bg-[rgba(59,130,246,0.4)] text-white font-medium'
                      : 'text-[rgba(0,0,0,0.6)] hover:bg-[rgba(0,0,0,0.05)] hover:text-gray-900'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="ml-48 flex-1 p-5">
          {children}
        </main>
      </div>
    </div>
  );
}
