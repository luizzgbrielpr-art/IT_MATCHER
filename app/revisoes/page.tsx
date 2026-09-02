import React from 'react';
import { Header } from '@/components/layout/Header';
import { ReviewsManagerView } from '@/components/reviews/ReviewsManagerView';
import { store } from '@/lib/storage';

export const revalidate = 0;

export default async function RevisoesPage() {
  const jobs = store.getJobs();
  const candidates = store.getCandidates();
  const reviews = store.getReviews();

  return (
    <div className="space-y-6">
      <Header
        title="Painel de Revisões Humanas"
        description="Fila de acompanhamento de triagem, pareceres do recrutador e governança do processo seletivo"
      />

      <div className="px-6">
        <ReviewsManagerView
          jobs={jobs}
          candidates={candidates}
          initialReviews={reviews}
        />
      </div>
    </div>
  );
}
