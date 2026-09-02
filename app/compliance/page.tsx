import React from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Lock, Eye, AlertTriangle, FileCheck, FileCode, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

const GUARDRAILS = [
  {
    code: 'RG01',
    name: 'Proteção de Dados (PII)',
    desc: 'Protege dados pessoais e de contato dos candidatos (e-mail, telefone), evitando exposição indevida nas interfaces de triagem.',
    status: 'Ativo & Em Conformidade',
    icon: Lock,
    implementation: 'Funções maskEmail() e maskPhone() aplicadas no frontend e sanitização no backend.',
  },
  {
    code: 'RG02',
    name: 'Acesso Restrito & Perfis',
    desc: 'Somente usuários autorizados (Recrutadores e Auditores) podem acessar dados cadastrais e emitir pareceres.',
    status: 'Ativo & Em Conformidade',
    icon: ShieldCheck,
    implementation: 'Controle por tipos UserRole e validação de contexto em todas as rotas e Route Handlers.',
  },
  {
    code: 'RG03',
    name: 'Decisão 100% Humana',
    desc: 'O sistema nunca realiza contratação ou eliminação definitiva automaticamente. O Smart Matching é estritamente suporte à decisão.',
    status: 'Ativo & Em Conformidade',
    icon: UserCheck,
    implementation: 'Fluxos de status (Pendente, Revisado, Aprovado, Não recomendado) com parecer manual obrigatório.',
  },
  {
    code: 'RG04',
    name: 'Transparência Algorítmica',
    desc: 'Sempre explicar detalhadamente como o percentual de matching foi calculado, item a item (skills, pesos e fórmulas).',
    status: 'Ativo & Em Conformidade',
    icon: Eye,
    implementation: 'Modal "Como o percentual foi calculado" com tabela de requisitos encontrados, ausentes e fórmula aritmética.',
  },
  {
    code: 'RG05',
    name: 'Princípio de Não-Discriminação',
    desc: 'Não utilizar gênero, idade, raça, religião, estado civil ou aparência física no cálculo da pontuação técnica.',
    status: 'Ativo & Em Conformidade',
    icon: ShieldAlert,
    implementation: 'Fórmula estrita baseada em competências técnicas. Verificador sanitizeAndVerifyNonDiscrimination().',
  },
  {
    code: 'RG06',
    name: 'Validação de Suficiência de Dados',
    desc: 'Verificar se existem informações mínimas suficientes de competências antes de gerar recomendações de compatibilidade.',
    status: 'Ativo & Em Conformidade',
    icon: FileCheck,
    implementation: 'Detecção de perfis incompletos com flag insufficientData e alerta visual de necessidade de triagem manual.',
  },
  {
    code: 'RG07',
    name: 'Revisão Manual Obrigatória',
    desc: 'Resultados incompletos, inconsistentes ou com score técnico baixo são automaticamente encaminhados para análise humana.',
    status: 'Ativo & Em Conformidade',
    icon: AlertTriangle,
    implementation: 'Ativação de requiresManualReview: true na função calculateMatching() para dados atípicos.',
  },
  {
    code: 'RG08',
    name: 'Segurança de Arquivos e Uploads',
    desc: 'Validação rigorosa de currículos em formato PDF: extensão (.pdf), tipo MIME application/pdf, limite de 5MB e sem execução.',
    status: 'Ativo & Em Conformidade',
    icon: FileCode,
    implementation: 'Validador validateResumeFile() e processamento isolado na rota /api/upload-resume.',
  },
  {
    code: 'RG09',
    name: 'Proteção contra Manipulação de Score',
    desc: 'O candidato não pode alterar diretamente sua pontuação. O cálculo é executado no servidor a partir de dados auditáveis.',
    status: 'Ativo & Em Conformidade',
    icon: Lock,
    implementation: 'Algoritmo independente no servidor com hash criptográfico de integridade da avaliação.',
  },
  {
    code: 'RG10',
    name: 'Registro Imutável de Auditoria',
    desc: 'Registrar timestamp, vaga, candidato, skills encontradas/não encontradas, pesos e pareceres para governança.',
    status: 'Ativo & Em Conformidade',
    icon: FileCheck,
    implementation: 'Trilha de auditoria em /api/audit com persistência de eventos e hashes verificáveis.',
  },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <Header
        title="Guardrails de Segurança & Ética"
        description="Painel de conformidade com os 10 Guardrails de Segurança e Transparência do IT Matcher"
      />

      <div className="px-6 space-y-6 max-w-6xl mx-auto">
        {/* Banner Central */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-900 shadow-md space-y-2">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-xl font-bold">Conformidade com Guardrails RG01 a RG10</h2>
              <p className="text-xs text-indigo-200">
                Sistema auditado para triagem ética, transparente e sem discriminação em processos seletivos de TI.
              </p>
            </div>
          </div>
        </div>

        {/* Lista de Guardrails */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GUARDRAILS.map((gr) => {
            const Icon = gr.icon;
            return (
              <Card key={gr.code} className="hover:border-indigo-300 transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
                          {gr.code}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{gr.name}</h4>
                      </div>
                    </div>

                    <Badge variant="success" size="sm">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {gr.desc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <strong className="text-slate-700">Implementação Técnica:</strong> {gr.implementation}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
