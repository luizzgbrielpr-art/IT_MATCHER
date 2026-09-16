import { Job, Candidate, HumanReview, AuditLog, CreateJobInput, CreateCandidateInput, CreateReviewInput, User, UpdateUserProfileInput, CURRENT_USER } from '@/types';
import { INITIAL_JOBS, INITIAL_CANDIDATES, INITIAL_REVIEWS, INITIAL_AUDIT_LOGS } from './mock-data';
import { createAuditLogEntry } from './security';

// Armazenamento em memória (Singleton padrão para Node.js / Next.js)
class InMemoryDataStore {
  private jobs: Map<string, Job> = new Map();
  private candidates: Map<string, Candidate> = new Map();
  private reviews: Map<string, HumanReview> = new Map();
  private auditLogs: AuditLog[] = [];
  private currentUser: User = { ...CURRENT_USER };

  constructor() {
    this.seed();
  }

  private seed() {
    INITIAL_JOBS.forEach((job) => this.jobs.set(job.id, { ...job }));
    INITIAL_CANDIDATES.forEach((cand) => this.candidates.set(cand.id, { ...cand }));
    INITIAL_REVIEWS.forEach((rev) => this.reviews.set(`${rev.jobId}_${rev.candidateId}`, { ...rev }));
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
  }

  // --- PERFIL DO RECRUTADOR ---
  public getUserProfile(): User {
    return { ...this.currentUser };
  }

  public updateUserProfile(input: UpdateUserProfileInput): User {
    this.currentUser = {
      ...this.currentUser,
      ...input,
    };

    this.addAuditLog(
      createAuditLogEntry(
        'REVIEW_UPDATED',
        `Perfil do recrutador "${this.currentUser.name}" atualizado com sucesso.`,
        {
          actor: {
            name: this.currentUser.name,
            role: this.currentUser.role,
          }
        }
      )
    );

    return { ...this.currentUser };
  }

  // --- VAGAS (JOBS) ---
  public getJobs(): Job[] {
    return Array.from(this.jobs.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getJobById(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  public createJob(input: CreateJobInput): Job {
    const id = `vaga-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();
    
    const newJob: Job = {
      id,
      title: input.title,
      area: input.area,
      level: input.level,
      minExperienceYears: input.minExperienceYears,
      description: input.description,
      skills: input.skills.map((s, idx) => ({
        id: `sk-${Date.now()}-${idx}`,
        name: s.name,
        weight: s.weight,
        required: s.required !== undefined ? s.required : true,
      })),
      status: 'ativa',
      createdAt: now,
      updatedAt: now,
      companyType: input.companyType,
      companyIndustry: input.companyIndustry,
      companySize: input.companySize,
      companyLocation: input.companyLocation,
      companyWebsite: input.companyWebsite,
      companyDescription: input.companyDescription,
      workModel: input.workModel,
      location: input.location,
      salaryRange: input.salaryRange,
      contractType: input.contractType,
      mandatoryRequirements: input.mandatoryRequirements,
      desirableRequirements: input.desirableRequirements,
      benefits: input.benefits,
    };

    this.jobs.set(id, newJob);

    // Registro de auditoria RG10
    const weightsMap: Record<string, number> = {};
    newJob.skills.forEach(s => weightsMap[s.name] = s.weight);

    this.addAuditLog(
      createAuditLogEntry('JOB_CREATED', `Vaga "${newJob.title}" criada com ${newJob.skills.length} competências configuradas.`, {
        jobId: newJob.id,
        jobTitle: newJob.title,
        weightsUsed: weightsMap,
      })
    );

    return newJob;
  }

  // --- CANDIDATOS (CANDIDATES) ---
  public getCandidates(): Candidate[] {
    return Array.from(this.candidates.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getCandidateById(id: string): Candidate | undefined {
    return this.candidates.get(id);
  }

  public createCandidate(input: CreateCandidateInput): Candidate {
    const id = `cand-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const newCandidate: Candidate = {
      id,
      name: input.name,
      email: input.email,
      phone: input.phone,
      experienceYears: input.experienceYears,
      technicalSkills: input.technicalSkills,
      level: input.level,
      bio: input.bio,
      resumeFileName: input.resumeFileName,
      resumeFileSize: input.resumeFileSize,
      resumeUploadedAt: input.resumeFileName ? now : undefined,
      hasResume: !!input.resumeFileName,
      createdAt: now,
      updatedAt: now,
    };

    this.candidates.set(id, newCandidate);

    // Registro de auditoria RG10
    this.addAuditLog(
      createAuditLogEntry('CANDIDATE_CREATED', `Candidato "${newCandidate.name}" cadastrado com ${newCandidate.technicalSkills.length} competências.`, {
        candidateId: newCandidate.id,
        candidateName: newCandidate.name,
      })
    );

    return newCandidate;
  }

  // --- REVISÕES HUMANAS (REVIEWS) ---
  public getReviews(): HumanReview[] {
    return Array.from(this.reviews.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  public getReviewByJobAndCandidate(jobId: string, candidateId: string): HumanReview | undefined {
    return this.reviews.get(`${jobId}_${candidateId}`);
  }

  public saveReview(input: CreateReviewInput, score: number, jobTitle: string, candidateName: string): HumanReview {
    const key = `${input.jobId}_${input.candidateId}`;
    const existing = this.reviews.get(key);
    const now = new Date().toISOString();

    const review: HumanReview = {
      id: existing ? existing.id : `rev-${Date.now().toString().slice(-4)}`,
      jobId: input.jobId,
      candidateId: input.candidateId,
      candidateName,
      jobTitle,
      score,
      status: input.status,
      reviewerName: input.reviewerName || this.currentUser.name,
      reviewerRole: 'Recrutador',
      notes: input.notes,
      technicalFeedback: input.technicalFeedback,
      reviewedAt: now,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    };

    this.reviews.set(key, review);

    // Registro de auditoria RG10
    this.addAuditLog(
      createAuditLogEntry(
        'REVIEW_UPDATED',
        `Revisão humana registrada para "${candidateName}" na vaga "${jobTitle}". Status definido como "${input.status}".`,
        {
          jobId: input.jobId,
          jobTitle,
          candidateId: input.candidateId,
          candidateName,
          score,
          previousStatus: existing ? existing.status : 'Pendente de revisão',
          newStatus: input.status,
          actor: {
            name: input.reviewerName || this.currentUser.name,
            role: 'Recrutador',
          },
        }
      )
    );

    return review;
  }

  // --- AUDITORIA (AUDIT LOGS) ---
  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addAuditLog(entry: AuditLog): void {
    this.auditLogs.unshift(entry);
    // Limite de segurança para memória
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }
}

// Global singleton para preservar estado durante hot reload em desenvolvimento
const globalForStore = globalThis as unknown as { itMatcherStore: InMemoryDataStore | undefined };

export const store = globalForStore.itMatcherStore ?? new InMemoryDataStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.itMatcherStore = store;
}
