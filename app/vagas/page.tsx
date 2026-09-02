import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { JobList } from '@/components/jobs/JobList';
import { Button } from '@/components/ui/Button';
import { store } from '@/lib/storage';
import { Plus, Briefcase } from 'lucide-react';

export const revalidate = 0;

export default async function VagasPage() {
  const jobs = store.getJobs();

  return (
    <div className="space-y-6">
      <Header
        title="Gestão de Vagas de TI"
        description="Cadastre posições de tecnologia, defina pesos de competências e acesse o ranking de candidatos"
      >
        <Link href="/vagas/nova">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            Nova Vaga
          </Button>
        </Link>
      </Header>

      <div className="px-6">
        <JobList jobs={jobs} />
      </div>
    </div>
  );
}
