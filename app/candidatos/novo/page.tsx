import React from 'react';
import { Header } from '@/components/layout/Header';
import { CandidateForm } from '@/components/candidates/CandidateForm';

export default function NovoCandidatoPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Cadastrar Novo Candidato de TI"
        description="Preencha as competências técnicas, experiência profissional e realize o upload validado do currículo"
      />

      <div className="px-6 max-w-4xl mx-auto">
        <CandidateForm />
      </div>
    </div>
  );
}
