'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AuthGuard } from '@/components/auth/AuthGuard';

export const AppLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="flex flex-col lg:flex-row min-h-screen w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:pl-64 min-h-screen overflow-x-hidden">
          <main className="flex-1 pb-12">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
};
