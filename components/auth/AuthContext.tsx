'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CURRENT_USER } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string, isCompany?: boolean) => Promise<boolean>;
  loginCompany: (email: string, pass: string) => Promise<boolean>;
  registerCompany: (data: any) => Promise<boolean>;
  switchAccountType: (type: 'recrutador' | 'empresa') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkSession = async () => {
    try {
      const hasSession = localStorage.getItem('itmatcher_session') === 'true';

      if (hasSession) {
        const res = await fetch('/api/perfil');
        const data = await res.json();
        if (data.success) {
          setUser(data.data);
          setIsAuthenticated(true);
        } else {
          setUser(CURRENT_USER);
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      const hasSession = localStorage.getItem('itmatcher_session') === 'true';
      if (hasSession) {
        setUser(CURRENT_USER);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, pass: string, isCompany: boolean = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('itmatcher_session', 'true');
      document.cookie = "itmatcher_session=true; path=/; max-age=86400;";
      
      const res = await fetch('/api/perfil');
      const data = await res.json();

      let loggedUser: User;
      if (isCompany || email.includes('tech') || email.includes('empresa')) {
        loggedUser = {
          id: 'emp_tech_01',
          name: 'Tech Solutions',
          email: email || 'empresa@techsolutions.com.br',
          role: 'Empresa',
          tipoUsuario: 'empresa',
          company: 'Tech Solutions',
          companyData: {
            id: 'emp_tech_01',
            name: 'Tech Solutions',
            email: email || 'empresa@techsolutions.com.br',
            companyType: 'Empresa de Tecnologia',
            companyIndustry: 'Desenvolvimento de Software',
            companySize: '51–200 funcionários',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            website: 'https://techsolutions.com.br',
            description: 'Empresa líder em desenvolvimento de software e ecossistemas digitais.',
          }
        };
        await fetch('/api/perfil', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loggedUser),
        });
      } else {
        loggedUser = data.success ? data.data : { ...CURRENT_USER, email: email || CURRENT_USER.email };
      }
      
      setUser(loggedUser);
      setIsAuthenticated(true);
      return true;
    } catch (e) {
      localStorage.setItem('itmatcher_session', 'true');
      setUser(CURRENT_USER);
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const loginCompany = async (email: string, pass: string): Promise<boolean> => {
    return login(email, pass, true);
  };

  const registerCompany = async (data: any): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/empresa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'Erro ao cadastrar empresa');
      }

      localStorage.setItem('itmatcher_session', 'true');
      document.cookie = "itmatcher_session=true; path=/; max-age=86400;";
      setUser(resData.data);
      setIsAuthenticated(true);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  const switchAccountType = async (type: 'recrutador' | 'empresa') => {
    setIsLoading(true);
    try {
      let targetUser: User;
      if (type === 'empresa') {
        targetUser = {
          id: user?.companyData?.id || 'emp_tech_01',
          name: user?.companyData?.name || 'Tech Solutions',
          email: user?.companyData?.email || 'empresa@techsolutions.com.br',
          role: 'Empresa',
          tipoUsuario: 'empresa',
          company: user?.companyData?.name || 'Tech Solutions',
          companyData: user?.companyData || {
            id: 'emp_tech_01',
            name: 'Tech Solutions',
            email: 'empresa@techsolutions.com.br',
            companyType: 'Empresa de Tecnologia',
            companyIndustry: 'Desenvolvimento de Software',
            companySize: '51–200 funcionários',
            city: 'São Paulo',
            state: 'SP',
            country: 'Brasil',
            website: 'https://techsolutions.com.br',
            description: 'Empresa líder em desenvolvimento de software e ecossistemas digitais.',
          }
        };
      } else {
        targetUser = { ...CURRENT_USER };
      }

      await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(targetUser),
      });

      setUser(targetUser);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // 1. Limpar tokens e estados armazenados
    localStorage.removeItem('itmatcher_session');
    sessionStorage.clear();
    document.cookie = "itmatcher_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // 2. Invalidar estado do usuário no frontend
    setUser(null);
    setIsAuthenticated(false);

    // 3. Redirecionar expressamente para a tela de Login
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const refreshUser = async () => {
    await checkSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginCompany,
        registerCompany,
        switchAccountType,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};
