import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageContainer({ children, title, subtitle }: PageContainerProps) {
  return (
    <div className="min-h-screen pb-24 bg-[#F1F2F6]">
      <div className="max-w-2xl mx-auto px-5 py-6">
        {title && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-gradient leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-base text-muted-foreground">
                {subtitle}
              </p>
            )}
          </header>
        )}
        <main className="space-y-5">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
