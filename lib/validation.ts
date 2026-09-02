import { z } from 'zod';
import { ProfessionalLevel } from '@/types';

export const ProfessionalLevels: [ProfessionalLevel, ...ProfessionalLevel[]] = [
  'Estágio',
  'Júnior',
  'Pleno',
  'Sênior',
  'Especialista',
  'Tech Lead',
];

export const JobSkillSchema = z.object({
  name: z.string().min(1, 'Nome da competência é obrigatório').trim(),
  weight: z.number().min(1, 'O peso deve ser maior que 0%').max(100, 'O peso não pode exceder 100%'),
  required: z.boolean().optional().default(true),
});

export const JobSchema = z.object({
  title: z.string().min(3, 'O título da vaga deve ter no mínimo 3 caracteres').trim(),
  area: z.string().min(2, 'Selecione uma área de atuação').trim(),
  level: z.enum(ProfessionalLevels, { errorMap: () => ({ message: 'Nível profissional inválido' }) }),
  minExperienceYears: z.number().min(0, 'A experiência mínima não pode ser negativa'),
  description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres').trim(),
  skills: z.array(JobSkillSchema).min(1, 'A vaga deve conter pelo menos uma competência técnica'),
}).refine((data) => {
  const totalWeight = data.skills.reduce((acc, curr) => acc + curr.weight, 0);
  return totalWeight === 100;
}, {
  message: 'A soma dos pesos das competências deve ser exatamente 100%',
  path: ['skills'],
});

export const CandidateSchema = z.object({
  name: z.string().min(2, 'O nome do candidato deve ter no mínimo 2 caracteres').trim(),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  experienceYears: z.number().min(0, 'Anos de experiência não podem ser negativos'),
  technicalSkills: z.array(z.string().min(1)).min(1, 'Adicione ao menos uma competência técnica'),
  level: z.enum(ProfessionalLevels, { errorMap: () => ({ message: 'Nível profissional inválido' }) }),
  bio: z.string().optional(),
  resumeFileName: z.string().optional(),
  resumeFileSize: z.number().optional(),
});

export const HumanReviewSchema = z.object({
  jobId: z.string().min(1, 'ID da vaga é obrigatório'),
  candidateId: z.string().min(1, 'ID do candidato é obrigatório'),
  status: z.enum([
    'Pendente de revisão',
    'Revisado',
    'Aprovado para próxima etapa',
    'Não recomendado'
  ]),
  notes: z.string().min(5, 'A justificativa do recrutador deve ter no mínimo 5 caracteres'),
  technicalFeedback: z.string().optional(),
  reviewerName: z.string().optional(),
});

/**
 * Validação rigorosa de arquivo de currículo PDF (RG08)
 */
export const MAX_RESUME_FILE_SIZE = 5 * 1024 * 1024; // 5 Megabytes
export const ALLOWED_MIME_TYPES = ['application/pdf'];

export function validateResumeFile(file: { name: string; size: number; type: string }): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo fornecido.' };
  }

  // Validar extensão
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.pdf')) {
    return { valid: false, error: 'Apenas arquivos com extensão .pdf são permitidos.' };
  }

  // Validar tipo MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type) && file.type !== '') {
    return { valid: false, error: 'Tipo MIME inválido. Envie um arquivo PDF genuíno.' };
  }

  // Validar tamanho
  if (file.size > MAX_RESUME_FILE_SIZE) {
    return { valid: false, error: 'O tamanho do arquivo excede o limite máximo permitido de 5MB.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'O arquivo enviado está vazio.' };
  }

  return { valid: true };
}
