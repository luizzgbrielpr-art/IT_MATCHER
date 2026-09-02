import React from 'react';
import { Header } from '@/components/layout/Header';
import { AuditTimeline } from '@/components/audit/AuditTimeline';
import { store } from '@/lib/storage';

export const revalidate = 0;

export default async function AuditoriaPage() {
  const logs = store.getAuditLogs();

  return (
    <div className="space-y-6">
      <Header
        title="Trilha de Auditoria & Conformidade"
        description="Histórico imutável de todas as análises de matching, uploads e revisões humanas (RG10)"
      />

      <div className="px-6">
        <AuditTimeline logs={logs} />
      </div>
    </div>
  );
}
