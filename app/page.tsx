import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  ShieldCheck,
  Zap,
  Users,
  Briefcase,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  Lock,
  PieChart,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="space-y-12 p-6 md:p-10 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-14 shadow-2xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Sistema Inteligente de Apoio à Decisão Técnica</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Smart Matching Transparente para Recrutamento em TI
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed">
            O <strong>IT Matcher</strong> conecta perfis técnicos a vagas de tecnologia por meio de cálculo ponderado de competências, guardrails éticos estritos e revisão 100% humana.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/dashboard">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-5 h-5" />}>
                Acessar Dashboard
              </Button>
            </Link>
            <Link href="/matching">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Ver Smart Matching
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative Grid and Blur */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Pilares do Sistema */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Pesos Técnicos Customizáveis</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cada vaga define o peso percentual exato de cada competência (JavaScript 30%, React 25%, SQL 20%...), permitindo alinhamento técnico perfeito.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Decisão 100% Humana (RG03)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            O algoritmo auxilia e ranqueia, mas nunca toma decisões finais de contratação ou descarte automaticamente. O controle é sempre do recrutador.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Guardrails & Não-Discriminação</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Conformidade rigorosa com RG01 a RG10: proteção de dados (PII), auditoria imutável, validação de arquivos PDF e ausência de critérios pessoais discriminatórios.
          </p>
        </div>
      </section>

      {/* Ações Rápidas */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">Pronto para iniciar a triagem técnica?</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cadastre novas vagas com pesos customizados ou importe candidatos com validação de currículo.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/vagas/nova">
            <Button variant="primary" size="md">
              Cadastrar Nova Vaga
            </Button>
          </Link>
          <Link href="/candidatos/novo">
            <Button variant="outline" size="md" className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700">
              Cadastrar Candidato
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
