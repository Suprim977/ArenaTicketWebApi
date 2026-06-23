'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

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
  const { toast, ToastContainer } = useToast();
  const [formData, setFormData] = useState<PasswordFormState>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, router, user]);

  const showBanner = (text: string, type: 'success' | 'error') => {
    setBanner({ text, type });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
    if (banner) {
      setBanner(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.newPassword.length < 8) {
      showBanner('New password must be at least 8 characters long.', 'error');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showBanner('New passwords do not match.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/v1/auth/password', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const json = (await response.json()) as ApiResponse;

      if (!response.ok || !json.success) {
        showBanner(json.message || 'Password update failed.', 'error');
        toast({
          title: 'Password update failed',
          description: json.message || 'Please verify your current password and try again.',
          variant: 'error',
        });
        return;
      }

      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showBanner('Password updated successfully.', 'success');
      toast({
        title: 'Password updated',
        description: 'Your account password has been changed.',
        variant: 'success',
      });
    } catch {
      showBanner('Password update failed.', 'error');
      toast({
        title: 'Password update failed',
        description: 'A network or server error prevented the update.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-900">
      <ToastContainer />
      <div className="mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 lg:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Security</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Change password</h1>
          <p className="mt-2 text-sm text-gray-500">Keep your ArenaTicket account secure.</p>
        </div>

        {banner && (
          <div className={`mb-6 rounded-2xl border p-4 text-sm ${banner.type === 'error' ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
            {banner.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
              <input
                name="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
                <p className="mt-2 text-xs text-slate-500">Use at least 8 characters.</p>
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Update password'}
            </button>
            <Link
              href="/profile"
              className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Back to Profile
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}