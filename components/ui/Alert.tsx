import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error' | 'guardrail';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    info: {
      container: 'bg-blue-50/80 border-blue-200 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
      titleColor: 'text-blue-900 font-semibold',
    },
    success: {
      container: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
      titleColor: 'text-emerald-900 font-semibold',
    },
    warning: {
      container: 'bg-amber-50/80 border-amber-200 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
      titleColor: 'text-amber-900 font-semibold',
    },
    error: {
      container: 'bg-rose-50/80 border-rose-200 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
      titleColor: 'text-rose-900 font-semibold',
    },
    guardrail: {
      container: 'bg-indigo-50/90 border-indigo-200 text-indigo-950 shadow-xs',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />,
      titleColor: 'text-indigo-950 font-bold',
    }
  };

  const current = styles[type];

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${current.container} ${className}`}>
      {current.icon}
      <div className="flex-1 space-y-1">
        {title && <h5 className={current.titleColor}>{title}</h5>}
        <div className="opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
};
