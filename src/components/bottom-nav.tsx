'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Bookmark, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/discovery', label: '发现', icon: Compass },
  { href: '/subscription', label: '订阅', icon: Bookmark },
  { href: '/profile', label: '个人', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass shadow-soft-lg z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-around items-center h-[72px] px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center space-y-1 px-6 py-3 rounded-2xl transition-all duration-300',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6 transition-transform duration-300',
                    isActive ? 'scale-110' : ''
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span
                  className={cn(
                    'text-xs font-medium transition-all duration-300',
                    isActive ? 'font-semibold' : ''
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
