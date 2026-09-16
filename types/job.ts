import { JobSkill } from './skill';

export type ProfessionalLevel = 'Estágio' | 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista' | 'Tech Lead';

export type JobArea = 
  | 'Frontend'
  | 'Backend'
  | 'Full Stack'
  | 'DevOps / Cloud'
  | 'Data & Analytics'
  | 'Mobile'
  | 'QA / Testes'
  | 'Segurança da Informação'
  | 'Outros';

export type CompanyType =
  | 'Empresa de Tecnologia'
  | 'Startup'
  | 'Incubadora'
  | 'Aceleradora'
  | 'Agência de Tecnologia'
  | 'Consultoria de TI'
  | 'Software House'
  | 'Empresa tradicional'
  | 'Instituição de Ensino'
  | 'Órgão Público'
  | 'Organização sem fins lucrativos'
  | 'Outro';

export type CompanyIndustry =
  | 'Desenvolvimento de Software'
  | 'Dados / BI'
  | 'Cybersecurity'
  | 'Cloud'
  | 'Infraestrutura'
  | 'Suporte Técnico'
  | 'Inteligência Artificial / Machine Learning'
  | 'DevOps'
  | 'Redes'
  | 'Desenvolvimento Web'
  | 'Desenvolvimento Mobile'
  | 'Banco de Dados'
  | 'Outro';

export type CompanySize =
  | '1–10 funcionários'
  | '11–50 funcionários'
  | '51–200 funcionários'
  | '201–500 funcionários'
  | '500+ funcionários';

export type WorkModel = 'Presencial' | 'Híbrido' | 'Remoto';

export type ContractType = 'CLT' | 'PJ' | 'Estágio' | 'Terceirizado' | 'Outro';

export interface Job {
  id: string;
  title: string;
  area: JobArea | string;
  level: ProfessionalLevel;
  minExperienceYears: number;
  description: string;
  skills: JobSkill[];
  status: 'ativa' | 'pausada' | 'fechada';
  createdAt: string;
  updatedAt: string;

  // Informações da Empresa / Organização
  companyType?: CompanyType | string;
  companyIndustry?: CompanyIndustry | string;
  companySize?: CompanySize | string;
  companyLocation?: string;
  companyWebsite?: string;
  companyDescription?: string;

  // Informações Complementares da Vaga
  workModel?: WorkModel | string;
  location?: string;
  salaryRange?: string;
  contractType?: ContractType | string;
  mandatoryRequirements?: string;
  desirableRequirements?: string;
  benefits?: string;
}

export interface CreateJobInput {
  title: string;
  area: string;
  level: ProfessionalLevel;
  minExperienceYears: number;
  description: string;
  skills: { name: string; weight: number; required?: boolean }[];

  companyType?: string;
  companyIndustry?: string;
  companySize?: string;
  companyLocation?: string;
  companyWebsite?: string;
  companyDescription?: string;

  workModel?: string;
  location?: string;
  salaryRange?: string;
  contractType?: string;
  mandatoryRequirements?: string;
  desirableRequirements?: string;
  benefits?: string;
}
