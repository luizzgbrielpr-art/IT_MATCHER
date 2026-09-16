import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET() {
  try {
    const user = store.getUserProfile();
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao buscar perfil do recrutador' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json({
        success: false,
        error: 'Nome e E-mail são campos obrigatórios.',
      }, { status: 400 });
    }

    const updatedUser = store.updateUserProfile(body);
    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao atualizar perfil do recrutador' }, { status: 500 });
  }
}
