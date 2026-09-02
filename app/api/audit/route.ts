import { NextResponse } from 'next/server';
import { store } from '@/lib/storage';

export async function GET() {
  try {
    const logs = store.getAuditLogs();
    return NextResponse.json({
      success: true,
      totalLogs: logs.length,
      data: logs,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro ao carregar trilha de auditoria' }, { status: 500 });
  }
}
