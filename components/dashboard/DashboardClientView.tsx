'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import { CompatibilityChart } from '@/components/dashboard/CompatibilityChart';
import { RecentAnalysesTable } from '@/components/dashboard/RecentAnalysesTable';
import { Job, Candidate, HumanReview, MatchingResult } from '@/types';
import { Button } from '@/components/ui/Button';
import {
  Briefcase,
  Users,
  GitCompare,
  Clock,
  ShieldCheck,
  LayoutDashboard,
  PieChart,
  ListFilter,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
} from 'lucide-react';

interface DashboardClientViewProps {
  jobs: Job[];
  candidates: Candidate[];
  reviews: HumanReview[];
  allMatchings: MatchingResult[];
  rankedRecent: MatchingResult[];
  highCount: number;
  mediumCount: number;
  lowCount: number;
  pendingReviewsCount: number;
}

export const DashboardClientView: React.FC<DashboardClientViewProps> = ({
  jobs,
  candidates,
  reviews,
  allMatchings,
  rankedRecent,
  highCount,
  mediumCount,
  lowCount,
  pendingReviewsCount,
}) => {
  const [activeTab, setActiveTab] = useState<'kpis' | 'distribuicao' | 'analises' | 'guardrails'>('kpis');

  return (
    <div className="space-y-6">
      {/* Banner Superior Limpo com Atalhos Rápidos */}
      <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-white">Smart Recruitment & Decision Engine</h3>
            <p className="text-xs text-slate-300">
              Cálculo de compatibilidade 100% técnico. Decisão final sempre sob controle do recrutador (RG03).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link href="/vagas/nova">
            <Button size="sm" variant="primary" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              + Nova Vaga
            </Button>
          </Link>
          <Link href="/matching">
            <Button size="sm" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-bold">
              Ver Matches
            </Button>
          </Link>
        </div>
      </div>

      {/* Navegação por Abas (Item Ativo em AZUL) */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('kpis')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kpis'
              ? 'bg-white text-blue-600 border-t-2 border-blue-600 border-x border-slate-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Visão Geral & KPIs</span>
        </button>

        <button
          onClick={() => setActiveTab('distribuicao')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'distribuicao'
              ? 'bg-white text-blue-600 border-t-2 border-blue-600 border-x border-slate-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Distribuição de Compatibilidade</span>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
            {highCount} Alta
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analises')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analises'
              ? 'bg-white text-blue-600 border-t-2 border-blue-600 border-x border-slate-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Últimas Análises</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold">
            {allMatchings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('guardrails')}
          className={`flex items-center gap-2 px-4 py-2.5 font-bold text-xs rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'guardrails'
              ? 'bg-white text-blue-600 border-t-2 border-blue-600 border-x border-slate-200 shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Conformidade Ética (RG01-RG10)</span>
        </button>
      </div>

      {/* CONTEÚDO DAS ABAS */}

      {/* ABA 1: VISÃO GERAL & KPIs */}
      {activeTab === 'kpis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Os 4 Cards Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total de Vagas"
              value={jobs.length}
              subtitle={`${jobs.filter((j) => j.status === 'ativa').length} vagas ativas`}
              icon={<Briefcase className="w-5 h-5 text-blue-600" />}
              variant="indigo"
            />
            <StatCard
              title="Candidatos"
              value={candidates.length}
              subtitle={`${candidates.filter((c) => c.hasResume).length} currículos validados`}
              icon={<Users className="w-5 h-5" />}
              variant="slate"
            />
            <StatCard
              title="Melhores Matches"
              value={highCount}
              subtitle="Compatibilidade Alta (>=80%)"
              icon={<Award className="w-5 h-5 text-emerald-600" />}
              variant="emerald"
            />
            <StatCard
              title="Processos Ativos"
              value={pendingReviewsCount > 0 ? pendingReviewsCount : 0}
              subtitle="Pendentes de revisão humana"
              icon={<Clock className="w-5 h-5 text-amber-600" />}
              variant="amber"
            />
          </div>

          {/* Resumo de Ações Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <RecentAnalysesTable analyses={rankedRecent.slice(0, 5)} />
            </div>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-slate-900">Ações Rápidas de Triagem</h4>
                </div>

                <div className="space-y-2">
                  <Link href="/vagas/nova" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-colors flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Cadastrar Nova Vaga de TI</span>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </div>
                  </Link>

                  <Link href="/candidatos/novo" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-colors flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Cadastrar Candidato + PDF</span>
                      <ArrowRight className="w-4 h-4 text-blue-600" />
                    </div>
                  </Link>

                  <Link href="/revisoes" className="block">
                    <div className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 transition-colors flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Fila de Revisão Humana</span>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                        {pendingReviewsCount}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 rounded-2xl text-white space-y-2">
                <h5 className="text-xs font-bold text-blue-400 uppercase tracking-wider">Design Limpo & Responsivo</h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  As informações secundárias foram organizadas em abas para evitar poluição visual e manter foco operacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: DISTRIBUIÇÃO & GRÁFICOS */}
      {activeTab === 'distribuicao' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CompatibilityChart
                highCount={highCount}
                mediumCount={mediumCount}
                lowCount={lowCount}
                total={allMatchings.length}
              />
            </div>

            <div className="space-y-3 flex flex-col justify-between">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Alta Compatibilidade (80-100%)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-emerald-700">{highCount} candidatos</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {allMatchings.length ? Math.round((highCount / allMatchings.length) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Média Compatibilidade (60-79%)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-amber-700">{mediumCount} candidatos</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    {allMatchings.length ? Math.round((mediumCount / allMatchings.length) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Baixa Compatibilidade (&lt;60%)</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-rose-700">{lowCount} candidatos</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    {allMatchings.length ? Math.round((lowCount / allMatchings.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: ÚLTIMAS ANÁLISES */}
      {activeTab === 'analises' && (
        <div className="animate-in fade-in duration-200">
          <RecentAnalysesTable analyses={rankedRecent} />
        </div>
      )}

      {/* ABA 4: GUARDRAILS & CONFORMIDADE */}
      {activeTab === 'guardrails' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Guardrails Éticos & Segurança da Informação</h3>
              <p className="text-xs text-slate-500">
                100% de conformidade com os princípios RG01 a RG10 estabelecidos no IT Matcher
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">RG01 — Proteção PII:</strong>
                Mascaramento de e-mail e telefone nas tabelas públicas.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">RG03 — Decisão Humana:</strong>
                Contratações ou eliminações nunca são automáticas.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">RG05 — Não Discriminação:</strong>
                Cálculo restrito a competências técnicas e senioridade.
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">RG08 — PDF Seguro:</strong>
                Upload seguro com verificação de tipo MIME e limite de 5MB.
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <Link href="/compliance">
              <Button size="sm" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                Ver Painel Completo de Compliance
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
