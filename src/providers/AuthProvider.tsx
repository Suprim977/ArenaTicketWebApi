"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/profile.service";
import { deleteAuthCookies, setAuthCookies } from "@/lib/cookies";
import type { AuthUser } from "@/types/auth";

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
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
  const profileQuery = useQuery({
    queryKey: ["current-user"],
    queryFn: profileService.getProfile,
    enabled: Boolean(token),
    retry: false,
  });

  const effectiveUser = (profileQuery.data as AuthUser | undefined) ?? user;

  useEffect(() => {
    if (profileQuery.data) {
      localStorage.setItem("user", JSON.stringify(profileQuery.data));
    }
  }, [profileQuery.data]);

  useEffect(() => {
    if (token) setAuthCookies(token, effectiveUser?.role);
  }, [effectiveUser?.role, token]);

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
    queryClient.removeQueries({ queryKey: ["current-user"] });
  };

  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  });

  const value = {
      token,
      user: effectiveUser,
      isAuthenticated: Boolean(token),
      isLoading: Boolean(token) && profileQuery.isLoading,
      login,
      logout,
      setUser: (nextUser: AuthUser | null) => {
        setUser(nextUser);
        queryClient.setQueryData(["current-user"], nextUser);
        if (nextUser) localStorage.setItem("user", JSON.stringify(nextUser));
        else localStorage.removeItem("user");
      },
    };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
