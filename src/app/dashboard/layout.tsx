"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CalendarDays, History, KeyRound, LayoutDashboard, LogOut, Ticket, UserRound } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/contexts/AuthContext";
import Logo from "@/app/__components/Logo";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/bookings", label: "My Bookings", icon: History },
  { href: "/tickets", label: "My Tickets", icon: Ticket },
  { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  { href: "/dashboard/password", label: "Password", icon: KeyRound },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && user?.role === "admin") router.replace("/admin");
  }, [isLoading, router, user?.role]);

  if (!isLoading && user?.role === "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-5 lg:px-6">
          <Logo />
          <ThemeToggle />
        </div>
        <nav aria-label="Dashboard navigation" className="flex gap-1 overflow-x-auto px-3 pb-4 lg:block lg:space-y-1 lg:px-4">
          {links.map(({ href, label, icon: Icon, ...item }) => {
            const active = "exact" in item ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon size={18} aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-4 lg:absolute lg:inset-x-0 lg:bottom-5 lg:block">
          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-700 dark:text-slate-300 dark:hover:bg-rose-950/30"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</main>
    </div>
  );
}
