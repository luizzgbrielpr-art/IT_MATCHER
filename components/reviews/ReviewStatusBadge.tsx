import React from 'react';
import { ReviewStatus } from '@/types';
import { Clock, CheckCircle2, UserCheck, XCircle } from 'lucide-react';

interface ReviewStatusBadgeProps {
  status?: ReviewStatus | string;
  size?: 'sm' | 'md';
}

export const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({
  status = 'Pendente de revisão',
  size = 'md',
}) => {
  const configs: Record<string, { bg: string; icon: React.ReactNode }> = {
    'Pendente de revisão': {
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    },
    'Revisado': {
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />,
    },
    'Aprovado para próxima etapa': {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: <UserCheck className="w-3.5 h-3.5 text-emerald-600" />,
    },
    'Não recomendado': {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-600" />,
    },
  };

  const current = configs[status] || configs['Pendente de revisão'];

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${current.bg} ${sizeClasses[size]}`}
    >
      {current.icon}
      <span>{status}</span>
    </span>
  );
};
