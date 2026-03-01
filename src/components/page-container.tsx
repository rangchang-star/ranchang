import { ReactNode } from 'react';
import { BottomNav } from './bottom-nav';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <div className="max-w-lg mx-auto">
        {title && (
          <header className="px-4 py-4">
            <h1 className="text-xl font-semibold font-serif text-foreground">
              {title}
            </h1>
          </header>
        )}
        <main className="px-4">{children}</main>
      </div>
      <BottomNav />
    </div>
  );
}
