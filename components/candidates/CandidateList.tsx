'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Candidate } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { User, Search, FileText, CheckCircle2, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { maskEmail, maskPhone } from '@/lib/security';

interface CandidateListProps {
  candidates: Candidate[];
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.technicalSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'ALL' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-4">
      {/* Barra de Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar candidato por nome ou competência técnica (React, SQL, Docker)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-full md:w-48 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="ALL">Todos os Níveis</option>
          <option value="Estágio">Estágio</option>
          <option value="Júnior">Júnior</option>
          <option value="Pleno">Pleno</option>
          <option value="Sênior">Sênior</option>
          <option value="Especialista">Especialista</option>
          <option value="Tech Lead">Tech Lead</option>
        </select>
      </div>

      {/* Grid de Candidatos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((candidate) => (
            <Card key={candidate.id} className="hover:border-indigo-200 transition-all hover:shadow-md">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {candidate.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{candidate.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="purple" size="sm">{candidate.level}</Badge>
                          <span className="text-xs text-slate-500">{candidate.experienceYears} ano(s) de exp.</span>
                        </div>
                      </div>
                    </div>

                    {candidate.hasResume && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <FileText className="w-3 h-3" /> PDF
                      </span>
                    )}
                  </div>

                  {/* Informações mascaradas RG01 */}
                  <div className="bg-slate-50/70 p-2.5 rounded-lg text-xs text-slate-600 space-y-1 border border-slate-100">
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{maskEmail(candidate.email)}</span>
                      <span className="text-[10px] text-indigo-500 font-medium ml-auto">(Protegido RG01)</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{maskPhone(candidate.phone)}</span>
                    </div>
                  </div>

                  {/* Competências Técnicas */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Competências ({candidate.technicalSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {candidate.technicalSkills.slice(0, 7).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[11px] font-medium border border-slate-200"
                        >
                          {skill}
                        </span>
                      ))}
                      {candidate.technicalSkills.length > 7 && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[11px] font-medium">
                          +{candidate.technicalSkills.length - 7}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(candidate.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <Link href={`/candidatos/${candidate.id}`}>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">Nenhum candidato encontrado</h4>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};
