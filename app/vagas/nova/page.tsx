import React from 'react';
import { Header } from '@/components/layout/Header';
import { JobForm } from '@/components/jobs/JobForm';

export default function NovaVagaPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Cadastrar Nova Vaga de TI"
        description="Configure o cargo, senioridade, experiência e os pesos de importância das competências técnicas"
      />

      <div className="px-6 max-w-4xl mx-auto">
        <JobForm />
      </div>
    </div>
  );
}
