export type ReviewStatus = 
  | 'Pendente de revisão'
  | 'Revisado'
  | 'Aprovado para próxima etapa'
  | 'Não recomendado';

export interface HumanReview {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  jobTitle: string;
  score: number;
  status: ReviewStatus;
  reviewerName: string;
  reviewerRole: string;
  notes: string;
  technicalFeedback?: string;
  reviewedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewInput {
  jobId: string;
  candidateId: string;
  status: ReviewStatus;
  reviewerName?: string;
  notes: string;
  technicalFeedback?: string;
}
