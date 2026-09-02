const test = require('node:test');
const assert = require('node:assert');

// Mock data & algorithm testing in pure JS / Node test runner
function normalizeSkillName(skill) {
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

function getClassification(score) {
  if (score >= 80) {
    return { type: 'ALTA', label: 'Alta compatibilidade' };
  } else if (score >= 60) {
    return { type: 'MEDIA', label: 'Média compatibilidade' };
  } else {
    return { type: 'BAIXA', label: 'Baixa compatibilidade' };
  }
}

function calculateMatching(job, candidate) {
  let insufficientData = false;
  let requiresManualReview = false;

  if (!job.skills || job.skills.length === 0) {
    insufficientData = true;
    requiresManualReview = true;
  }

  if (!candidate.technicalSkills || candidate.technicalSkills.length === 0) {
    insufficientData = true;
    requiresManualReview = true;
  }

  const candidateSkillsNormalized = new Set(
    (candidate.technicalSkills || []).map(normalizeSkillName)
  );

  let rawScore = 0;
  let totalWeight = 0;
  const matched = [];
  const missing = [];

  (job.skills || []).forEach((jobSkill) => {
    totalWeight += jobSkill.weight;
    const isMatched = candidateSkillsNormalized.has(normalizeSkillName(jobSkill.name));
    if (isMatched) {
      matched.push(jobSkill.name);
      rawScore += jobSkill.weight;
    } else {
      missing.push(jobSkill.name);
    }
  });

  const finalScore = insufficientData ? 0 : Math.round((rawScore / totalWeight) * 100);
  const classification = getClassification(finalScore);

  return {
    score: finalScore,
    classification: classification.type,
    classificationLabel: classification.label,
    matchedSkills: matched,
    missingSkills: missing,
    requiresManualReview: requiresManualReview || insufficientData || finalScore < 60,
    insufficientData,
  };
}

test('Smart Matching — Exemplo exato do Requisito 7', () => {
  const job = {
    title: 'Vaga Teste',
    skills: [
      { name: 'JavaScript', weight: 40 },
      { name: 'React', weight: 30 },
      { name: 'SQL', weight: 20 },
      { name: 'Git', weight: 10 },
    ],
  };

  const candidate = {
    name: 'Candidato Teste',
    technicalSkills: ['JavaScript', 'React', 'Git'], // falta SQL
  };

  const result = calculateMatching(job, candidate);
  assert.strictEqual(result.score, 80);
  assert.strictEqual(result.classification, 'ALTA');
  assert.strictEqual(result.classificationLabel, 'Alta compatibilidade');
  assert.deepStrictEqual(result.matchedSkills, ['JavaScript', 'React', 'Git']);
  assert.deepStrictEqual(result.missingSkills, ['SQL']);
});

test('Classificações estritas (Requisito 8)', () => {
  assert.strictEqual(getClassification(100).label, 'Alta compatibilidade');
  assert.strictEqual(getClassification(80).label, 'Alta compatibilidade');
  assert.strictEqual(getClassification(79).label, 'Média compatibilidade');
  assert.strictEqual(getClassification(60).label, 'Média compatibilidade');
  assert.strictEqual(getClassification(59).label, 'Baixa compatibilidade');
  assert.strictEqual(getClassification(0).label, 'Baixa compatibilidade');
});

test('Guardrails RG06 & RG07: Dados insuficientes', () => {
  const job = {
    title: 'Vaga Vazia',
    skills: [],
  };
  const candidate = {
    name: 'Candidato Sem Skills',
    technicalSkills: [],
  };

  const result = calculateMatching(job, candidate);
  assert.strictEqual(result.insufficientData, true);
  assert.strictEqual(result.requiresManualReview, true);
});
