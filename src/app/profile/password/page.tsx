'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

export default function PasswordPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      showMessage('New passwords do not match', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';
      const response = await fetch('/api/v1/auth/password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success) {
        showMessage(json.message || 'Password update failed', 'error');
        return;
      }

      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showMessage('Password updated successfully', 'success');
    } catch {
      showMessage('Password update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 lg:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Change password</h1>
          <p className="mt-2 text-sm text-gray-500">Keep your ArenaTicket account secure.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-xl border p-4 text-sm ${messageType === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Current Password</label>
            <input name="currentPassword" type="password" value={formData.currentPassword} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">New Password</label>
              <input name="newPassword" type="password" value={formData.newPassword} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? 'Updating...' : 'Update password'}
            </button>
            <button type="button" onClick={() => router.push('/profile')} className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
              Back to profile
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}