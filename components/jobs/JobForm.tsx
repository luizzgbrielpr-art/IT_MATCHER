'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { JobArea, ProfessionalLevel } from '@/types';
import {
  ProfessionalLevels,
  COMPANY_TYPES,
  COMPANY_INDUSTRIES,
  COMPANY_SIZES,
  WORK_MODELS,
  CONTRACT_TYPES,
} from '@/lib/validation';
import { SkillWeightConfigurator, ConfiguredSkill } from './SkillWeightConfigurator';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useToast } from '@/components/layout/Toast';
import { ShieldCheck, Briefcase, Building2, FileText } from 'lucide-react';

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

  // Dados Básicos da Vaga
  const [title, setTitle] = useState('');
  const [area, setArea] = useState<JobArea>('Frontend');
  const [level, setLevel] = useState<ProfessionalLevel>('Pleno');
  const [minExperienceYears, setMinExperienceYears] = useState<number>(3);
  const [description, setDescription] = useState('');

  // Novos Campos da Empresa / Organização
  const [companyType, setCompanyType] = useState<string>('Empresa de Tecnologia');
  const [companyIndustry, setCompanyIndustry] = useState<string>('Desenvolvimento de Software');
  const [companySize, setCompanySize] = useState<string>('51–200 funcionários');
  const [companyLocation, setCompanyLocation] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');

  // Novos Campos da Vaga
  const [workModel, setWorkModel] = useState<string>('Híbrido');
  const [location, setLocation] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [contractType, setContractType] = useState<string>('CLT');
  const [mandatoryRequirements, setMandatoryRequirements] = useState('');
  const [desirableRequirements, setDesirableRequirements] = useState('');
  const [benefits, setBenefits] = useState('');

  // Skills
  const [skills, setSkills] = useState<ConfiguredSkill[]>([
    { name: 'JavaScript', weight: 30, required: true },
    { name: 'React', weight: 25, required: true },
    { name: 'SQL', weight: 20, required: true },
    { name: 'Git', weight: 15, required: false },
    { name: 'Docker', weight: 10, required: false },
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
          companyType,
          companyIndustry,
          companySize,
          companyLocation,
          companyWebsite,
          companyDescription,
          workModel,
          location,
          salaryRange,
          contractType,
          mandatoryRequirements,
          desirableRequirements,
          benefits,
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

      {/* Dados da Empresa / Organização Contratante (ACRÉSCIMO) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Building2 className="w-5 h-5 text-indigo-600" />
          Dados da Empresa / Organização Contratante
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tipo de Organização
            </label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {COMPANY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Área de Atuação da Organização
            </label>
            <select
              value={companyIndustry}
              onChange={(e) => setCompanyIndustry(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {COMPANY_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tamanho da Empresa
            </label>
            <select
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {COMPANY_SIZES.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Localização da Empresa
            </label>
            <input
              type="text"
              placeholder="Ex: São Paulo, SP, Brasil"
              value={companyLocation}
              onChange={(e) => setCompanyLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Site da Empresa
            </label>
            <input
              type="url"
              placeholder="Ex: https://suaempresa.com.br"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição da Empresa
            </label>
            <textarea
              rows={3}
              placeholder="Breve resumo sobre a cultura, produto e segmento da organização..."
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Dados Gerais da Vaga */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <Briefcase className="w-5 h-5 text-indigo-600" />
          Informações Básicas e Condições da Posição
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Modelo de Trabalho
            </label>
            <select
              value={workModel}
              onChange={(e) => setWorkModel(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {WORK_MODELS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tipo de Contratação
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {CONTRACT_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Local da Vaga
            </label>
            <input
              type="text"
              placeholder="Ex: Rio de Janeiro, RJ (ou Remoto)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Faixa Salarial
            </label>
            <input
              type="text"
              placeholder="Ex: R$ 8.000 - R$ 12.000 ou A combinar"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
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
              Descrição Geral da Vaga *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Descreva o contexto da posição, os desafios e objetivos do projeto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requisitos Obrigatórios
            </label>
            <textarea
              rows={3}
              placeholder="Liste certificações, diplomas ou experiências prévias fundamentais..."
              value={mandatoryRequirements}
              onChange={(e) => setMandatoryRequirements(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Requisitos Desejáveis
            </label>
            <textarea
              rows={3}
              placeholder="Diferenciais que agregarão valor ao candidato..."
              value={desirableRequirements}
              onChange={(e) => setDesirableRequirements(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Benefícios Oferecidos
            </label>
            <textarea
              rows={3}
              placeholder="Ex: VR/VA, Plano de Saúde, Auxílio Home Office, PLR..."
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
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
