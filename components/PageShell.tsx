import React from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

interface PageShellProps {
  children: React.ReactNode;
  rightAction?: React.ReactNode;
}

export default function PageShell({ children, rightAction }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F6F7F9] dark:bg-[#0B0D10] text-zinc-900 dark:text-[#F3F4F6] transition-colors duration-150">
      <SiteHeader rightAction={rightAction} />
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}
