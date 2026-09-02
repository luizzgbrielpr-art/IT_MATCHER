import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MatchingScoreBadge } from '@/components/matching/MatchingScoreBadge';
import { store } from '@/lib/storage';
import { calculateMatching } from '@/lib/matching';
import { maskEmail, maskPhone } from '@/lib/security';
import { User, FileText, Mail, Phone, Calendar, ArrowRight, ChevronLeft, ShieldCheck, Award } from 'lucide-react';

export const revalidate = 0;

export default async function DetalhesCandidatoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = store.getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const jobs = store.getJobs();
  const evaluations = jobs.map((job) => ({
    job,
    matching: calculateMatching(job, candidate),
  })).sort((a, b) => b.matching.score - a.matching.score);

  return (
    <div className="space-y-6">
      <Header
        title={candidate.name}
        description={`Perfil do Candidato • ${candidate.level} • ${candidate.experienceYears} ano(s) de experiência`}
      >
        <Link href="/candidatos">
          <Button variant="outline" size="sm" icon={<ChevronLeft className="w-4 h-4" />}>
            Voltar para Lista
          </Button>
        </Link>
      </Header>

      <div className="px-6 space-y-6 max-w-6xl mx-auto">
        {/* Card de Perfil */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-sm">
                {candidate.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">{candidate.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="purple">{candidate.level}</Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    {candidate.experienceYears} ano(s) de experiência profissional
                  </span>
                </div>
              </div>
            </div>

            {candidate.hasResume && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>
                  Currículo PDF validado ({((candidate.resumeFileSize || 0) / 1024).toFixed(0)} KB)
                </span>
              </div>
            )}
          </div>

          {/* Dados de Contato Mascarados (RG01) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">E-mail:</span>
              <span className="font-semibold text-slate-800">{maskEmail(candidate.email)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Telefone:</span>
              <span className="font-semibold text-slate-800">{maskPhone(candidate.phone)}</span>
            </div>
          </div>

          {candidate.bio && (
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Resumo Profissional
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed">{candidate.bio}</p>
            </div>
          )}

          {/* Competências Técnicas */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Competências Técnicas Cadastradas ({candidate.technicalSkills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Compatibilidade com as Vagas do Sistema */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Compatibilidade com as Vagas Abertas
              </h3>
              <p className="text-xs text-slate-500">
                Comparação automática de competências e pesos técnicos
              </p>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {evaluations.length} vaga(s) analisada(s)
            </span>
          </div>

          <div className="space-y-3">
            {evaluations.map(({ job, matching }) => (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{job.title}</h4>
                    <Badge variant="purple" size="sm">{job.area}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">
                    Exige {job.level} • Mínimo {job.minExperienceYears} ano(s)
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <MatchingScoreBadge
                    score={matching.score}
                    classification={matching.classification}
                    label={matching.classificationLabel}
                    size="sm"
                  />
                  <Link href={`/matching/${job.id}`}>
                    <Button variant="outline" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Ver Ranking
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
