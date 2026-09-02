import { ClassificationType } from './matching';
import { ReviewStatus } from './review';

export interface AuditLog {
  id: string;
  action: 'MATCHING_CALCULATED' | 'REVIEW_UPDATED' | 'RESUME_UPLOADED' | 'JOB_CREATED' | 'CANDIDATE_CREATED';
  timestamp: string;
  jobId?: string;
  jobTitle?: string;
  candidateId?: string;
  candidateName?: string;
  score?: number;
  classification?: ClassificationType;
  matchedSkills?: string[];
  missingSkills?: string[];
  weightsUsed?: Record<string, number>;
  previousStatus?: ReviewStatus | string;
  newStatus?: ReviewStatus | string;
  actor: {
    name: string;
    role: 'Recrutador' | 'Auditor' | 'Administrador' | 'Sistema';
  };
  details: string;
  immutableHash: string; // Garantia de integridade do registro
}
