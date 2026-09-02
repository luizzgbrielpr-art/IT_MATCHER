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
  Cpu,
  ShieldAlert,
} from 'lucide-react';
import { CURRENT_USER } from '@/types';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Vagas', href: '/vagas', icon: Briefcase },
    { label: 'Candidatos', href: '/candidatos', icon: Users },
    { label: 'Smart Matching', href: '/matching', icon: GitCompare },
    { label: 'Revisões Humanas', href: '/revisoes', icon: UserCheck },
    { label: 'Auditoria & Logs', href: '/auditoria', icon: FileText },
    { label: 'Guardrails & Ética', href: '/compliance', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile top bar trigger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-base">IT Matcher</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          aria-label="Abrir menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
            <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight">IT Matcher</h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide uppercase">Smart Recruitment</p>
            </div>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guardrail Banner */}
        <div className="mx-4 my-3 p-3 bg-indigo-950/60 border border-indigo-800/60 rounded-xl text-xs text-indigo-200 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-snug">
            <span className="font-semibold text-white block mb-0.5">Apoio à Decisão (RG03)</span>
            Decisão final 100% sob controle do recrutador humano.
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Current Recruiter Profile (RG02) */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-700/60 border border-indigo-500/50 flex items-center justify-center font-bold text-white text-xs">
              AP
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{CURRENT_USER.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">{CURRENT_USER.role}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
