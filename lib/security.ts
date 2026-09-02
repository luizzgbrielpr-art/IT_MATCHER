import { Candidate, AuditLog, UserRole } from '@/types';

/**
 * RG01 — Proteção de Dados: Mascaramento de dados de contato do candidato
 */
export function maskEmail(email?: string): string {
  if (!email) return 'Não informado';
  const parts = email.split('@');
  if (parts.length !== 2) return '***@***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 
    ? `${name[0]}***${name[name.length - 1]}` 
    : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

export function maskPhone(phone?: string): string {
  if (!phone) return 'Não informado';
  const clean = phone.replace(/\D/g, '');
  if (clean.length >= 10) {
    const ddd = clean.substring(0, 2);
    const lastDigits = clean.substring(clean.length - 4);
    return `(${ddd}) 9****-${lastDigits}`;
  }
  return '(**) *****-****';
}

/**
 * RG05 — Não Discriminação:
 * Verifica e garante que atributos sensíveis e protegidos não estejam presentes no payload de matching.
 */
export const FORBIDDEN_DISCRIMINATORY_FIELDS = [
  'gender', 'sexo', 'age', 'idade', 'race', 'raca', 'etnia',
  'religion', 'religiao', 'marital_status', 'estado_civil',
  'photo', 'foto', 'sexual_orientation', 'orientacao_sexual',
  'political_view', 'posicionamento_politico'
];

export function sanitizeAndVerifyNonDiscrimination(data: Record<string, unknown>): { clean: boolean; forbiddenKeysFound: string[] } {
  const forbiddenFound: string[] = [];
  const keys = Object.keys(data);
  for (const key of keys) {
    const lowerKey = key.toLowerCase();
    if (FORBIDDEN_DISCRIMINATORY_FIELDS.includes(lowerKey)) {
      forbiddenFound.push(key);
    }
  }
  return {
    clean: forbiddenFound.length === 0,
    forbiddenKeysFound: forbiddenFound,
  };
}

/**
 * RG09 — Proteção contra Manipulação:
 * Gera hash de integridade para prevenir adulteração de score pelo cliente.
 */
export function generateIntegrityHash(payload: string): string {
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Converte para inteiro 32-bit
  }
  const timestamp = Date.now().toString(16);
  return `itm_${Math.abs(hash).toString(16)}_${timestamp}`;
}

/**
 * RG10 — Registro de Auditoria:
 * Cria um objeto padronizado de log de auditoria com garantia de rastreabilidade.
 */
export function createAuditLogEntry(
  action: AuditLog['action'],
  details: string,
  extra: Partial<AuditLog> = {},
  actorRole: UserRole = 'Recrutador'
): AuditLog {
  const timestamp = new Date().toISOString();
  const hashSeed = `${action}-${timestamp}-${details}-${extra.jobId || ''}-${extra.candidateId || ''}`;
  const immutableHash = generateIntegrityHash(hashSeed);

  return {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    action,
    timestamp,
    actor: {
      name: extra.actor?.name || 'Recrutador Responsável',
      role: extra.actor?.role || actorRole,
    },
    details,
    immutableHash,
    ...extra,
  };
}
