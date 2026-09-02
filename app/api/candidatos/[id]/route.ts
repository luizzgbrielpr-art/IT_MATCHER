import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = store.getCandidateById(id);

    if (!candidate) {
      return NextResponse.json({ success: false, error: 'Candidato não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: candidate });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar dados do candidato' }, { status: 500 });
  }
}
