import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';
import { JobSchema } from '@/lib/validation';

export async function GET() {
  try {
    const jobs = store.getJobs();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Falha ao buscar vagas' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = JobSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Dados da vaga inválidos',
        issues: parseResult.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const createdJob = store.createJob(parseResult.data);
    return NextResponse.json({ success: true, data: createdJob }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao processar criação de vaga' }, { status: 500 });
  }
}
