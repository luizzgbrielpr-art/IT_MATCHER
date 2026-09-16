'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ShieldCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, description, children }) => {
  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-4 shadow-2xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Guardrails Ativos
            </span>
          </div>
          {description && <p className="text-xs md:text-sm text-slate-500 mt-1">{description}</p>}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {children ? (
            children
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/vagas/nova">
                <Button size="sm" variant="outline" icon={<Plus className="w-4 h-4" />}>
                  Nova Vaga
                </Button>
              </Link>
              <Link href="/candidatos/novo">
                <Button size="sm" variant="primary" icon={<Plus className="w-4 h-4" />}>
                  Novo Candidato
                </Button>
              </Link>
              <Link href="/perfil" title="Meu Perfil">
                <Button size="sm" variant="ghost" icon={<User className="w-4 h-4 text-indigo-600" />}>
                  Perfil
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
