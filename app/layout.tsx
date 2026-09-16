import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/layout/Toast';
import { AuthProvider } from '@/components/auth/AuthContext';
import { AppLayoutContent } from '@/components/layout/AppLayoutContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IT MATCHER — Smart Recruitment & Decision Support',
  description: 'Plataforma de Smart Matching com critérios técnicos ponderados e guardrails éticos para recrutamento em TI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full bg-slate-50 text-slate-900 flex flex-col antialiased`}>
        <ToastProvider>
          <AuthProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
