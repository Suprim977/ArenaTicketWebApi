"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useThemeStore } from "@/store/useThemeStore";

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleThemeToggle = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    window.localStorage.setItem("arenaticket-theme", nextTheme);
    setTheme(nextTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleThemeToggle}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-arena-indigo dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
