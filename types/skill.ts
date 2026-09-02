export interface Skill {
  id: string;
  name: string;
  category?: 'frontend' | 'backend' | 'devops' | 'database' | 'mobile' | 'cloud' | 'general';
}

export interface JobSkill {
  id: string;
  name: string;
  weight: number; // Peso percentual (ex: 30 para 30%)
  required?: boolean;
}
