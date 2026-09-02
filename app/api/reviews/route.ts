import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { HumanReviewSchema } from '@/lib/validation';

export async function GET() {
  try {
    const reviews = store.getReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar revisões' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = HumanReviewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Dados da revisão humana inválidos',
        issues: parseResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const { jobId, candidateId, status, notes, technicalFeedback, reviewerName } = parseResult.data;

    const job = store.getJobById(jobId);
    const candidate = store.getCandidateById(candidateId);

    if (!job || !candidate) {
      return NextResponse.json({
        success: false,
        error: 'Vaga ou candidato não encontrado para associação da revisão',
      }, { status: 404 });
    }

    // Obter score atual para registro
    const review = store.saveReview(
      {
        jobId,
        candidateId,
        status,
        notes,
        technicalFeedback,
        reviewerName: reviewerName || 'Recrutador Responsável',
      },
      0, // ou score calculado
      job.title,
      candidate.name
    );

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao salvar revisão humana' }, { status: 500 });
  }
}
