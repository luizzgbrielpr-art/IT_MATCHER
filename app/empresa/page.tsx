'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/components/layout/Toast';
import { SkillWeightConfigurator, ConfiguredSkill } from '@/components/jobs/SkillWeightConfigurator';
import {
  ProfessionalLevels,
  COMPANY_TYPES,
  COMPANY_INDUSTRIES,
  COMPANY_SIZES,
  WORK_MODELS,
  CONTRACT_TYPES,
} from '@/lib/validation';
import { JobArea, ProfessionalLevel, Job } from '@/types';
import {
  Building2,
  Briefcase,
  Plus,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Globe,
  MapPin,
  FileText,
  Clock,
  ArrowRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function EmpresaPage() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const isCompany = user?.tipoUsuario === 'empresa' || user?.role === 'COMPANY' || user?.role === 'Empresa';

  // Estados gerais
  const [loading, setLoading] = useState(true);
  const [companyJob, setCompanyJob] = useState<Job | null>(null);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);

  // Modal / Form de Cadastro de Empresa (Visível para Recrutador)
  const [showCompanyRegisterModal, setShowCompanyRegisterModal] = useState(false);
  const [newCompName, setNewCompName] = useState('');
  const [newCompCnpj, setNewCompCnpj] = useState('');
  const [newCompEmail, setNewCompEmail] = useState('');
  const [newCompPhone, setNewCompPhone] = useState('');
  const [newCompContact, setNewCompContact] = useState('');
  const [newCompType, setNewCompType] = useState('Empresa de Tecnologia');
  const [newCompIndustry, setNewCompIndustry] = useState('Desenvolvimento de Software');
  const [newCompSize, setNewCompSize] = useState('51–200 funcionários');
  const [newCompCity, setNewCompCity] = useState('São Paulo');
  const [newCompState, setNewCompState] = useState('SP');
  const [newCompCountry, setNewCompCountry] = useState('Brasil');
  const [newCompWebsite, setNewCompWebsite] = useState('');
  const [newCompDescription, setNewCompDescription] = useState('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessInfo, setRegSuccessInfo] = useState<any | null>(null);
  const [isRegisteringComp, setIsRegisteringComp] = useState(false);

  // Modal / Form de Cadastro de Vaga da Empresa
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobArea, setJobArea] = useState<JobArea>('Full Stack');
  const [jobLevel, setJobLevel] = useState<ProfessionalLevel>('Pleno');
  const [jobMinYears, setJobMinYears] = useState<number>(3);
  const [jobWorkModel, setJobWorkModel] = useState('Híbrido');
  const [jobContractType, setJobContractType] = useState('CLT');
  const [jobLocation, setJobLocation] = useState('');
  const [jobSalaryMin, setJobSalaryMin] = useState('');
  const [jobSalaryMax, setJobSalaryMax] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobMandatory, setJobMandatory] = useState('');
  const [jobDesirable, setJobDesirable] = useState('');
  const [jobBenefits, setJobBenefits] = useState('');
  const [jobSkills, setJobSkills] = useState<ConfiguredSkill[]>([
    { name: 'JavaScript', weight: 30, required: true },
    { name: 'React', weight: 25, required: true },
    { name: 'TypeScript', weight: 20, required: true },
    { name: 'Git', weight: 10, required: false },
    { name: 'Docker', weight: 15, required: false },
  ]);
  const [jobError, setJobError] = useState<string | null>(null);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  // Carrega dados da empresa e vaga vinculada
  const fetchEmpresaData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/empresa');
      const data = await res.json();
      if (data.success) {
        setCompanyJob(data.data.job || null);
        if (data.data.allCompanies) {
          setAllCompanies(data.data.allCompanies);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresaData();
  }, [user]);

  // Handler de Cadastro de Nova Empresa pelo Recrutador (REQUISITO 3 & 4)
  const handleRegisterCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccessInfo(null);

    if (!newCompEmail.trim()) {
      setRegError('O e-mail da empresa é OBRIGATÓRIO.');
      return;
    }

    setIsRegisteringComp(true);

    try {
      const res = await fetch('/api/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCompName,
          cnpj: newCompCnpj,
          email: newCompEmail,
          phone: newCompPhone,
          contactName: newCompContact,
          companyType: newCompType,
          companyIndustry: newCompIndustry,
          companySize: newCompSize,
          city: newCompCity,
          state: newCompState,
          country: newCompCountry,
          website: newCompWebsite,
          description: newCompDescription,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Mensagem de erro caso e-mail já esteja vinculado: "Este e-mail já está vinculado a uma empresa."
        throw new Error(data.error || 'Este e-mail já está vinculado a uma empresa.');
      }

      // Informação do e-mail da empresa cadastrada (REQUISITO 4)
      setRegSuccessInfo({
        name: newCompName,
        cnpj: newCompCnpj,
        email: newCompEmail,
      });

      showToast(`Empresa "${newCompName}" cadastrada com sucesso!`, 'success');
      setShowCompanyRegisterModal(false);
      setNewCompName('');
      setNewCompCnpj('');
      setNewCompEmail('');
      setNewCompPhone('');
      setNewCompContact('');

      fetchEmpresaData();
    } catch (err: any) {
      setRegError(err.message || 'Este e-mail já está vinculado a uma empresa.');
      showToast(err.message || 'Erro ao cadastrar empresa', 'error');
    } finally {
      setIsRegisteringComp(false);
    }
  };

  // Handler de Cadastro da Vaga da Empresa (REQUISITO 6, 7 & 9)
  const handleCreateJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJobError(null);

    // REGRA DE SEGURANÇA 7: Apenas 1 vaga por empresa
    if (companyJob) {
      setJobError('Esta conta já possui uma vaga cadastrada.');
      showToast('Esta conta já possui uma vaga cadastrada.', 'warning');
      return;
    }

    // Validação de skills: Soma deve ser obrigatoriamente 100%
    const totalWeight = jobSkills.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
    if (totalWeight !== 100) {
      const msg = 'Os pesos das skills devem totalizar 100%.';
      setJobError(msg);
      showToast(msg, 'warning');
      return;
    }

    setIsSubmittingJob(true);

    try {
      const res = await fetch('/api/vagas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobTitle,
          area: jobArea,
          level: jobLevel,
          minExperienceYears: Number(jobMinYears),
          description: jobDescription,
          workModel: jobWorkModel,
          contractType: jobContractType,
          location: jobLocation,
          salaryMin: jobSalaryMin,
          salaryMax: jobSalaryMax,
          mandatoryRequirements: jobMandatory,
          desirableRequirements: jobDesirable,
          benefits: jobBenefits,
          status: 'Aguardando análise do recrutador',
          companyId: user?.companyData?.id || user?.email,
          companyName: user?.companyData?.name || user?.name,
          companyEmail: user?.companyData?.email || user?.email,
          cnpj: user?.companyData?.cnpj,
          skills: jobSkills.map((s) => ({
            name: s.name,
            weight: s.weight,
            required: s.required ?? true,
            nome: s.name,
            peso: s.weight,
            obrigatoria: s.required ?? true,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao enviar vaga');
      }

      showToast('Vaga enviada com sucesso!', 'success');
      setShowJobModal(false);
      fetchEmpresaData();
    } catch (err: any) {
      setJobError(err.message || 'Erro ao enviar vaga');
      showToast(err.message || 'Erro ao enviar vaga', 'error');
    } finally {
      setIsSubmittingJob(false);
    }
  };

  const companyName = user?.companyData?.name || user?.company || user?.name || 'Tech Solutions';
  const companyEmail = user?.companyData?.email || user?.email || 'empresa@techsolutions.com.br';
  const companyCnpj = user?.companyData?.cnpj || '00.000.000/0001-00';
  const companyType = user?.companyData?.companyType || 'Empresa de Tecnologia';
  const companyIndustry = user?.companyData?.companyIndustry || 'Desenvolvimento de Software';

  return (
    <div className="space-y-6">
      <Header
        title={isCompany ? '🏢 Área da Empresa' : '🏢 Gestão da Área da Empresa'}
        description={
          isCompany
            ? `Bem-vindo, ${companyName}! • E-mail: ${companyEmail}`
            : 'Módulo de cadastro de empresas contratantes e gestão de vagas vinculadas'
        }
      >
        <div className="flex items-center gap-2">
          {!isCompany && (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => {
                setRegError(null);
                setRegSuccessInfo(null);
                setShowCompanyRegisterModal(true);
              }}
            >
              Cadastrar Nova Empresa
            </Button>
          )}
          {isCompany && (
            <Button variant="outline" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
              Sair da Conta
            </Button>
          )}
        </div>
      </Header>

      <div className="px-6 space-y-6 max-w-6xl mx-auto">
        {/* Confirmação de Cadastro para o Recrutador (REQUISITO 4) */}
        {regSuccessInfo && (
          <Alert type="success" title="Empresa Cadastrada com Sucesso!">
            <div className="space-y-1 text-xs">
              <p><strong>Empresa:</strong> {regSuccessInfo.name}</p>
              {regSuccessInfo.cnpj && <p><strong>CNPJ:</strong> {regSuccessInfo.cnpj}</p>}
              <p>
                <strong>E-mail de acesso da empresa:</strong>{' '}
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  {regSuccessInfo.email}
                </span>
              </p>
              <p className="text-[11px] text-emerald-700 pt-1">
                Este e-mail está vinculado exclusivamente a esta conta da empresa para acesso direto ao sistema.
              </p>
            </div>
          </Alert>
        )}

        {/* VISÃO DA CONTA DO TIPO EMPRESA (REQUISITO 4 & 6) */}
        {isCompany && (
          <>
            {/* Card de Identificação da Empresa */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    {companyName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    E-mail oficial da conta: <strong className="text-slate-800">{companyEmail}</strong>
                  </p>
                </div>
                <Badge variant="success">Status da conta: Ativa</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-0.5">CNPJ</span>
                  <span className="font-mono text-slate-800 font-semibold">{companyCnpj}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-0.5">Tipo de Organização</span>
                  <span className="text-slate-800 font-medium">{companyType}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase block mb-0.5">Área de Atuação</span>
                  <span className="text-slate-800 font-medium">{companyIndustry}</span>
                </div>
              </div>
            </div>

            {/* Seção MINHA VAGA (REQUISITO 6, 7 & 9) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    MINHA VAGA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cada conta do tipo Empresa pode cadastrar e gerenciar no máximo 1 vaga.
                  </p>
                </div>

                {/* Botão + Cadastrar Nova Vaga (Aparece SOMENTE se NÃO houver vaga cadastrada - REQUISITO 7) */}
                {!companyJob ? (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                      setJobError(null);
                      setShowJobModal(true);
                    }}
                  >
                    + Cadastrar Nova Vaga
                  </Button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Vaga Cadastrada
                  </span>
                )}
              </div>

              {/* Caso NENHUMA VAGA cadastrada ainda */}
              {!companyJob ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Você ainda não possui uma vaga cadastrada.</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto pt-1">
                      Clique no botão acima para cadastrar a posição de TI da sua empresa e enviá-la para análise do recrutador.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => {
                      setJobError(null);
                      setShowJobModal(true);
                    }}
                  >
                    + Cadastrar Nova Vaga
                  </Button>
                </div>
              ) : (
                /* Caso JÁ POSSUA UMA VAGA CADASTRADA (REQUISITO 7 & 9) */
                <div className="space-y-4">
                  <Alert type="info" title="Você já possui uma vaga cadastrada.">
                    Sua conta atingiu o limite de 1 vaga cadastrada. Acompanhe abaixo o status e os critérios da vaga enviada.
                  </Alert>

                  <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h4 className="font-black text-slate-900 text-base">{companyJob.title}</h4>
                        <span className="text-xs text-slate-500">
                          Enviada em: {new Date(companyJob.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <Badge variant="warning">
                        {companyJob.status || 'Aguardando análise do recrutador'}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-600">
                      <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Área: {companyJob.area}</span>
                      <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Nível: {companyJob.level}</span>
                      {companyJob.workModel && <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Modelo: {companyJob.workModel}</span>}
                      {companyJob.contractType && <span className="bg-white px-2.5 py-1 rounded-md border border-slate-200">Contrato: {companyJob.contractType}</span>}
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                      {companyJob.description}
                    </p>

                    <div className="pt-2 border-t border-slate-200/80">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                        Skills e Pesos Configurados ({companyJob.skills.length}):
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {companyJob.skills.map((sk) => (
                          <span key={sk.id || sk.name} className="text-xs bg-white text-slate-800 font-bold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                            {sk.name} <span className="text-blue-600">({sk.weight}%)</span>
                            {sk.required && <span className="text-[9px] bg-blue-50 text-blue-700 px-1 rounded">Obg</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* VISÃO DA CONTA DO RECRUTADOR (REQUISITO 2 & 12) */}
        {!isCompany && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Empresas Cadastradas ({allCompanies.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    O Recrutador possui controle total e visualização de todas as empresas e suas vagas.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setRegError(null);
                    setRegSuccessInfo(null);
                    setShowCompanyRegisterModal(true);
                  }}
                >
                  Cadastrar Nova Empresa
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allCompanies.map((comp) => {
                  const compData = comp.companyData || comp;
                  const linkedJob = comp.email ? companyJob : null;

                  return (
                    <div key={comp.id || comp.email} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          {compData.name || comp.name}
                        </h4>
                        <Badge variant="info">{compData.companyType || 'Tecnologia'}</Badge>
                      </div>

                      <div className="text-xs space-y-1 text-slate-600">
                        {compData.cnpj && <p><strong>CNPJ:</strong> {compData.cnpj}</p>}
                        <p><strong>E-mail de acesso:</strong> <span className="font-mono font-semibold text-blue-700">{compData.email}</span></p>
                        {compData.phone && <p><strong>Telefone:</strong> {compData.phone}</p>}
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Vaga vinculada:</span>
                        {linkedJob ? (
                          <span className="font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> {linkedJob.title}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">Nenhuma vaga cadastrada ainda</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE CADASTRO DE EMPRESA PELO RECRUTADOR (REQUISITO 3) */}
      {showCompanyRegisterModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Cadastrar Nova Empresa Contratante
              </h3>
              <button
                type="button"
                onClick={() => setShowCompanyRegisterModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {regError && (
              <Alert type="error" title="Erro no Cadastro">
                {regError}
              </Alert>
            )}

            <form onSubmit={handleRegisterCompanySubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome da Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Tech Solutions Ltda"
                    value={newCompName}
                    onChange={(e) => setNewCompName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CNPJ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 00.000.000/0001-00"
                    value={newCompCnpj}
                    onChange={(e) => setNewCompCnpj(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    E-mail da Empresa (Acesso Único) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: empresa@techsolutions.com.br"
                    value={newCompEmail}
                    onChange={(e) => setNewCompEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: (41) 99999-9999"
                    value={newCompPhone}
                    onChange={(e) => setNewCompPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nome do Responsável
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Carlos Eduardo (Gerente RH)"
                    value={newCompContact}
                    onChange={(e) => setNewCompContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Organização
                  </label>
                  <select
                    value={newCompType}
                    onChange={(e) => setNewCompType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {COMPANY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Área de Atuação
                  </label>
                  <select
                    value={newCompIndustry}
                    onChange={(e) => setNewCompIndustry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {COMPANY_INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCompanyRegisterModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isRegisteringComp}
                >
                  Cadastrar Empresa
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CADASTRO DE VAGA DA EMPRESA (REQUISITO 6, 7 & 8) */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-3xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Cadastrar Vaga da Empresa ({companyName})
              </h3>
              <button
                type="button"
                onClick={() => setShowJobModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {jobError && (
              <Alert type="error" title="Validação de Vaga">
                {jobError}
              </Alert>
            )}

            <form onSubmit={handleCreateJobSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Título da Vaga *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Desenvolvedor Full Stack"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Área da Vaga *
                  </label>
                  <select
                    value={jobArea}
                    onChange={(e) => setJobArea(e.target.value as JobArea)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="DevOps / Cloud">DevOps / Cloud</option>
                    <option value="Data & Analytics">Data & Analytics</option>
                    <option value="Mobile">Mobile</option>
                    <option value="QA / Testes">QA / Testes</option>
                    <option value="Segurança da Informação">Segurança da Informação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nível da Vaga *
                  </label>
                  <select
                    value={jobLevel}
                    onChange={(e) => setJobLevel(e.target.value as ProfessionalLevel)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="Júnior">Júnior</option>
                    <option value="Pleno">Pleno</option>
                    <option value="Sênior">Sênior</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Modelo de Trabalho *
                  </label>
                  <select
                    value={jobWorkModel}
                    onChange={(e) => setJobWorkModel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {WORK_MODELS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Contratação *
                  </label>
                  <select
                    value={jobContractType}
                    onChange={(e) => setJobContractType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    {CONTRACT_TYPES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Local da Vaga
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo, SP (ou Remoto)"
                    value={jobLocation}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Salário Mínimo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 7.000"
                      value={jobSalaryMin}
                      onChange={(e) => setJobSalaryMin(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Salário Máximo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: R$ 10.000"
                      value={jobSalaryMax}
                      onChange={(e) => setJobSalaryMax(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Descrição da Vaga *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Descreva as responsabilidades e desafios do cargo..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requisitos Obrigatórios
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Conhecimentos e graduações indispensáveis..."
                    value={jobMandatory}
                    onChange={(e) => setJobMandatory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Requisitos Desejáveis
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Diferenciais bem-vindos..."
                    value={jobDesirable}
                    onChange={(e) => setJobDesirable(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Benefícios
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: VR, VA, Plano de Saúde, PLR..."
                    value={jobBenefits}
                    onChange={(e) => setJobBenefits(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>

              {/* Seção Skills e Pesos (REQUISITO 7) */}
              <div className="pt-2 border-t border-slate-200">
                <SkillWeightConfigurator skills={jobSkills} onChange={setJobSkills} />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJobModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmittingJob}
                  icon={<ShieldCheck className="w-4 h-4" />}
                >
                  Enviar vaga
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
