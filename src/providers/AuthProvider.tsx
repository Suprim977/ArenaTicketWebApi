"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { deleteAuthCookies, setAuthCookies } from "@/lib/cookies";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem("token"),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AuthUser;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  useEffect(() => {
    if (token) setAuthCookies(token, user?.role);
  }, [token, user?.role]);

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setAuthCookies(newToken, newUser.role);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    deleteAuthCookies();
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      setUser,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
