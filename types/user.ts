export type UserRole = 'Recrutador' | 'Auditor' | 'Administrador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export const CURRENT_USER: User = {
  id: 'usr_recruiter_01',
  name: 'Ana Paula Recrutadora',
  email: 'ana.recrutamento@itmatcher.com.br',
  role: 'Recrutador'
};
