'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProfessionalLevel } from '@/types';
import { ProfessionalLevels } from '@/lib/validation';
import { ResumeUploader } from './ResumeUploader';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useToast } from '@/components/layout/Toast';
import { User, Plus, X, ShieldCheck, Sparkles } from 'lucide-react';

const COMMON_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
  'Python', 'SQL', 'PostgreSQL', 'Git', 'Docker',
  'Kubernetes', 'AWS', 'Tailwind CSS', 'GraphQL', 'Java', 'HTML5', 'CSS3'
];

export const CandidateForm: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [level, setLevel] = useState<ProfessionalLevel>('Pleno');
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(['JavaScript', 'React', 'Git', 'SQL']);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [bio, setBio] = useState('');

  const [resumeInfo, setResumeInfo] = useState<{ fileName?: string; fileSize?: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddSkill = (skillToAdd?: string) => {
    const s = (skillToAdd || newSkillInput).trim();
    if (!s) return;
    if (technicalSkills.some((item) => item.toLowerCase() === s.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    setTechnicalSkills([...technicalSkills, s]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTechnicalSkills(technicalSkills.filter((s) => s !== skillToRemove));
  };

  const handleFileUploaded = (
    fileInfo: { fileName: string; fileSize: number },
    suggestedSkills?: string[]
  ) => {
    setResumeInfo(fileInfo);
    if (suggestedSkills && suggestedSkills.length > 0) {
      const merged = Array.from(new Set([...technicalSkills, ...suggestedSkills]));
      setTechnicalSkills(merged);
      showToast(`${suggestedSkills.length} competências extraídas do currículo!`, 'info');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (technicalSkills.length === 0) {
      setErrorMessage('Adicione ao menos uma competência técnica para o candidato.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/candidatos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          experienceYears: Number(experienceYears),
          technicalSkills,
          level,
          bio: bio.trim() || undefined,
          resumeFileName: resumeInfo.fileName,
          resumeFileSize: resumeInfo.fileSize,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao cadastrar candidato.');
      }

      showToast(`Candidato "${data.data.name}" cadastrado com sucesso!`, 'success');
      router.push('/candidatos');
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao salvar candidato.');
      showToast(err.message || 'Erro ao cadastrar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errorMessage && (
        <Alert type="error" title="Erro no Cadastro">
          {errorMessage}
        </Alert>
      )}

      <Alert type="guardrail" title="Princípio de Não-Discriminação (RG05)">
        O sistema coleta e avalia exclusivamente competências técnicas, tempo de experiência e senioridade. Nenhum dado pessoal não relacionado à vaga é utilizado.
      </Alert>

      {/* Dados Principais */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
          <User className="w-5 h-5 text-indigo-600" />
          Informações do Candidato
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Nível Profissional Atual *
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
              Tempo de Experiência (Anos) *
            </label>
            <input
              type="number"
              min="0"
              max="40"
              required
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              E-mail de Contato (Protegido por RG01)
            </label>
            <input
              type="email"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Telefone / WhatsApp (Protegido por RG01)
            </label>
            <input
              type="text"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Resumo Profissional
            </label>
            <textarea
              rows={3}
              placeholder="Breve resumo da trajetória técnica e projetos relevantes..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Upload de Currículo */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <ResumeUploader onFileUploaded={handleFileUploaded} />
      </div>

      {/* Competências Técnicas */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-900">
            Competências Técnicas do Candidato *
          </label>
          <p className="text-xs text-slate-500">
            Adicione todas as linguagens, frameworks, bancos e ferramentas dominadas pelo profissional.
          </p>
        </div>

        {/* Tags de Skills */}
        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl min-h-[60px] items-center">
          {technicalSkills.length > 0 ? (
            technicalSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400">Nenhuma competência selecionada ainda.</span>
          )}
        </div>

        {/* Input para adicionar nova skill */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Digitar competência (ex: Next.js, Docker, Java)..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddSkill()}
            disabled={!newSkillInput.trim()}
            icon={<Plus className="w-4 h-4" />}
          >
            Adicionar
          </Button>
        </div>

        {/* Sugestões rápidas */}
        <div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
            Adicionar rapidamente:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SKILLS.filter((s) => !technicalSkills.includes(s)).slice(0, 10).map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => handleAddSkill(skill)}
                className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-200 cursor-pointer"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
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
          Salvar Candidato
        </Button>
      </div>
    </form>
  );
};
