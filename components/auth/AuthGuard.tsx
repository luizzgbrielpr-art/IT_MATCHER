'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = pathname === '/login' || pathname === '/';
  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        // Redireciona para /login se tentar acessar rotas protegidas sem sessão válida
        router.replace('/login');
      } else if (isAuthenticated) {
        if (pathname === '/login') {
          // Redireciona de acordo com o papel do usuário após login
          router.replace(isCompany ? '/empresa' : '/dashboard');
        } else if (isCompany && !pathname.startsWith('/empresa')) {
          // REGRA DE NEGÓCIO 10 & 11: Bloqueia acesso de COMPANY ao painel de recrutador e força /empresa
          router.replace('/empresa');
        }
      }
    }
  }, [isAuthenticated, isLoading, pathname, isPublicRoute, isCompany, router]);

  if (isLoading && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <span className="animate-spin w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-xs text-slate-400 font-medium">Verificando permissões de acesso IT MATCHER...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null; // Evita piscar conteúdo protegido antes do redirecionamento
  }

  // Se for usuário COMPANY tentando acessar rotas do recrutador, oculta o conteúdo durante o redirecionamento
  if (isCompany && !pathname.startsWith('/empresa') && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
