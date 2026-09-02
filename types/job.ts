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
}

export interface CreateJobInput {
  title: string;
  area: string;
  level: ProfessionalLevel;
  minExperienceYears: number;
  description: string;
  skills: { name: string; weight: number }[];
}
