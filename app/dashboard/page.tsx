import React from 'react';
import { Header } from '@/components/layout/Header';
import { DashboardClientView } from '@/components/dashboard/DashboardClientView';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';

export const revalidate = 0; // Dynamic server component

export default async function DashboardPage() {
  const jobs = store.getJobs();
  const candidates = store.getCandidates();
  const reviews = store.getReviews();

  const allMatchings = [];
  for (const job of jobs) {
    for (const candidate of candidates) {
      allMatchings.push(calculateMatching(job, candidate));
    }
  }

  const highCount = allMatchings.filter((m) => m.classification === 'ALTA').length;
  const mediumCount = allMatchings.filter((m) => m.classification === 'MEDIA').length;
  const lowCount = allMatchings.filter((m) => m.classification === 'BAIXA').length;
  const pendingReviewsCount = allMatchings.length - reviews.length;
  const rankedRecent = rankCandidates(allMatchings).slice(0, 8);

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard de Smart Matching"
        description="Visão limpa e organizada da triagem técnica de candidatos e métricas de recrutamento"
      />

      <div className="px-6">
        <DashboardClientView
          jobs={jobs}
          candidates={candidates}
          reviews={reviews}
          allMatchings={allMatchings}
          rankedRecent={rankedRecent}
          highCount={highCount}
          mediumCount={mediumCount}
          lowCount={lowCount}
          pendingReviewsCount={pendingReviewsCount}
        />
      </div>
    </div>
  );
}
