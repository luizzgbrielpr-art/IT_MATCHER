import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { Briefcase, ArrowRight, Clock, Award, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';

export const revalidate = 0;

export default async function DetalhesVagaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = store.getJobById(id);

  if (!job) {
    notFound();
  }

  const candidates = store.getCandidates();
  const matchings = rankCandidates(candidates.map((c) => calculateMatching(job, c)));
  const topCandidates = matchings.slice(0, 3);

  return (
    <div className="space-y-6">
      <Header
        title={job.title}
        description={`Área: ${job.area} • Nível: ${job.level} • Mínimo de ${job.minExperienceYears} anos`}
      >
        <div className="flex items-center gap-2">
          <Link href="/vagas">
            <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
              Voltar
            </Button>
          </Link>
          <Link href={`/matching/${job.id}`}>
            <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Ver Ranking & Matching
            </Button>
          </Link>
        </div>
      </Header>

      <div className="px-6 space-y-6 max-w-6xl mx-auto">
        {/* Card Principal da Vaga */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple">{job.area}</Badge>
            <Badge variant="default">{job.level}</Badge>
            <Badge variant="success">Vaga {job.status}</Badge>
            <span className="text-xs text-slate-500 ml-auto">
              Cadastrada em: {new Date(job.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Descrição e Requisitos
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>
        </div>

        {/* Distribuição de Pesos de Competências (Requisito 4) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <h4 className="text-base font-bold text-slate-900">
                Competências Técnicas e Pesos de Importância
              </h4>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold border border-emerald-200">
              Soma: 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {job.skills.map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{skill.name}</h5>
                  <span className="text-[11px] text-slate-500">Critério técnico</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-indigo-600">{skill.weight}%</span>
                  <span className="block text-[10px] text-slate-400">peso no matching</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview dos Melhores Candidatos para a Vaga */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900">Top Candidatos Compatíveis</h4>
              <p className="text-xs text-slate-500">Prévia do ranqueamento calculado</p>
            </div>
            <Link href={`/matching/${job.id}`}>
              <Button variant="outline" size="sm">
                Ver Todos ({matchings.length})
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCandidates.map((m, idx) => (
              <div key={m.candidateId} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    #{idx + 1} no Ranking
                  </span>
                  <span className="text-base font-black text-emerald-700">{m.score}%</span>
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{m.candidateName}</h5>
                  <p className="text-xs text-slate-500">{m.experienceComparison.candidateYears} anos • {m.levelComparison.candidateLevel}</p>
                </div>
                <div className="text-[11px] text-slate-600">
                  {m.matchedSkills.length} de {job.skills.length} skills encontradas
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
