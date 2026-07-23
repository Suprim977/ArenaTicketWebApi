import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-slate-200">
          <Link href="/" className="hidden sm:inline">
            Home
          </Link>
          <Link href="/events" className="hidden md:inline transition hover:text-arena-indigo dark:hover:text-white">
            Events
          </Link>
          <Link href="/categories" className="hidden md:inline transition hover:text-arena-indigo dark:hover:text-white">
            Categories
          </Link>
          <Link href="/history" className="hidden md:inline transition hover:text-arena-indigo dark:hover:text-white">
            History
          </Link>
          <ThemeToggle />
          <Link href="/login" className="rounded-xl px-3 py-2 transition hover:text-arena-indigo dark:hover:text-white">
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