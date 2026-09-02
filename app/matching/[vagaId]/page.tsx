import React from 'react';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MatchingClientView } from '@/components/matching/MatchingClientView';
import { store } from '@/lib/storage';

export const revalidate = 0;

export default async function MatchingVagaPage({
  params,
}: {
  params: Promise<{ vagaId: string }>;
}) {
  const { vagaId } = await params;
  const job = store.getJobById(vagaId);

  if (!job) {
    notFound();
  }

  const candidates = store.getCandidates();
  const reviews = store.getReviews();

  return (
    <div className="space-y-6">
      <Header
        title={`Smart Matching: ${job.title}`}
        description="Ranking ponderado de compatibilidade técnica com transparência e revisão humana"
      />

      <div className="px-6">
        <MatchingClientView
          job={job}
          initialCandidates={candidates}
          initialReviews={reviews}
        />
      </div>
    </div>
  );
}
