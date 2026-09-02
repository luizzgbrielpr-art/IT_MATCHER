import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { ToastProvider } from '@/components/layout/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IT Matcher — Smart Recruitment & Decision Support',
  description: 'Plataforma de Smart Matching com critérios técnicos ponderados e guardrails éticos para recrutamento em TI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className={`${inter.className} h-full bg-slate-50 text-slate-900 flex flex-col lg:flex-row antialiased`}>
        <ToastProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col lg:pl-64 min-h-screen overflow-x-hidden">
            <main className="flex-1 pb-12">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
