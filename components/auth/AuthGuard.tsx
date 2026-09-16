'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = pathname === '/login' || pathname === '/';

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // Redireciona para /login se tentar acessar rotas protegidas sem sessão válida
        router.replace('/login');
      } else if (isAuthenticated && pathname === '/login') {
        // Se já autenticado e na tela de login, vai para o dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, router]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <span className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-xs text-slate-400 font-medium">Verificando credenciais de acesso IT MATCHER...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null; // Evita piscar conteúdo protegido antes do redirecionamento
  }

  return <>{children}</>;
};
