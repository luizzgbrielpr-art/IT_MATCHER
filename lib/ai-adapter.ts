/**
 * Adaptador de Inteligência Artificial para o IT Matcher (Requisito 25)
 * 
 * Esta camada define os contratos e stubs para integração futura com
 * modelos de IA (ex: Google Gemini, OpenAI, Claude) para auxiliar na:
 * 1. Extração semântica de habilidades a partir de currículos em PDF
 * 2. Estimativa de senioridade e tempo de experiência com base no histórico
 * 3. Sugestão de sinônimos técnicos e normalização de taxonomia
 * 
 * Guardrail Obrigatório (RG03 & RG07):
 * A IA é estritamente um mecanismo auxiliar de apoio. O processamento final
 * e a decisão de contratação/eliminação pertencem sempre a um ser humano.
 */

export interface ParsedResumeAIResult {
  candidateName?: string;
  extractedSkills: string[];
  estimatedExperienceYears?: number;
  detectedLevel?: string;
  summary?: string;
  confidenceScore: number;
  modelIdentifier: string;
}

export interface AIRecruiterAssistant {
  parseResume(fileBuffer: ArrayBuffer, fileName: string): Promise<ParsedResumeAIResult>;
  suggestJobSkills(jobDescription: string): Promise<string[]>;
  compareSemanticFit(jobDescription: string, candidateBio: string): Promise<{ alignmentSummary: string; confidence: number }>;
}

export class GeminiAIAssistantStub implements AIRecruiterAssistant {
  async parseResume(_fileBuffer: ArrayBuffer, fileName: string): Promise<ParsedResumeAIResult> {
    // Simulação preparada para expansão com SDK oficial @google/genai ou similar
    return {
      candidateName: fileName.replace(/\.pdf$/i, '').replace(/curriculo_/i, '').replace(/_/g, ' '),
      extractedSkills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'SQL', 'Git'],
      estimatedExperienceYears: 3,
      detectedLevel: 'Pleno',
      summary: 'Profissional com sólida experiência em ecossistema JavaScript/TypeScript full-stack.',
      confidenceScore: 0.94,
      modelIdentifier: 'gemini-1.5-pro-preview',
    };
  }

  async suggestJobSkills(jobDescription: string): Promise<string[]> {
    const text = jobDescription.toLowerCase();
    const suggestions: string[] = [];
    if (text.includes('react') || text.includes('frontend')) suggestions.push('React', 'TypeScript', 'Next.js');
    if (text.includes('backend') || text.includes('node')) suggestions.push('Node.js', 'SQL', 'Docker');
    if (text.includes('dados') || text.includes('python')) suggestions.push('Python', 'SQL', 'Spark');
    if (text.includes('cloud') || text.includes('devops')) suggestions.push('Kubernetes', 'AWS', 'Terraform');
    return suggestions.length > 0 ? suggestions : ['JavaScript', 'Git', 'SQL'];
  }

  async compareSemanticFit(jobDescription: string, candidateBio: string): Promise<{ alignmentSummary: string; confidence: number }> {
    return {
      alignmentSummary: 'Perfil altamente compatível com o escopo técnico descrito na vaga.',
      confidence: 0.88,
    };
  }
}

export const aiAssistant: AIRecruiterAssistant = new GeminiAIAssistantStub();
