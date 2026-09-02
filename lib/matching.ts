import { Job, Candidate, MatchingResult, MatchingRequirement, ClassificationType, ClassificationLabel, ProfessionalLevel } from '@/types';

/**
 * Normaliza strings de skills para comparação justa (case-insensitive, remoção de espaços e aliases comuns)
 */
export function normalizeSkillName(skill: string): string {
  const s = skill.toLowerCase().trim();
  if (s === 'react.js' || s === 'reactjs') return 'react';
  if (s === 'nextjs' || s === 'next.js') return 'next.js';
  if (s === 'nodejs' || s === 'node.js' || s === 'node') return 'node.js';
  if (s === 'vuejs' || s === 'vue.js') return 'vue';
  if (s === 'typescript' || s === 'ts') return 'typescript';
  if (s === 'javascript' || s === 'js') return 'javascript';
  if (s === 'postgres' || s === 'postgresql') return 'postgresql';
  if (s === 'tailwind' || s === 'tailwindcss') return 'tailwind css';
  return s;
}

/**
 * Mapeamento numérico de senioridade para comparação informativa
 */
const LEVEL_WEIGHT: Record<ProfessionalLevel, number> = {
  'Estágio': 1,
  'Júnior': 2,
  'Pleno': 3,
  'Sênior': 4,
  'Especialista': 5,
  'Tech Lead': 6,
};

/**
 * Classifica a pontuação conforme as regras de negócio estritas:
 * - Alta compatibilidade: 80% a 100%
 * - Média compatibilidade: 60% a 79%
 * - Baixa compatibilidade: abaixo de 60%
 */
export function getClassification(score: number): { type: ClassificationType; label: ClassificationLabel } {
  if (score >= 80) {
    return { type: 'ALTA', label: 'Alta compatibilidade' };
  } else if (score >= 60) {
    return { type: 'MEDIA', label: 'Média compatibilidade' };
  } else {
    return { type: 'BAIXA', label: 'Baixa compatibilidade' };
  }
}

/**
 * Função pura e independente de Smart Matching (Requisito 7, 8, 11, 13, 21)
 * Aplica os guardrails RG04, RG05, RG06 e RG07.
 */
export function calculateMatching(job: Job, candidate: Candidate): MatchingResult {
  const validationWarnings: string[] = [];
  let insufficientData = false;
  let requiresManualReview = false;

  // RG06 & Requisito 13: Validação de suficiência de dados
  if (!job.skills || job.skills.length === 0) {
    insufficientData = true;
    requiresManualReview = true;
    validationWarnings.push('Vaga sem competências técnicas configuradas.');
  }

  if (!candidate.technicalSkills || candidate.technicalSkills.length === 0) {
    insufficientData = true;
    requiresManualReview = true;
    validationWarnings.push('Candidato não possui competências técnicas cadastradas.');
  }

  if (candidate.experienceYears === undefined || candidate.experienceYears === null) {
    requiresManualReview = true;
    validationWarnings.push('Experiência profissional do candidato não informada.');
  }

  // Normalizar conjunto de skills do candidato
  const candidateSkillsNormalized = new Set(
    (candidate.technicalSkills || []).map(normalizeSkillName)
  );

  const matchedSkills: MatchingRequirement[] = [];
  const missingSkills: MatchingRequirement[] = [];
  const allRequirements: MatchingRequirement[] = [];
  const calculationBreakdown: MatchingResult['calculationBreakdown'] = [];

  let rawCalculatedScore = 0;
  let totalJobWeight = 0;

  // Comparar skills da vaga com as do candidato
  (job.skills || []).forEach((jobSkill) => {
    totalJobWeight += jobSkill.weight;
    const isMatched = candidateSkillsNormalized.has(normalizeSkillName(jobSkill.name));
    
    const req: MatchingRequirement = {
      skillName: jobSkill.name,
      weight: jobSkill.weight,
      matched: isMatched,
      status: isMatched ? 'encontrado' : 'não encontrado',
    };

    allRequirements.push(req);

    if (isMatched) {
      matchedSkills.push(req);
      rawCalculatedScore += jobSkill.weight;
      calculationBreakdown.push({
        skillName: jobSkill.name,
        weight: jobSkill.weight,
        status: 'Encontrado',
        pointsAwarded: jobSkill.weight,
      });
    } else {
      missingSkills.push(req);
      calculationBreakdown.push({
        skillName: jobSkill.name,
        weight: jobSkill.weight,
        status: 'Não encontrado',
        pointsAwarded: 0,
      });
    }
  });

  // Normalização caso a soma dos pesos divirja de 100 por tolerância de arredondamento
  let finalScore = 0;
  if (totalJobWeight > 0) {
    finalScore = Math.round((rawCalculatedScore / totalJobWeight) * 100);
  }

  if (insufficientData) {
    finalScore = 0;
  }

  const { type: classification, label: classificationLabel } = getClassification(finalScore);

  // Análise transparente e informativa de experiência
  const requiredExp = job.minExperienceYears || 0;
  const candidateExp = candidate.experienceYears || 0;
  const expDiff = candidateExp - requiredExp;
  const meetsExp = candidateExp >= requiredExp;

  const experienceComparison = {
    candidateYears: candidateExp,
    requiredYears: requiredExp,
    difference: expDiff,
    meetsRequirement: meetsExp,
    note: meetsExp 
      ? `Candidato possui ${candidateExp} ano(s) de experiência (excede ou atende a exigência de ${requiredExp} ano(s)).`
      : `Candidato possui ${candidateExp} ano(s) de experiência (abaixo do requisito ideal de ${requiredExp} ano(s)).`,
  };

  // Análise transparente e informativa de nível profissional
  const candLevelVal = LEVEL_WEIGHT[candidate.level] || 0;
  const jobLevelVal = LEVEL_WEIGHT[job.level] || 0;
  const meetsLevel = candLevelVal >= jobLevelVal;

  const levelComparison = {
    candidateLevel: candidate.level,
    requiredLevel: job.level,
    meetsRequirement: meetsLevel,
    note: candLevelVal === jobLevelVal
      ? `Nível profissional exatamente alinhado (${candidate.level}).`
      : candLevelVal > jobLevelVal
      ? `Nível do candidato (${candidate.level}) é superior ao requisito da vaga (${job.level}).`
      : `Nível do candidato (${candidate.level}) está em desenvolvimento para o perfil da vaga (${job.level}).`,
  };

  // Construir a explicação transparente da fórmula (RG04)
  const breakdownParts = calculationBreakdown
    .filter((b) => b.status === 'Encontrado')
    .map((b) => `${b.skillName} (${b.pointsAwarded}%)`);
  
  const totalFormulaExplanation = breakdownParts.length > 0
    ? `${breakdownParts.join(' + ')} = ${finalScore}% (${classificationLabel})`
    : `Nenhuma competência obrigatória coincidiu = 0% (${classificationLabel})`;

  return {
    jobId: job.id,
    candidateId: candidate.id,
    candidateName: candidate.name,
    jobTitle: job.title,
    score: finalScore,
    classification,
    classificationLabel,
    matchedSkills,
    missingSkills,
    allRequirements,
    calculationBreakdown,
    totalFormulaExplanation,
    experienceComparison,
    levelComparison,
    requiresManualReview: requiresManualReview || insufficientData || finalScore < 60,
    insufficientData,
    validationWarnings,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Ordena candidatos no ranking do maior percentual para o menor (Requisito 9)
 */
export function rankCandidates<T extends { score: number }>(matchings: T[]): T[] {
  return [...matchings].sort((a, b) => b.score - a.score);
}
