'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { PieChart, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface CompatibilityChartProps {
  highCount: number;
  mediumCount: number;
  lowCount: number;
  total: number;
}

export const CompatibilityChart: React.FC<CompatibilityChartProps> = ({
  highCount,
  mediumCount,
  lowCount,
  total,
}) => {
  const highPercent = total > 0 ? Math.round((highCount / total) * 100) : 0;
  const mediumPercent = total > 0 ? Math.round((mediumCount / total) * 100) : 0;
  const lowPercent = total > 0 ? Math.max(0, 100 - highPercent - mediumPercent) : 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Distribuição de Compatibilidade</h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">Total: {total} avaliações</span>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Barra de Progresso Segmentada */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${highPercent}%` }}
              title={`Alta: ${highPercent}%`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${mediumPercent}%` }}
              title={`Média: ${mediumPercent}%`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${lowPercent}%` }}
              title={`Baixa: ${lowPercent}%`}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            Proporção de candidatos distribuídos por faixa de aderência técnica
          </p>
        </div>

        {/* Detalhes Numéricos e Legendas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Alta */}
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-950 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Alta Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-emerald-700">{highPercent}%</span>
              <span className="text-xs font-semibold text-emerald-800">{highCount} cand.</span>
            </div>
            <span className="text-[10px] text-emerald-700 mt-1">Faixa: 80% a 100%</span>
          </div>

          {/* Média */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Média Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-amber-700">{mediumPercent}%</span>
              <span className="text-xs font-semibold text-amber-800">{mediumCount} cand.</span>
            </div>
            <span className="text-[10px] text-amber-700 mt-1">Faixa: 60% a 79%</span>
          </div>

          {/* Baixa */}
          <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-rose-950 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Baixa Compatibilidade</span>
            </div>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black text-rose-700">{lowPercent}%</span>
              <span className="text-xs font-semibold text-rose-800">{lowCount} cand.</span>
            </div>
            <span className="text-[10px] text-rose-700 mt-1">Faixa: Abaixo de 60%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
