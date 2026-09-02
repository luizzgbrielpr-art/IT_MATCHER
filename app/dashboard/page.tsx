import React from 'react';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { CompatibilityChart } from '@/components/dashboard/CompatibilityChart';
import { RecentAnalysesTable } from '@/components/dashboard/RecentAnalysesTable';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { Briefcase, Users, GitCompare, CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from 'lucide-react';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const jobs = store.getJobs();
  const candidates = store.getCandidates();
  const reviews = store.getReviews();

  const allMatchings = [];
  for (const job of jobs) {
    for (const candidate of candidates) {
      allMatchings.push(calculateMatching(job, candidate));
    }
  }

  const highCount = allMatchings.filter((m) => m.classification === 'ALTA').length;
  const mediumCount = allMatchings.filter((m) => m.classification === 'MEDIA').length;
  const lowCount = allMatchings.filter((m) => m.classification === 'BAIXA').length;
  const pendingReviewsCount = allMatchings.length - reviews.length;
  const rankedRecent = rankCandidates(allMatchings).slice(0, 8);

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard de Smart Matching"
        description="Visão consolidada da triagem técnica de candidatos e métricas de compatibilidade"
      />

      <div className="px-6 space-y-6">
        {/* Banner de Conformidade */}
        <div className="p-4 bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl border border-indigo-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/60 rounded-xl border border-indigo-400/40">
              <ShieldCheck className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">IT Matcher Smart Engine Ativo</h4>
              <p className="text-xs text-indigo-200">
                Classificação 100% técnica baseada em pesos configurados. Decisão final sempre humana (RG03).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-semibold">
              ✓ RG01-RG10 Em Conformidade
            </span>
          </div>
        </div>

        {/* Cards de Métricas Principais (Requisito 15) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total de Vagas"
            value={jobs.length}
            subtitle={`${jobs.filter(j => j.status === 'ativa').length} vagas ativas`}
            icon={<Briefcase className="w-5 h-5" />}
            variant="indigo"
          />
          <StatCard
            title="Total de Candidatos"
            value={candidates.length}
            subtitle={`${candidates.filter(c => c.hasResume).length} currículos validados`}
            icon={<Users className="w-5 h-5" />}
            variant="slate"
          />
          <StatCard
            title="Análises Executadas"
            value={allMatchings.length}
            subtitle="Cálculos de compatibilidade"
            icon={<GitCompare className="w-5 h-5" />}
            variant="indigo"
          />
          <StatCard
            title="Pendentes de Revisão"
            value={pendingReviewsCount > 0 ? pendingReviewsCount : 0}
            subtitle="Aguardando parecer humano"
            icon={<Clock className="w-5 h-5" />}
            variant="amber"
          />
        </div>

        {/* Cards de Classificação e Distribuição (Requisito 15) */}
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
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Alta Compatibilidade (80-100%)</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-emerald-700">{highCount} candidatos</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold">
                  {allMatchings.length ? Math.round((highCount / allMatchings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Média Compatibilidade (60-79%)</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-amber-700">{mediumCount} candidatos</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold">
                  {allMatchings.length ? Math.round((mediumCount / allMatchings.length) * 100) : 0}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Baixa Compatibilidade (&lt;60%)</span>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-rose-700">{lowCount} candidatos</span>
                <span className="text-xs px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold">
                  {allMatchings.length ? Math.round((lowCount / allMatchings.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de Últimas Análises (Requisito 15) */}
        <RecentAnalysesTable analyses={rankedRecent} />
      </div>
    </div>
  );
}
