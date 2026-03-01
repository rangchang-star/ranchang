'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Calendar, MessageSquare, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: '数据看板', icon: LayoutDashboard },
  { href: '/admin/members', label: '会员管理', icon: Users },
  { href: '/admin/activities', label: '活动管理', icon: Calendar },
  { href: '/admin/consultations', label: '咨询管理', icon: MessageSquare },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-foreground">燃场后台</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">管理员</span>
            <Link
              href="/"
              className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              <span>退出</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* 侧边栏 */}
        <aside className="fixed left-0 top-16 bottom-0 w-56 bg-background border-r border-border">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
        <main className="ml-56 flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
