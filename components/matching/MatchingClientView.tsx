'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Job, Candidate, HumanReview, MatchingFilterOptions, MatchingResult } from '@/types';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { MatchingFilterBar } from './MatchingFilterBar';
import { RankingTable } from './RankingTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Briefcase, ArrowLeft, RefreshCw, Award, Filter, ShieldAlert } from 'lucide-react';

interface MatchingClientViewProps {
  job: Job;
  initialCandidates: Candidate[];
  initialReviews: HumanReview[];
}

export const MatchingClientView: React.FC<MatchingClientViewProps> = ({
  job,
  initialCandidates,
  initialReviews,
}) => {
  const [reviews, setReviews] = useState<HumanReview[]>(initialReviews);
  const [filters, setFilters] = useState<MatchingFilterOptions>({
    classification: 'ALL',
    level: 'ALL',
    minExperience: 0,
    requiredSkill: '',
    reviewStatus: '',
    searchTerm: '',
  });

  // Calcular matchings e anexar status de revisão
  const allCalculatedResults = useMemo(() => {
    const calculated = initialCandidates.map((cand) => {
      const match = calculateMatching(job, cand);
      const existingReview = reviews.find(
        (r) => r.jobId === job.id && r.candidateId === cand.id
      );

      return {
        ...match,
        candidate: cand,
        reviewStatus: existingReview ? existingReview.status : 'Pendente de revisão',
        reviewNotes: existingReview ? existingReview.notes : undefined,
        reviewedAt: existingReview ? existingReview.reviewedAt : undefined,
      };
    });

    return rankCandidates(calculated);
  }, [job, initialCandidates, reviews]);

  // Aplicar filtros combinados (Requisito 10)
  const filteredAndRanked = useMemo(() => {
    return allCalculatedResults.filter((item) => {
      // Filtro por Nome / Palavra-chave
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        const matchesName = item.candidateName.toLowerCase().includes(term);
        const matchesSkills = item.allRequirements.some((r) =>
          r.skillName.toLowerCase().includes(term)
        );
        if (!matchesName && !matchesSkills) return false;
      }

      // Filtro por Classificação (Alta / Média / Baixa)
      if (filters.classification && filters.classification !== 'ALL') {
        if (item.classification !== filters.classification) return false;
      }

      // Filtro por Nível Profissional
      if (filters.level && filters.level !== 'ALL') {
        if (item.levelComparison.candidateLevel !== filters.level) return false;
      }

      // Filtro por Anos Mínimos de Experiência
      if (filters.minExperience && filters.minExperience > 0) {
        if (item.experienceComparison.candidateYears < filters.minExperience) return false;
      }

      // Filtro por Skill Específica Presente
      if (filters.requiredSkill) {
        const hasSkill = item.matchedSkills.some(
          (s) => s.skillName.toLowerCase() === filters.requiredSkill?.toLowerCase()
        );
        if (!hasSkill) return false;
      }

      // Filtro por Status da Revisão
      if (filters.reviewStatus) {
        if (item.reviewStatus !== filters.reviewStatus) return false;
      }

      return true;
    });
  }, [allCalculatedResults, filters]);

  const availableSkills = useMemo(() => {
    const set = new Set<string>();
    job.skills.forEach((s) => set.add(s.name));
    initialCandidates.forEach((c) => c.technicalSkills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [job, initialCandidates]);

  const stats = useMemo(() => {
    return {
      total: allCalculatedResults.length,
      high: allCalculatedResults.filter((r) => r.classification === 'ALTA').length,
      medium: allCalculatedResults.filter((r) => r.classification === 'MEDIA').length,
      low: allCalculatedResults.filter((r) => r.classification === 'BAIXA').length,
      reviewed: allCalculatedResults.filter((r) => r.reviewStatus !== 'Pendente de revisão').length,
    };
  }, [allCalculatedResults]);

  const handleResetFilters = () => {
    setFilters({
      classification: 'ALL',
      level: 'ALL',
      minExperience: 0,
      requiredSkill: '',
      reviewStatus: '',
      searchTerm: '',
    });
  };

  const handleReviewUpdated = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.success) {
        setReviews(data.data);
      }
    } catch (e) {
      console.error('Erro ao atualizar revisões', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Informações da Vaga e Pesos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
              <Badge variant="purple">{job.area}</Badge>
              <Badge variant="default">{job.level}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Experiência mínima recomendada: {job.minExperienceYears} ano(s)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/matching">
              <Button variant="outline" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
                Trocar Vaga
              </Button>
            </Link>
          </div>
        </div>

        {/* Pesos das Skills da Vaga (Requisito 4) */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
            Pesos Técnicos da Vaga (Soma 100%):
          </span>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 shadow-2xs"
              >
                <span>{skill.name}</span>
                <span className="text-indigo-600 font-black">{skill.weight}%</span>
              </span>
            ))}
          </div>
        </div>

        {/* Resumo Rápido de Contadores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-xs text-slate-500 font-medium">Candidatos Avaliados</span>
            <span className="block text-xl font-bold text-slate-900">{stats.total}</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
            <span className="text-xs text-emerald-800 font-medium">Alta (&gt;=80%)</span>
            <span className="block text-xl font-bold text-emerald-700">{stats.high}</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-xs text-amber-800 font-medium">Média (60-79%)</span>
            <span className="block text-xl font-bold text-amber-700">{stats.medium}</span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
            <span className="text-xs text-blue-800 font-medium">Revisões Concluídas</span>
            <span className="block text-xl font-bold text-blue-700">{stats.reviewed}</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros Combinados (Requisito 10) */}
      <MatchingFilterBar
        filters={filters}
        availableSkills={availableSkills}
        onChange={setFilters}
        onReset={handleResetFilters}
      />

      {/* Tabela de Ranking Automatizado (Requisito 9) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              Ranking de Compatibilidade ({filteredAndRanked.length} de {stats.total})
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Ordenado automaticamente do maior para o menor percentual
          </span>
        </div>

        <RankingTable results={filteredAndRanked} onReviewUpdated={handleReviewUpdated} />
      </div>
    </div>
  );
};
