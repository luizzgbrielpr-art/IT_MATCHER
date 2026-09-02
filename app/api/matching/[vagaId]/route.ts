import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { calculateMatching, rankCandidates } from '@/lib/matching';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ vagaId: string }> }
) {
  try {
    const { vagaId } = await params;
    const job = store.getJobById(vagaId);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Vaga não encontrada' }, { status: 404 });
    }

    const candidates = store.getCandidates();
    const reviews = store.getReviews();

    // Calcular o matching para cada candidato em relação a esta vaga
    const matchings = candidates.map((candidate) => {
      const matchResult = calculateMatching(job, candidate);
      const existingReview = reviews.find(
        (r) => r.jobId === job.id && r.candidateId === candidate.id
      );

      return {
        ...matchResult,
        candidate,
        reviewStatus: existingReview ? existingReview.status : 'Pendente de revisão',
        reviewNotes: existingReview ? existingReview.notes : undefined,
        reviewedAt: existingReview ? existingReview.reviewedAt : undefined,
      };
    });

    const ranked = rankCandidates(matchings);

    return NextResponse.json({
      success: true,
      job,
      results: ranked,
      stats: {
        total: ranked.length,
        high: ranked.filter(r => r.classification === 'ALTA').length,
        medium: ranked.filter(r => r.classification === 'MEDIA').length,
        low: ranked.filter(r => r.classification === 'BAIXA').length,
        requiresReviewCount: ranked.filter(r => r.requiresManualReview).length,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao calcular matching da vaga' }, { status: 500 });
  }
}
