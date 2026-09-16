'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { User, UpdateUserProfileInput } from '@/types';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/layout/Toast';
import {
  User as UserIcon,
  Mail,
  Phone,
  Briefcase,
  Building2,
  Calendar,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Camera,
} from 'lucide-react';

export default function PerfilPage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<UpdateUserProfileInput>({
    name: '',
    email: '',
    company: '',
    department: '',
    phone: '',
    avatarUrl: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/perfil');
      const data = await res.json();
      if (data.success) {
        setProfile(data.data);
        setFormData({
          name: data.data.name,
          email: data.data.email,
          company: data.data.company || '',
          department: data.data.department || '',
          phone: data.data.phone || '',
          avatarUrl: data.data.avatarUrl || '',
        });
      }
    } catch (e) {
      showToast('Erro ao carregar perfil do recrutador', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro ao salvar alterações do perfil.');
      }

      setProfile(data.data);
      showToast('Perfil atualizado com sucesso!', 'success');
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="space-y-6">
        <Header title="Perfil do Recrutador" description="Carregando informações do usuário..." />
        <div className="px-6 flex items-center justify-center py-20 text-slate-400">
          <span className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mr-3" />
          Carregando dados do perfil...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Header
        title="Perfil do Recrutador"
        description="Gerencie suas informações profissionais, departamento e credenciais de acesso"
      >
        <Button
          variant="primary"
          size="sm"
          icon={<Edit3 className="w-4 h-4" />}
          onClick={() => setIsEditModalOpen(true)}
        >
          Editar Perfil
        </Button>
      </Header>

      <div className="px-6 max-w-4xl mx-auto space-y-6">
        {/* Card Principal do Perfil */}
        <Card className="overflow-hidden border-slate-200/90 shadow-md">
          <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative">
            <div className="absolute right-4 top-4">
              <Badge variant="purple" size="md">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                {profile.role} Autorizado
              </Badge>
            </div>
          </div>

          <CardContent className="p-6 relative pt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                <div className="relative group">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-indigo-600 text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute bottom-1 right-1 p-1.5 bg-slate-900 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-colors cursor-pointer"
                    title="Alterar foto"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900">{profile.name}</h2>
                  <p className="text-sm font-semibold text-indigo-600">{profile.role} de Tecnologia</p>
                  <p className="text-xs text-slate-500">{profile.company || 'IT Matcher Platform'}</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={<Edit3 className="w-4 h-4" />}
                onClick={() => setIsEditModalOpen(true)}
              >
                Editar Perfil
              </Button>
            </div>

            {/* Grid de Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-indigo-600" /> E-mail Profissional
                </span>
                <p className="text-sm font-bold text-slate-800">{profile.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-indigo-600" /> Telefone / WhatsApp
                </span>
                <p className="text-sm font-bold text-slate-800">{profile.phone || 'Não informado'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-600" /> Empresa & Organização
                </span>
                <p className="text-sm font-bold text-slate-800">{profile.company || 'IT Matcher Services'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" /> Departamento
                </span>
                <p className="text-sm font-bold text-slate-800">{profile.department || 'Recrutamento & Seleção'}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1 md:col-span-2">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-600" /> Data de Cadastro na Plataforma
                </span>
                <p className="text-sm font-bold text-slate-800">
                  {profile.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : '15 de Janeiro de 2026'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição de Perfil */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Informações do Recrutador"
        subtitle="Atualize seus dados de contato profissional e avatar"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome Completo *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">E-mail Profissional *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Empresa</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departamento</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL da Foto / Avatar</label>
            <input
              type="text"
              placeholder="https://exemplo.com/foto.jpg"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
