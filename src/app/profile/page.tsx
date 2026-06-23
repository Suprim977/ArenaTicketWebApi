'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ProfileFormState {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }

    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
      });
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
    setSubmitting(true);

    try {
      const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : '';
      const payload = new FormData();
      payload.append('firstName', formData.firstName);
      payload.append('lastName', formData.lastName);
      payload.append('email', formData.email);
      payload.append('username', formData.username);
      if (avatar) {
        payload.append('avatar', avatar);
      }

      const response = await fetch('/api/v1/auth/update', {
        method: 'PUT',
        credentials: 'include',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: payload,
      });

      const json = (await response.json()) as ApiResponse<{ id: string }>;

      if (!response.ok || !json.success) {
        showMessage(json.message || 'Update failed', 'error');
        return;
      }

      await refreshUser();
      showMessage('Profile updated successfully', 'success');
    } catch {
      showMessage('Update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-10">
      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 lg:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Update your account</h1>
          <p className="mt-2 text-sm text-gray-500">Keep your ArenaTicket profile current.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-xl border p-4 text-sm ${messageType === 'error' ? 'border-red-100 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Username</label>
              <input name="username" value={formData.username} onChange={handleChange} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Avatar</label>
            <input type="file" accept="image/*" onChange={(event) => setAvatar(event.target.files?.[0] || null)} className="block w-full rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700" />
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="submit" disabled={submitting} className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save changes'}
            </button>
            <button type="button" onClick={() => router.push('/profile/password')} className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
              Change password
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}