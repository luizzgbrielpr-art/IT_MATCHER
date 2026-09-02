import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'indigo',
}) => {
  const variantStyles = {
    indigo: {
      bg: 'bg-indigo-50/70 text-indigo-600 border-indigo-100',
      valueColor: 'text-slate-900',
    },
    emerald: {
      bg: 'bg-emerald-50/70 text-emerald-600 border-emerald-100',
      valueColor: 'text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/70 text-amber-600 border-amber-100',
      valueColor: 'text-amber-700',
    },
    rose: {
      bg: 'bg-rose-50/70 text-rose-600 border-rose-100',
      valueColor: 'text-rose-700',
    },
    slate: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      valueColor: 'text-slate-800',
    },
  };

  const style = variantStyles[variant];

  return (
    <Card className="hover:border-slate-300 transition-all hover:shadow-xs">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
            <h3 className={`text-2xl font-black ${style.valueColor}`}>{value}</h3>
            {subtitle && <p className="text-[11px] text-slate-400">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-xl border ${style.bg} shrink-0`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
