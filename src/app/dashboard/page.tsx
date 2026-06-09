'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.firstName || parsed.username || 'User');
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Hi {userName}</h1>
        <p className="text-xl text-gray-500">Welcome to dashboard</p>
      </div>
    </div>
  );
}