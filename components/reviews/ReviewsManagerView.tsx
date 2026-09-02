'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Job, Candidate, HumanReview, ReviewStatus, MatchingResult } from '@/types';
import { calculateMatching } from '@/lib/matching';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import { MatchingScoreBadge } from '@/components/matching/MatchingScoreBadge';
import { HumanReviewModal } from './HumanReviewModal';
import { UserCheck, Search, MessageSquare, Clock, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface ReviewsManagerViewProps {
  jobs: Job[];
  candidates: Candidate[];
  initialReviews: HumanReview[];
}

export const ReviewsManagerView: React.FC<ReviewsManagerViewProps> = ({
  jobs,
  candidates,
  initialReviews,
}) => {
  const [reviews, setReviews] = useState<HumanReview[]>(initialReviews);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('ALL');
  const [selectedReviewItem, setSelectedReviewItem] = useState<{
    matching: MatchingResult;
    review?: HumanReview;
  } | null>(null);

  // Mapear todas as combinações de vaga e candidato
  const allReviewItems = useMemo(() => {
    const list: {
      job: Job;
      candidate: Candidate;
      matching: MatchingResult;
      review?: HumanReview;
    }[] = [];

    for (const job of jobs) {
      for (const candidate of candidates) {
        const matching = calculateMatching(job, candidate);
        const review = reviews.find(
          (r) => r.jobId === job.id && r.candidateId === candidate.id
        );

        list.push({ job, candidate, matching, review });
      }
    }

    return list.sort((a, b) => {
      // Priorizar itens pendentes de revisão com alta compatibilidade
      if (!a.review && b.review) return -1;
      if (a.review && !b.review) return 1;
      return b.matching.score - a.matching.score;
    });
  }, [jobs, candidates, reviews]);

  const filteredItems = useMemo(() => {
    return allReviewItems.filter((item) => {
      const matchesSearch =
        item.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.job.title.toLowerCase().includes(searchTerm.toLowerCase());

      const currentStatus = item.review ? item.review.status : 'Pendente de revisão';
      const matchesStatus = statusFilter === 'ALL' || currentStatus === statusFilter;
      const matchesJob = selectedJobFilter === 'ALL' || item.job.id === selectedJobFilter;

      return matchesSearch && matchesStatus && matchesJob;
    });
  }, [allReviewItems, searchTerm, statusFilter, selectedJobFilter]);

  const stats = useMemo(() => {
    const total = allReviewItems.length;
    const reviewed = reviews.length;
    const approved = reviews.filter((r) => r.status === 'Aprovado para próxima etapa').length;
    const notRecommended = reviews.filter((r) => r.status === 'Não recomendado').length;
    const pending = total - reviewed;

    return { total, reviewed, approved, notRecommended, pending };
  }, [allReviewItems, reviews]);

  const handleReviewSaved = async () => {
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
      {/* Banner Ético RG03 */}
      <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed">
          <span className="font-bold block text-sm">Fila de Revisão Humana Obrigatória (RG03 & RG07)</span>
          O sistema IT Matcher auxilia no ranqueamento, mas a validação de perfil, aprovação para entrevistas ou descarte é de responsabilidade exclusiva do recrutador.
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Pendentes de Parecer</span>
          <span className="block text-2xl font-black text-amber-600">{stats.pending}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Revisões Realizadas</span>
          <span className="block text-2xl font-black text-blue-600">{stats.reviewed}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Aprovados p/ Próx. Etapa</span>
          <span className="block text-2xl font-black text-emerald-600">{stats.approved}</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 font-medium">Não Recomendados</span>
          <span className="block text-2xl font-black text-rose-600">{stats.notRecommended}</span>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por candidato ou vaga..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Todos os Status</option>
            <option value="Pendente de revisão">Pendente de revisão</option>
            <option value="Revisado">Revisado</option>
            <option value="Aprovado para próxima etapa">Aprovado para próxima etapa</option>
            <option value="Não recomendado">Não recomendado</option>
          </select>

          <select
            value={selectedJobFilter}
            onChange={(e) => setSelectedJobFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Todas as Vagas</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabela de Revisões */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="py-3.5 px-4">Candidato</th>
                  <th className="py-3.5 px-4">Vaga Avaliada</th>
                  <th className="py-3.5 px-4">Smart Matching</th>
                  <th className="py-3.5 px-4">Status da Revisão</th>
                  <th className="py-3.5 px-4">Parecer do Recrutador</th>
                  <th className="py-3.5 px-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item, idx) => {
                  const status = item.review ? item.review.status : 'Pendente de revisão';
                  return (
                    <tr key={`${item.job.id}-${item.candidate.id}-${idx}`} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4 font-bold text-slate-900 text-sm">
                        {item.candidate.name}
                        <span className="block text-[11px] font-normal text-slate-500">
                          {item.candidate.level} • {item.candidate.experienceYears} anos exp.
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {item.job.title}
                      </td>

                      <td className="py-3.5 px-4">
                        <MatchingScoreBadge
                          score={item.matching.score}
                          classification={item.matching.classification}
                          label={item.matching.classificationLabel}
                          size="sm"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <ReviewStatusBadge status={status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {item.review ? (
                          <span title={item.review.notes} className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{item.review.notes}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Nenhum parecer registrado</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<UserCheck className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedReviewItem({ matching: item.matching, review: item.review })}
                        >
                          {item.review ? 'Editar Parecer' : 'Revisar'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Revisão Humana */}
      {selectedReviewItem && (
        <HumanReviewModal
          isOpen={!!selectedReviewItem}
          onClose={() => setSelectedReviewItem(null)}
          matching={selectedReviewItem.matching}
          currentStatus={selectedReviewItem.review?.status}
          initialNotes={selectedReviewItem.review?.notes}
          onReviewSaved={() => {
            handleReviewSaved();
          }}
        />
      )}
    </div>
  );
};
