'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, User } from 'lucide-react';
import { SunIcon } from '@/components/sun-icon';
import { useAuth } from '@/contexts/auth-context';
import { useLoginModal } from '@/contexts/login-modal-context-v2';

const navItems = [
  { href: '/discovery', label: '发现', icon: Compass },
  { href: '/subscription', label: '点亮', icon: SunIcon },
  { href: '/profile', label: '个人', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { showLoginModal } = useLoginModal();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      // 未登录，弹出登录模态框
      showLoginModal();
    } else {
      // 已登录，跳转到个人中心
      router.push('/profile');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const isProfileItem = item.label === '个人';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isProfileItem ? handleProfileClick : undefined}
                className={`flex flex-col items-center justify-center space-y-0.5 py-2 transition-colors relative ${
                  item.label === '发现'
                    ? 'pl-10 pr-2'
                    : item.label === '个人'
                    ? 'pl-2 pr-10'
                    : 'px-6'
                }`}
              >
                {item.icon === SunIcon ? (
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-gray-400'
                    }`}
                    size={24}
                  />
                ) : (
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-gray-400'
                    }`}
                    strokeWidth={2}
                  />
                )}
                <span
                  className={`text-xs transition-colors ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
