import { Candidate } from './candidate';
import { Job, ProfessionalLevel } from './job';

export type ClassificationType = 'ALTA' | 'MEDIA' | 'BAIXA';
export type ClassificationLabel = 
  | 'Alta compatibilidade'
  | 'Média compatibilidade'
  | 'Baixa compatibilidade';

export interface MatchingRequirement {
  skillName: string;
  weight: number;
  matched: boolean;
  status: 'encontrado' | 'não encontrado';
}

export interface MatchingResult {
  jobId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  score: number; // 0 a 100
  classification: ClassificationType;
  classificationLabel: ClassificationLabel;
  matchedSkills: MatchingRequirement[];
  missingSkills: MatchingRequirement[];
  allRequirements: MatchingRequirement[];
  calculationBreakdown: {
    skillName: string;
    weight: number;
    status: 'Encontrado' | 'Não encontrado';
    pointsAwarded: number;
  }[];
  totalFormulaExplanation: string;
  experienceComparison: {
    candidateYears: number;
    requiredYears: number;
    difference: number;
    meetsRequirement: boolean;
    note: string;
  };
  levelComparison: {
    candidateLevel: ProfessionalLevel;
    requiredLevel: ProfessionalLevel;
    meetsRequirement: boolean;
    note: string;
  };
  requiresManualReview: boolean;
  insufficientData: boolean;
  validationWarnings: string[];
  calculatedAt: string;
}

export interface MatchingFilterOptions {
  minScore?: number;
  maxScore?: number;
  classification?: ClassificationType | 'ALL';
  level?: ProfessionalLevel | 'ALL';
  minExperience?: number;
  requiredSkill?: string;
  reviewStatus?: string;
  searchTerm?: string;
}
