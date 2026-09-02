import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { GitCompare, ArrowRight, Briefcase, Users, Award, ShieldCheck } from 'lucide-react';

export const revalidate = 0;

export default async function MatchingOverviewPage() {
  const jobs = store.getJobs();
  const candidates = store.getCandidates();

  const jobsWithStats = jobs.map((job) => {
    const matchings = candidates.map((c) => calculateMatching(job, c));
    const ranked = rankCandidates(matchings);
    return {
      job,
      totalCandidates: candidates.length,
      highCount: ranked.filter((r) => r.classification === 'ALTA').length,
      mediumCount: ranked.filter((r) => r.classification === 'MEDIA').length,
      lowCount: ranked.filter((r) => r.classification === 'BAIXA').length,
      topScore: ranked[0]?.score || 0,
      topCandidateName: ranked[0]?.candidateName || 'Nenhum',
    };
  });

  return (
    <div className="space-y-6">
      <Header
        title="Smart Matching & Ranqueamento de Candidatos"
        description="Selecione uma vaga para visualizar a análise técnica ponderada e o ranking automatizado"
      />

      <div className="px-6 space-y-6">
        {/* Banner Informativo */}
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
            <div className="text-xs text-indigo-950">
              <span className="font-bold block text-sm">Algoritmo de Apoio à Decisão Técnica</span>
              O percentual de compatibilidade é calculado exclusivamente a partir das competências ponderadas de cada vaga. A decisão final é sempre humana (RG03).
            </div>
          </div>
        </div>

        {/* Grid de Vagas para Matching */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobsWithStats.map(({ job, highCount, mediumCount, lowCount, topScore, topCandidateName }) => (
            <Card key={job.id} className="hover:border-indigo-300 transition-all hover:shadow-md">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="purple" size="sm">{job.area}</Badge>
                        <Badge variant="default" size="sm">{job.level}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Skills com Pesos */}
                  <div className="flex flex-wrap gap-1">
                    {job.skills.map((s) => (
                      <span key={s.id} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {s.name} <strong className="text-indigo-600 font-bold">{s.weight}%</strong>
                      </span>
                    ))}
                  </div>

                  {/* Resumo de Compatibilidade */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-900">
                      <span className="block text-base font-black text-emerald-700">{highCount}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">Alta (&gt;=80%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-900">
                      <span className="block text-base font-black text-amber-700">{mediumCount}</span>
                      <span className="text-[10px] font-semibold text-amber-700">Média (60-79%)</span>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 text-rose-900">
                      <span className="block text-base font-black text-rose-700">{lowCount}</span>
                      <span className="text-[10px] font-semibold text-rose-700">Baixa (&lt;60%)</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">
                    Líder: <strong className="text-slate-800">{topCandidateName}</strong> ({topScore}%)
                  </span>
                  <Link href={`/matching/${job.id}`}>
                    <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                      Acessar Ranking
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
