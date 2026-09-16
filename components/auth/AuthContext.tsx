'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CURRENT_USER } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
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

  const login = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      localStorage.setItem('itmatcher_session', 'true');
      document.cookie = "itmatcher_session=true; path=/; max-age=86400;";
      
      const res = await fetch('/api/perfil');
      const data = await res.json();
      const loggedUser = data.success ? data.data : { ...CURRENT_USER, email: email || CURRENT_USER.email };
      
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
