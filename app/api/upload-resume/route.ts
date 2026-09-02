import { NextRequest, NextResponse } from 'next/server';
import { validateResumeFile } from '@/lib/validation';
import { aiAssistant } from '@/lib/ai-adapter';
import { store } from '@/lib/storage';
import { createAuditLogEntry } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    // RG08 — Validação rigorosa de arquivo
    const validation = validateResumeFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: `Upload rejeitado (Guardrail RG08): ${validation.error}`,
      }, { status: 400 });
    }

    // Processamento seguro do buffer (sem execução de binários)
    const arrayBuffer = await file.arrayBuffer();

    // Simulação / Preparação para IA (Requisito 6 e 25)
    const aiExtraction = await aiAssistant.parseResume(arrayBuffer, file.name);

    // Registro de auditoria RG10
    store.addAuditLog(
      createAuditLogEntry(
        'RESUME_UPLOADED',
        `Currículo "${file.name}" (${(file.size / 1024).toFixed(1)} KB) validado e processado com sucesso conforme guardrail RG08.`,
        {
          details: `Arquivo PDF validado. IA sugeriu ${aiExtraction.extractedSkills.length} competências para triagem humana.`,
        }
      )
    );

    return NextResponse.json({
      success: true,
      fileInfo: {
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
      aiSuggestions: aiExtraction,
      message: 'Currículo em PDF validado com sucesso.',
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Erro no processamento seguro do currículo.',
    }, { status: 500 });
  }
}
