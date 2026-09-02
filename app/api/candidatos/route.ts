import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { CandidateSchema } from '@/lib/validation';
import { sanitizeAndVerifyNonDiscrimination } from '@/lib/security';

export async function GET() {
  try {
    const candidates = store.getCandidates();
    return NextResponse.json({ success: true, data: candidates });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao buscar candidatos' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // RG05 — Verificação de Não Discriminação
    const nonDiscriminationCheck = sanitizeAndVerifyNonDiscrimination(body);
    if (!nonDiscriminationCheck.clean) {
      return NextResponse.json({
        success: false,
        error: 'Guardrail de Segurança RG05 Violado: O cadastro não aceita características pessoais não técnicas.',
        forbiddenFields: nonDiscriminationCheck.forbiddenKeysFound,
      }, { status: 400 });
    }

    const parseResult = CandidateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Dados do candidato inválidos',
        issues: parseResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const createdCandidate = store.createCandidate(parseResult.data);
    return NextResponse.json({ success: true, data: createdCandidate }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao cadastrar candidato' }, { status: 500 });
  }
}
