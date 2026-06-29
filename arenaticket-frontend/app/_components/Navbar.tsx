import Link from "next/link";
import Logo from "./Logo";

export default function Navbar() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-medium text-gray-700">
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/register" className="primary-btn px-4 py-2">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
