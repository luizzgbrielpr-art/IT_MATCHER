'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Search, FileText, UserCheck, Briefcase, User, UploadCloud, Hash } from 'lucide-react';

interface AuditTimelineProps {
  logs: AuditLog[];
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.jobTitle && log.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.candidateName && log.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.immutableHash.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionConfig = (action: AuditLog['action']) => {
    switch (action) {
      case 'JOB_CREATED':
        return {
          icon: <Briefcase className="w-4 h-4 text-indigo-600" />,
          label: 'Vaga Criada',
          badgeVariant: 'purple' as const,
        };
      case 'CANDIDATE_CREATED':
        return {
          icon: <User className="w-4 h-4 text-blue-600" />,
          label: 'Candidato Criado',
          badgeVariant: 'info' as const,
        };
      case 'MATCHING_CALCULATED':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
          label: 'Matching Calculado',
          badgeVariant: 'success' as const,
        };
      case 'REVIEW_UPDATED':
        return {
          icon: <UserCheck className="w-4 h-4 text-amber-600" />,
          label: 'Revisão Humana Registrada',
          badgeVariant: 'warning' as const,
        };
      case 'RESUME_UPLOADED':
        return {
          icon: <UploadCloud className="w-4 h-4 text-cyan-600" />,
          label: 'Upload de Currículo (RG08)',
          badgeVariant: 'default' as const,
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por detalhes, candidato, vaga, responsável ou hash de integridade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="w-full md:w-56 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="ALL">Todas as Ações</option>
          <option value="MATCHING_CALCULATED">Cálculos de Matching</option>
          <option value="REVIEW_UPDATED">Revisões Humanas</option>
          <option value="RESUME_UPLOADED">Upload de Currículos</option>
          <option value="JOB_CREATED">Criação de Vagas</option>
          <option value="CANDIDATE_CREATED">Criação de Candidatos</option>
        </select>
      </div>

      {/* Linha do Tempo */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">Trilha Imutável de Auditoria (RG10)</h3>
              <p className="text-xs text-slate-500">
                Registros criptograficamente identificados para conformidade ética e governança
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {filteredLogs.length} registro(s)
          </span>
        </CardHeader>
        <CardContent className="p-0">
          {filteredLogs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const config = getActionConfig(log.action);
                return (
                  <div key={log.id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-slate-100 rounded-lg">{config.icon}</div>
                        <Badge variant={config.badgeVariant} size="sm">
                          {config.label}
                        </Badge>
                        <span className="text-xs font-bold text-slate-900">
                          {log.candidateName && log.jobTitle
                            ? `${log.candidateName} ➔ ${log.jobTitle}`
                            : log.jobTitle || log.candidateName || 'Operação do Sistema'}
                        </span>
                      </div>

                      <span className="text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed pl-10">
                      {log.details}
                    </p>

                    {/* Metadados adicionais */}
                    <div className="flex flex-wrap items-center gap-3 pl-10 pt-1 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">
                        Responsável: <strong className="text-slate-900">{log.actor.name}</strong> ({log.actor.role})
                      </span>

                      {log.previousStatus && log.newStatus && (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Status: {log.previousStatus} ➔ <strong>{log.newStatus}</strong>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 font-mono text-slate-400 ml-auto bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                        <Hash className="w-3 h-3 text-slate-400" />
                        Hash: {log.immutableHash}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              Nenhum registro de auditoria corresponde aos filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
