export type UserRole = 'Recrutador' | 'Auditor' | 'Administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  company?: string;
  department?: string;
  phone?: string;
  createdAt?: string;
}

export interface UpdateUserProfileInput {
  name: string;
  email: string;
  role?: UserRole;
  company?: string;
  department?: string;
  phone?: string;
  avatarUrl?: string;
}

export const CURRENT_USER: User = {
  id: 'usr_recruiter_01',
  name: 'Ana Paula Silva',
  email: 'ana.recrutamento@itmatcher.com.br',
  role: 'Recrutador',
  company: 'IT Matcher Talent Systems',
  department: 'Aquisição de Talentos de TI',
  phone: '(11) 98765-4321',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
  createdAt: '2026-01-15T09:00:00Z'
};
