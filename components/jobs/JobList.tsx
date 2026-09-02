'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Job } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Briefcase, ArrowRight, Search, Clock, Award } from 'lucide-react';

interface JobListProps {
  jobs: Job[];
}

export const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('ALL');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesArea = selectedArea === 'ALL' || job.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const areas = Array.from(new Set(jobs.map((j) => j.area)));

  return (
    <div className="space-y-4">
      {/* Barra de Busca e Filtros */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por cargo, competência (React, Python...) ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Todas as Áreas</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Vagas */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:border-indigo-200 transition-all hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                      <Badge variant="purple" size="sm">{job.area}</Badge>
                      <Badge variant="default" size="sm">{job.level}</Badge>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Competências com Pesos */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase mr-1">Pesos:</span>
                      {job.skills.map((skill) => (
                        <span
                          key={skill.id}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-800 border border-slate-200 font-medium"
                        >
                          <span>{skill.name}</span>
                          <span className="font-bold text-indigo-600">{skill.weight}%</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Mínimo {job.minExperienceYears} ano(s) de experiência
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                    <Link href={`/vagas/${job.id}`}>
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </Link>
                    <Link href={`/matching/${job.id}`}>
                      <Button variant="primary" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                        Smart Matching & Ranking
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h4 className="text-base font-bold text-slate-800">Nenhuma vaga encontrada</h4>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar seus termos de busca ou filtros.</p>
        </div>
      )}
    </div>
  );
};
