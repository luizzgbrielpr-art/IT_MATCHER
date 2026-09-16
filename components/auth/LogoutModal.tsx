'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from './AuthContext';
import { LogOut, AlertTriangle, ShieldCheck } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const handleConfirmLogout = () => {
    onClose();
    logout();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmação de Encerramento de Sessão"
      subtitle="Sair da Conta do IT MATCHER"
      maxWidth="md"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Tem certeza que deseja sair da conta?</h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              Sua sessão será encerrada com segurança no navegador. Você precisará se autenticar novamente para acessar o Dashboard, Vagas e Candidatos.
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Seus dados continuam 100% preservados:
          </span>
          <p className="opacity-90 pl-5">
            Todas as vagas, candidatos, históricos de Smart Matching e pareceres permanecem intactos e seguros no sistema.
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancelar
          </Button>

          {/* Botão Vermelho Destrutivo para Ação de Sair */}
          <Button
            type="button"
            variant="danger"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
            onClick={handleConfirmLogout}
          >
            Sair da Conta
          </Button>
        </div>
      </div>
    </Modal>
  );
};
