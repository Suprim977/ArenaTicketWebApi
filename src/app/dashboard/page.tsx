'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setUserName(user.firstName || user.username || 'User');
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <div className="w-full rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-xl shadow-slate-200/70 sm:px-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi {userName}</h1>
          <p className="text-xl text-gray-500">Welcome to dashboard</p>

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/profile"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
            >
              Update Profile
            </Link>
            <Link
              href="/profile/password"
              className="rounded-xl border border-indigo-200 bg-white px-6 py-3 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              Change Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}   