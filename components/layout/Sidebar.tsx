'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitCompare,
  UserCheck,
  ShieldCheck,
  FileText,
  Menu,
  X,
  ShieldAlert,
  User as UserIcon,
  Settings,
  LogOut,
  ChevronUp,
  Building2,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/components/auth/AuthContext';
import { LogoutModal } from '@/components/auth/LogoutModal';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, switchAccountType } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: '🏢 Área da Empresa', href: '/empresa', icon: Building2 },
    { label: 'Vagas', href: '/vagas', icon: Briefcase },
    { label: 'Candidatos', href: '/candidatos', icon: Users },
    { label: 'Smart Matching', href: '/matching', icon: GitCompare },
    { label: 'Revisões Humanas', href: '/revisoes', icon: UserCheck },
    { label: 'Auditoria & Logs', href: '/auditoria', icon: FileText },
    { label: 'Meu Perfil', href: '/perfil', icon: UserIcon },
    { label: 'Configurações & Ética', href: '/compliance', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Topbar Mobile com Logo Integrada no Fundo Escuro */}
      <div className="lg:hidden flex items-center justify-between p-3.5 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-xs">
        <Link href="/dashboard" className="flex items-center">
          <Logo variant="full" theme="dark" size="sm" />
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="Abrir menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container Lateral da Sidebar (Fundo Escuro bg-slate-900 Padrão) */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Topo da Sidebar: Logo Alvo/Flecha + ITMATCHER na mesma linha horizontal sem fundo branco */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center" onClick={() => setIsOpen(false)}>
            <Logo variant="full" theme="dark" size="md" />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Banner */}
        <div className="mx-3.5 my-3 p-3 bg-blue-950/70 border border-blue-800/60 rounded-xl text-xs text-blue-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-snug">
            <span className="font-bold text-white block mb-0.5">Apoio à Decisão (RG03)</span>
            Decisão final 100% sob controle do recrutador humano.
          </div>
        </div>

        {/* Links de Navegação (Item Selecionado Ativo em AZUL) */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Menu do Recrutador (Rodapé da Sidebar com Fundo Escuro) */}
        <div className="relative p-3 border-t border-slate-800/80 bg-slate-950/80">
          {/* Dropdown Menu Popover */}
          {userMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2">
              <Link
                href="/perfil"
                onClick={() => {
                  setUserMenuOpen(false);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white font-medium"
              >
                <UserIcon className="w-4 h-4 text-blue-400" />
                <span>Meu Perfil</span>
              </Link>

              <Link
                href="/compliance"
                onClick={() => {
                  setUserMenuOpen(false);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 text-slate-200 hover:text-white font-medium"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Configurações & Ética</span>
              </Link>

              <div className="h-px bg-slate-700/80 my-1" />

              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(false);
                  setIsLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-950/80 hover:text-red-300 text-slate-300 text-left font-semibold cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Sair da Conta</span>
              </button>
            </div>
          )}

          {/* Trigger Card do Usuário */}
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left cursor-pointer"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-blue-500/60"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                {(user?.name || 'Ana Paula').substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Ana Paula Silva'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase">
                  {user?.role || 'RECRUTADOR'}
                </span>
              </div>
            </div>

            <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Modal de Confirmação ao Sair */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </>
  );
};
