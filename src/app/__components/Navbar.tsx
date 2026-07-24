"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getProfileImageUrl } from "@/lib/profile-image";
import Logo from "./Logo";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const links = isAuthenticated
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/search", label: "Events" },
        { href: "/bookings", label: "My Bookings" },
        { href: "/tickets", label: "My Tickets" },
        { href: "/profile", label: "Profile" },
        ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/dashboard/events", label: "Events" },
        { href: "/login", label: "Login" },
        { href: "/register", label: "Register" },
      ];
  const imageUrl = getProfileImageUrl(user?.profilePicture ?? user?.avatar, user?.updatedAt);
  const initials = `${user?.firstName?.[0] ?? user?.person?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? user?.person?.lastName?.[0] ?? ""}` || "U";

  return (
    <header className="relative border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        {isLoading ? <div className="h-10 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" /> : (
          <>
            <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
              {links.map((link) => {
                const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
                return <Link onClick={close} key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`rounded-xl px-3 py-2 transition ${active ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{link.label}</Link>;
              })}
              {isAuthenticated && <button onClick={() => { logout(); router.replace("/login"); }} className="rounded-xl px-3 py-2 hover:bg-rose-50 hover:text-rose-700">Logout</button>}
              {isAuthenticated && <Link href="/profile" aria-label="Open profile" className="ml-1 flex size-9 items-center justify-center overflow-hidden rounded-full bg-indigo-600 font-bold text-white">{imageUrl ? <Image src={imageUrl} alt="" width={36} height={36} className="size-9 object-cover" /> : initials}</Link>}
              <ThemeToggle />
            </nav>
            <button className="rounded-lg p-2 md:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? <X /> : <Menu />}</button>
          </>
        )}
      </div>
      {!isLoading && open && <nav aria-label="Mobile navigation" className="absolute inset-x-0 z-50 border-t border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-950 md:hidden">{links.map((link) => {
        const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(`${link.href}/`));
        return <Link onClick={close} key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={`block rounded-lg px-3 py-3 text-sm font-semibold ${active ? "bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>{link.label}</Link>;
      })}{isAuthenticated && <button onClick={() => { close(); logout(); router.replace("/login"); }} className="block w-full rounded-lg px-3 py-3 text-left text-sm font-semibold text-rose-600">Logout</button>}<div className="px-3 pt-2"><ThemeToggle /></div></nav>}
    </header>
  );
}
