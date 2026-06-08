import { getUserData } from '@/lib/cookies';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getUserData();
  if (!user) redirect('/login');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome, {user.firstName || user.username}!</h1>
      <p className="text-gray-600 text-lg">You have successfully logged in to ArenaTicket.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
          <p className="text-gray-500 mt-2">No upcoming tournaments.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900">My Tickets</h3>
          <p className="text-gray-500 mt-2">0 tickets purchased.</p>
        </div>
      </div>
    </div>
  );
}