import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav aria-label="Account navigation" className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <ThemeToggle />
          <Link href="/login" className="rounded-xl px-3 py-2 transition hover:bg-slate-100 hover:text-arena-indigo dark:hover:bg-slate-800 dark:hover:text-white">
            Login
          </Link>
          <Link href="/register" className="primary-btn px-4 py-2">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
