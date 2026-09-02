import { ProfessionalLevel } from './job';

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  experienceYears: number;
  technicalSkills: string[];
  level: ProfessionalLevel;
  bio?: string;
  resumeFileName?: string;
  resumeFileSize?: number;
  resumeUploadedAt?: string;
  hasResume?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCandidateInput {
  name: string;
  email?: string;
  phone?: string;
  experienceYears: number;
  technicalSkills: string[];
  level: ProfessionalLevel;
  bio?: string;
  resumeFileName?: string;
  resumeFileSize?: number;
}
