"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "@/app/__components/Logo";

const accountLinks = [
  { href: "/login", label: "Login" },
  { href: "/register", label: "Sign Up" },
  { href: "/admin/login", label: "Admin Login" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="relative border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo href="/" />
        <nav aria-label="Homepage navigation" className="hidden items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
          <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={`rounded-xl px-3 py-2 transition ${pathname === "/" ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>Home</Link>
          {accountLinks.map((link) => {
            const active = pathname === link.href;
            return <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`rounded-xl px-3 py-2 transition ${active ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{link.label}</Link>;
          })}
          <ThemeToggle />
        </nav>
        <button type="button" className="rounded-lg p-2 text-slate-700 dark:text-slate-200 md:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav aria-label="Mobile homepage navigation" className="absolute inset-x-0 z-50 border-t border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <Link onClick={() => setOpen(false)} href="/" aria-current={pathname === "/" ? "page" : undefined} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${pathname === "/" ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}>Home</Link>
          {accountLinks.map((link) => <Link onClick={() => setOpen(false)} key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${pathname === link.href ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"}`}>{link.label}</Link>)}
          <div className="px-3 pt-2"><ThemeToggle /></div>
        </nav>
      )}
    </header>
  );
}
