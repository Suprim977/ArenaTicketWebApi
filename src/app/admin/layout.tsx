"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/events", label: "Events" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/dashboard", label: "User Dashboard" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="grid min-h-screen bg-[#F3F4F6] dark:bg-slate-950 md:grid-cols-[250px_1fr]">
      <aside className="border-r border-gray-200 bg-white px-6 py-8 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-black text-gray-900 dark:text-white">Arena Admin</h2>
        <p className="mt-1 text-xs tracking-[0.14em] text-gray-500 dark:text-slate-400">CONTROL ROOM</p>
        <div className="mt-6">
          <ThemeToggle />
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith(item.href) ? "bg-indigo-50 text-arena-indigo dark:bg-slate-800 dark:text-sky-300" : "text-gray-700 dark:text-slate-200"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:text-slate-200">
          Logout
        </button>
      </aside>

      <div>
        <header className="border-b border-gray-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">ArenaTicket Administration</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
