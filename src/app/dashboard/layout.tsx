"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navLinks = [
    { href: "/dashboard", label: "Overview" },
    { href: "/events", label: "Events" },
    { href: "/search", label: "Search" },
    { href: "/categories", label: "Categories" },
    { href: "/booking", label: "Booking" },
    { href: "/history", label: "History" },
    { href: "/dashboard/profile", label: "Profile" },
    { href: "/dashboard/password", label: "Password" },
    { href: "/admin/users", label: "Admin" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-950">
      <header className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h1 className="text-xl font-black text-gray-900 dark:text-white">ArenaTicket Dashboard</h1>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  pathname === link.href ? "bg-indigo-50 text-arena-indigo dark:bg-slate-800 dark:text-sky-300" : "text-gray-700 dark:text-slate-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:text-slate-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
    </div>
  );
}
