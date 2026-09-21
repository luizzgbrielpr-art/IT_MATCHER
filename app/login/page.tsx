'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { Lock, Mail, ShieldCheck, ArrowRight, Building2, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [loginType, setLoginType] = useState<'recrutador' | 'empresa'>('recrutador');
  const [email, setEmail] = useState('ana.recrutamento@itmatcher.com.br');
  const [password, setPassword] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTabSwitch = (type: 'recrutador' | 'empresa') => {
    setLoginType(type);
    if (type === 'recrutador') {
      setEmail('ana.recrutamento@itmatcher.com.br');
    } else {
      setEmail('empresa@techsolutions.com.br');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isCompany = loginType === 'empresa';
      const success = await login(email, password, isCompany);
      if (success) {
        showToast(`Login efetuado com sucesso como ${isCompany ? 'Empresa' : 'Recrutador'}!`, 'success');
        router.push(isCompany ? '/empresa' : '/dashboard');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao efetuar login', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200 relative z-10 space-y-6">
        {/* Logo Oficial com Alvo Vermelho e Flecha Azul */}
        <div className="text-center space-y-2">
          <Logo size="xl" className="mx-auto" />
          <h2 className="text-xl font-black text-slate-900 tracking-tight pt-2">Acesso ao IT MATCHER</h2>
          <p className="text-xs text-slate-500">
            Plataforma de Smart Recruitment & Gestão de Vagas Tecnológicas
          </p>
        </div>

        {/* Abas de Seleção: Recrutador vs Empresa */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200">
          <button
            type="button"
            onClick={() => handleTabSwitch('recrutador')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginType === 'recrutador'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Recrutador
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('empresa')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              loginType === 'empresa'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Conta Empresa
          </button>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              {loginType === 'empresa' ? 'E-mail da Empresa' : 'E-mail do Recrutador'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 bg-white"
                placeholder={loginType === 'empresa' ? 'empresa@tech.com.br' : 'seu.email@empresa.com'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Dica para Acesso Rápido de Demonstração */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-0.5">
            <span className="font-bold flex items-center gap-1 text-blue-950">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Demonstração ({loginType === 'empresa' ? 'EMPRESA' : 'RECRUTADOR'}):
            </span>
            <p className="text-[11px] text-blue-800">
              {loginType === 'empresa'
                ? 'Utilize o e-mail pré-preenchido para acessar a Área da Empresa exclusiva (/empresa).'
                : 'Utilize o e-mail pré-preenchido para acessar o Dashboard administrativo do Recrutador.'}
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            icon={<ArrowRight className="w-5 h-5" />}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md cursor-pointer"
          >
            {loginType === 'empresa' ? 'Entrar na Área da Empresa' : 'Entrar no Sistema'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 text-[11px] text-slate-400">
          Guardrails Éticos & Segurança da Informação RG01–RG10 Ativos
        </div>
      </div>
    </div>
  );
}
