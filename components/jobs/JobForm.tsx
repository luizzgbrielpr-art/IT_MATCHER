'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobArea, ProfessionalLevel } from '@/types';
import { ProfessionalLevels } from '@/lib/validation';
import { SkillWeightConfigurator, ConfiguredSkill } from './SkillWeightConfigurator';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useToast } from '@/components/layout/Toast';
import { ShieldCheck, Briefcase } from 'lucide-react';

const JOB_AREAS: JobArea[] = [
  'Frontend',
  'Backend',
  'Full Stack',
  'DevOps / Cloud',
  'Data & Analytics',
  'Mobile',
  'QA / Testes',
  'Segurança da Informação',
  'Outros',
];

export const JobForm: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [area, setArea] = useState<JobArea>('Frontend');
  const [level, setLevel] = useState<ProfessionalLevel>('Pleno');
  const [minExperienceYears, setMinExperienceYears] = useState<number>(3);
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<ConfiguredSkill[]>([
    { name: 'JavaScript', weight: 30 },
    { name: 'React', weight: 25 },
    { name: 'SQL', weight: 20 },
    { name: 'Git', weight: 15 },
    { name: 'Docker', weight: 10 },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const totalWeight = skills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    if (totalWeight !== 100) {
      setErrorMessage(`A soma dos pesos das competências está em ${totalWeight}%. Ela deve ser exatamente 100%.`);
      showToast('Ajuste os pesos para totalizar 100%', 'warning');
      return;
    }

    if (skills.length === 0) {
      setErrorMessage('Adicione ao menos uma competência técnica para a vaga.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          area,
          level,
          minExperienceYears: Number(minExperienceYears),
          description,
          skills,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao cadastrar vaga');
      }

      showToast(`Vaga "${data.data.title}" cadastrada com sucesso!`, 'success');
      router.push(`/vagas/${data.data.id}`);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha na comunicação com o servidor.');
      showToast(err.message || 'Erro ao cadastrar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert type="error" title="Erro de Validação">
          {errorMessage}
        </Alert>
      )}

      <Alert type="guardrail" title="Critérios Técnicos Transparentes (RG04 & RG05)">
        A compatibilidade dos candidatos será calculada exclusivamente com base nas competências e pesos definidos abaixo.
      </Alert>

      {/* Dados Gerais da Vaga */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Informações Básicas da Posição
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome da Vaga *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Desenvolvedor Full Stack Sênior"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Área de Atuação *
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value as JobArea)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {JOB_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nível Profissional Desejado *
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as ProfessionalLevel)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {ProfessionalLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Experiência Mínima Necessária (Anos) *
            </label>
            <input
              type="number"
              min="0"
              max="30"
              required
              value={minExperienceYears}
              onChange={(e) => setMinExperienceYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição da Vaga e Responsabilidades *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Descreva as responsabilidades, contexto da equipe e expectativas da posição..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Configurador de Competências e Pesos */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <SkillWeightConfigurator skills={skills} onChange={setSkills} />
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          icon={<ShieldCheck className="w-4 h-4" />}
        >
          Publicar e Ativar Matching
        </Button>
      </div>
    </form>
  );
};
