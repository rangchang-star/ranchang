'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut, Bell, Settings, FileText, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: '数据看板', icon: LayoutDashboard },
  { href: '/admin/members', label: '会员管理', icon: Users },
  { href: '/admin/activities', label: '活动管理', icon: Calendar },
  { href: '/admin/visits', label: '探访管理', icon: Eye },
  { href: '/admin/materials', label: '资料管理', icon: FileText },
  { href: '/admin/messages', label: '消息管理', icon: Bell },
  { href: '/admin/consultations', label: '咨询管理', icon: MessageSquare },
  { href: '/admin/settings', label: '页面设置', icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-[rgba(0,0,0,0.05)] z-50">
        <div className="flex items-center justify-between h-full px-5">
          <div className="flex items-center space-x-2">
            <h1 className="text-[15px] font-bold text-gray-900">燃场后台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-[13px] text-[rgba(0,0,0,0.6)]">管理员</span>
            <Link
              href="/"
              className="flex items-center space-x-1 text-[13px] text-[rgba(0,0,0,0.6)] hover:text-gray-900"
            >
              <LogOut className="w-4 h-4" />
              <span>退出</span>
            </Link>
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
