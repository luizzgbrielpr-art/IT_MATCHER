import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';
import { MatchingResult } from '@/types';

export async function GET() {
  try {
    const jobs = store.getJobs();
    const candidates = store.getCandidates();
    const reviews = store.getReviews();

    const allMatchings: MatchingResult[] = [];

    // Calcular matchings para todas as combinações ativas
    for (const job of jobs) {
      for (const candidate of candidates) {
        const result = calculateMatching(job, candidate);
        allMatchings.push(result);
      }
    }

    const highCount = allMatchings.filter(m => m.classification === 'ALTA').length;
    const mediumCount = allMatchings.filter(m => m.classification === 'MEDIA').length;
    const lowCount = allMatchings.filter(m => m.classification === 'BAIXA').length;
    const pendingReviews = allMatchings.length - reviews.length;

    return NextResponse.json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        totalCandidates: candidates.length,
        totalEvaluations: allMatchings.length,
        highCompatibilityCount: highCount,
        mediumCompatibilityCount: mediumCount,
        lowCompatibilityCount: lowCount,
        highPercentage: allMatchings.length ? Math.round((highCount / allMatchings.length) * 100) : 0,
        mediumPercentage: allMatchings.length ? Math.round((mediumCount / allMatchings.length) * 100) : 0,
        lowPercentage: allMatchings.length ? Math.round((lowCount / allMatchings.length) * 100) : 0,
        pendingReviewsCount: pendingReviews > 0 ? pendingReviews : 0,
      },
      recentRankings: rankCandidates(allMatchings).slice(0, 10),
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao calcular métricas globais de matching' }, { status: 500 });
  }
}
