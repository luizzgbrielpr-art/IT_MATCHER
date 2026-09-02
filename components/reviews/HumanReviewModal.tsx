'use client';

import React, { useState } from 'react';
import { MatchingResult, ReviewStatus } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { MatchingScoreBadge } from '@/components/matching/MatchingScoreBadge';
import { useToast } from '@/components/layout/Toast';
import { UserCheck, ShieldAlert, CheckCircle2, MessageSquare, Award } from 'lucide-react';

interface HumanReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  matching: MatchingResult;
  currentStatus?: ReviewStatus | string;
  initialNotes?: string;
  onReviewSaved: (updatedReview: any) => void;
}

const REVIEW_OPTIONS: { value: ReviewStatus; label: string; desc: string; color: string }[] = [
  {
    value: 'Aprovado para próxima etapa',
    label: 'Aprovado para próxima etapa',
    desc: 'Candidato cumpre os requisitos e avança para entrevistas técnicas / com gestor.',
    color: 'border-emerald-500 bg-emerald-50/50 text-emerald-950',
  },
  {
    value: 'Revisado',
    label: 'Revisado (Em Observação)',
    desc: 'Triagem efetuada pelo recrutador. Manter no banco para decisão posterior.',
    color: 'border-blue-500 bg-blue-50/50 text-blue-950',
  },
  {
    value: 'Pendente de revisão',
    label: 'Pendente de revisão',
    desc: 'Ainda aguarda análise aprofundada dos critérios técnicos ou documentais.',
    color: 'border-amber-500 bg-amber-50/50 text-amber-950',
  },
  {
    value: 'Não recomendado',
    label: 'Não recomendado para esta vaga',
    desc: 'Perfil técnico não alinhado com o escopo atual (Não elimina de outras vagas).',
    color: 'border-rose-500 bg-rose-50/50 text-rose-950',
  },
];

export const HumanReviewModal: React.FC<HumanReviewModalProps> = ({
  isOpen,
  onClose,
  matching,
  currentStatus = 'Pendente de revisão',
  initialNotes = '',
  onReviewSaved,
}) => {
  const { showToast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<ReviewStatus>(
    (currentStatus as ReviewStatus) || 'Aprovado para próxima etapa'
  );
  const [notes, setNotes] = useState(initialNotes);
  const [technicalFeedback, setTechnicalFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (notes.trim().length < 5) {
      setError('A justificativa do recrutador deve ter no mínimo 5 caracteres.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: matching.jobId,
          candidateId: matching.candidateId,
          status: selectedStatus,
          notes: notes.trim(),
          technicalFeedback: technicalFeedback.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao registrar revisão.');
      }

      showToast(`Revisão registrada: "${selectedStatus}"`, 'success');
      onReviewSaved(data.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro na comunicação com o servidor.');
      showToast(err.message || 'Erro ao salvar revisão', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Revisão Humana de Candidato"
      subtitle={`Avaliação para a vaga "${matching.jobTitle}"`}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert type="error" title="Atenção">
            {error}
          </Alert>
        )}

        {/* Guardrail RG03 Mandatório */}
        <Alert type="guardrail" title="Guardrail RG03 — Decisão Estritamente Humana">
          Estes status servem exclusivamente para o acompanhamento do fluxo de recrutamento. O sistema de Smart Matching é uma ferramenta de apoio e <strong>NUNCA contrata ou elimina candidatos de forma automatizada</strong>.
        </Alert>

        {/* Resumo do Candidato e Score */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900">{matching.candidateName}</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Experiência: {matching.experienceComparison.candidateYears} ano(s) • Nível: {matching.levelComparison.candidateLevel}
            </p>
          </div>

          <div>
            <MatchingScoreBadge
              score={matching.score}
              classification={matching.classification}
              label={matching.classificationLabel}
              size="md"
            />
          </div>
        </div>

        {/* Seleção do Status de Revisão */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Status da Triagem Humana *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REVIEW_OPTIONS.map((opt) => {
              const isSelected = selectedStatus === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? opt.color
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{opt.label}</span>
                    <input
                      type="radio"
                      name="reviewStatus"
                      checked={isSelected}
                      onChange={() => setSelectedStatus(opt.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] opacity-80 leading-snug">{opt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Justificativa do Recrutador */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Justificativa e Anotações da Revisão *
          </label>
          <textarea
            rows={3}
            required
            placeholder="Descreva as impressões técnicas, alinhamento de senioridade ou pontos observados no currículo..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <span className="text-[11px] text-slate-400">
            Este parecer é registrado na trilha de auditoria para fins de governança (RG10).
          </span>
        </div>

        {/* Feedback Técnico Opcional */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Recomendações para a Entrevista Técnica (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ex: Aprofundar perguntas em Next.js App Router e Server Actions."
            value={technicalFeedback}
            onChange={(e) => setTechnicalFeedback(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={<UserCheck className="w-4 h-4" />}
          >
            Confirmar e Registrar Revisão
          </Button>
        </div>
      </form>
    </Modal>
  );
};
