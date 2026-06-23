'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<User | null>;
  setUser: (user: User | null) => void;
}

interface WhoAmIResponse {
  success: boolean;
  message?: string;
  data?: User;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readToken = () => {
  if (typeof window === 'undefined') return '';
  return window.localStorage.getItem('token') || '';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const token = readToken();
      const response = await fetch('/api/v1/auth/whoami', {
        method: 'GET',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const json = (await response.json()) as WhoAmIResponse;

      if (!response.ok || !json.success || !json.data) {
        setUser(null);
        return null;
      }

      setUser(json.data);
      return json.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}