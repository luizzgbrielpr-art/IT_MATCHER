'use client';

import React from 'react';
import { MatchingResult } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { MatchingScoreBadge } from './MatchingScoreBadge';
import { ReviewStatusBadge } from '@/components/reviews/ReviewStatusBadge';
import { Button } from '@/components/ui/Button';
import { Check, X, Info, ShieldCheck, AlertTriangle, UserCheck, Briefcase } from 'lucide-react';

interface MatchingBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  matching: MatchingResult | null;
  onOpenReview?: (matching: MatchingResult) => void;
}

export const MatchingBreakdownModal: React.FC<MatchingBreakdownModalProps> = ({
  isOpen,
  onClose,
  matching,
  onOpenReview,
}) => {
  if (!matching) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transparência e Detalhamento do Smart Matching"
      subtitle={`Candidato: ${matching.candidateName} • Vaga: ${matching.jobTitle}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Painel de Pontuação e Status */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold tracking-wider text-indigo-300 uppercase">
              Resultado do Algoritmo Técnico (RG04)
            </span>
            <h3 className="text-2xl font-black">{matching.candidateName}</h3>
            <p className="text-xs text-slate-300">
              Vaga analisada: <span className="font-semibold text-white">{matching.jobTitle}</span>
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <MatchingScoreBadge
              score={matching.score}
              classification={matching.classification}
              label={matching.classificationLabel}
              size="lg"
            />
            <span className="text-[11px] text-slate-300">
              Calculado em: {new Date(matching.calculatedAt).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>

        {/* Alerta de Suficiência de Dados (RG06/RG07) */}
        {matching.insufficientData ? (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Informações insuficientes para calcular o matching com precisão.</p>
              <p className="text-xs mt-1 text-amber-800">
                O candidato foi encaminhado para revisão manual obrigatória devido à ausência de competências técnicas cadastradas.
              </p>
            </div>
          </div>
        ) : null}

        {/* Seção Obrigatória: "Como o percentual foi calculado" (Requisito 11 e RG04) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Info className="w-5 h-5 text-indigo-600" />
            <h4 className="text-base font-bold text-slate-900">Como o percentual foi calculado</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-2.5 px-3">Competência Exigida</th>
                  <th className="py-2.5 px-3 text-center">Peso na Vaga</th>
                  <th className="py-2.5 px-3 text-center">Status no Candidato</th>
                  <th className="py-2.5 px-3 text-right">Pontos Obtidos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {matching.calculationBreakdown.map((item, idx) => {
                  const isFound = item.status === 'Encontrado';
                  return (
                    <tr key={idx} className={isFound ? 'bg-emerald-50/30' : 'bg-rose-50/20'}>
                      <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-2">
                        {isFound ? (
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <X className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span>{item.skillName}</span>
                      </td>

                      <td className="py-3 px-3 text-center font-bold text-slate-700">
                        {item.weight}%
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full font-semibold text-[11px] ${
                            isFound
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                        +{item.pointsAwarded}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-300 font-bold bg-slate-50 text-slate-900 text-sm">
                  <td colSpan={3} className="py-3 px-3 text-right">
                    Total Final de Compatibilidade:
                  </td>
                  <td className="py-3 px-3 text-right text-indigo-700 font-black text-base">
                    {matching.score}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Fórmula e Soma Explícita */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block mb-1">Demonstração Aritmética da Fórmula:</span>
            <code className="text-indigo-800 font-mono text-xs block bg-white p-2 rounded border border-slate-200">
              {matching.totalFormulaExplanation}
            </code>
          </div>
        </div>

        {/* Comparativo de Critérios Complementares */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Experiência Profissional
            </h5>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Exigido pela vaga:</span>
              <span className="font-bold text-slate-800 text-sm">
                {matching.experienceComparison.requiredYears} ano(s)
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Candidato possui:</span>
              <span className="font-bold text-slate-800 text-sm">
                {matching.experienceComparison.candidateYears} ano(s)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              {matching.experienceComparison.note}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Nível de Senioridade
            </h5>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Perfil da vaga:</span>
              <span className="font-bold text-slate-800 text-sm">
                {matching.levelComparison.requiredLevel}
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Nível do candidato:</span>
              <span className="font-bold text-slate-800 text-sm">
                {matching.levelComparison.candidateLevel}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
              {matching.levelComparison.note}
            </p>
          </div>
        </div>

        {/* Rodapé com Ações de Decisão Humana */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Auditado conforme Guardrail RG10</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1 sm:flex-initial">
              Fechar
            </Button>
            {onOpenReview && (
              <Button
                variant="primary"
                size="sm"
                icon={<UserCheck className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  onOpenReview(matching);
                }}
                className="flex-1 sm:flex-initial"
              >
                Efetuar Revisão Humana
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
