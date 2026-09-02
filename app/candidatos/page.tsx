import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { CandidateList } from '@/components/candidates/CandidateList';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/storage';
import { Plus } from 'lucide-react';

export const revalidate = 0;

export default async function CandidatosPage() {
  const candidates = store.getCandidates();

  return (
    <div className="space-y-6">
      <Header
        title="Banco de Candidatos de TI"
        description="Gestão de profissionais, competências técnicas e currículos com proteção de dados (RG01)"
      >
        <Link href="/candidatos/novo">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Novo Candidato
          </Button>
        </Link>
      </Header>

      <div className="px-6">
        <CandidateList candidates={candidates} />
      </div>
    </div>
  );
}
