// app/_components/Navbar.tsx
// top-nav — 64px black bar pinned to top of every page.
"use client";
import Link from "next/link";
import Logo from "./Logo";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-hairline bg-canvas">
      <nav className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6">
        <Logo />

        {
          !user && <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm tracking-[0.5px] text-body transition-colors hover:text-on-dark sm:block"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="flex h-10 items-center border border-on-dark px-5 text-xs font-bold uppercase tracking-[1.5px] text-on-dark transition-colors hover:bg-on-dark hover:text-canvas"
            >
              Register
            </Link>
          </div>
        }
        {
          user && <div className="flex items-center gap-4">
            <span className="text-sm tracking-[0.5px] text-body transition-colors hover:text-on-dark sm:block">
              {user.firstName} {user.lastName}
            </span>
            <Link
              href="/dashboard"
              className="flex h-10 items-center border border-on-dark px-5 text-xs font-bold uppercase tracking-[1.5px] text-on-dark transition-colors hover:bg-on-dark hover:text-canvas"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="flex h-10 items-center border border-m-red px-5 text-xs font-bold uppercase tracking-[1.5px] text-m-red transition-colors hover:bg-m-red hover:text-canvas"
            >
              Logout
            </button>
          </div>
        }

      </nav>
    </header>
  );
}
