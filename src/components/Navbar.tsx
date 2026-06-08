import Link from 'next/link';
import Logo from './Logo';

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Logo />
        <div className="flex gap-6">
          <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition">Login</Link>
          <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}