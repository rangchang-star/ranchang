'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Bookmark, User } from 'lucide-react';

const navItems = [
  { href: '/discovery', label: '发现', icon: Compass },
  { href: '/subscription', label: '订阅', icon: Bookmark },
  { href: '/profile', label: '个人', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center space-y-0.5 px-6 py-2 transition-colors relative"
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`}
                  strokeWidth={2}
                />
                <span
                  className={`text-xs transition-colors ${
                    isActive ? 'text-blue-400' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
                {/* 小红点 */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-red-500 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
