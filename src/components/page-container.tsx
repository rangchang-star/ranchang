import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto px-6 py-8">
        {title && (
          <header className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">
              {title}
            </h1>
          </header>
        )}
        <main>{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
