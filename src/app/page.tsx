import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">Welcome to ArenaTicket</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">The ultimate platform for competitive esports ticketing and tournament management.</p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">Get Started</Link>
        <Link href="/login" className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition">Login</Link>
      </div>
    </div>
  );
}