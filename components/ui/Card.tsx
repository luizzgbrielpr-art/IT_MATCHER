import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(clsx('bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden', className))}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(clsx('px-6 py-4 border-b border-slate-100 flex items-center justify-between', className))}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={twMerge(clsx('p-6', className))} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={twMerge(clsx('px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center', className))}
      {...props}
    >
      {children}
    </div>
  );
};
