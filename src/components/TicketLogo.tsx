import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      <span className="text-xl font-bold text-gray-900">ArenaTicket</span>
    </Link>
  );
}