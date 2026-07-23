"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("arenaticket-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const nextTheme = storedTheme === "dark" || storedTheme === "light" ? storedTheme : preferredTheme;

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    setTheme(nextTheme);
  }, [setTheme]);

  return <>{children}</>;
}
