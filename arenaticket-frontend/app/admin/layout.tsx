"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const navItems = [
    { href: "/admin/users", label: "Users" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="grid min-h-screen bg-[#F3F4F6] md:grid-cols-[250px_1fr]">
      <aside className="border-r border-gray-200 bg-white px-6 py-8">
        <h2 className="text-xl font-black text-gray-900">Arena Admin</h2>
        <p className="mt-1 text-xs tracking-[0.14em] text-gray-500">CONTROL ROOM</p>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                pathname.startsWith(item.href) ? "bg-indigo-50 text-arena-indigo" : "text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700">
          Logout
        </button>
      </aside>

      <div>
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-lg font-bold text-gray-900">ArenaTicket Administration</h1>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
