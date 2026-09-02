import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = store.getJobById(id);

    if (!job) {
      return NextResponse.json({ success: false, error: 'Vaga não encontrada' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar detalhes da vaga' }, { status: 500 });
  }
}
