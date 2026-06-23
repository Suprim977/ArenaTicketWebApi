'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';

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
  const { toast, ToastContainer } = useToast();
  const [formData, setFormData] = useState<ProfileFormState>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  useEffect(() => {
    if (!avatar) {
      setAvatarPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(avatar);
    setAvatarPreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [avatar]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
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
        body: payload,
      });

      const json = (await response.json()) as ApiResponse<{ id: string }>;

      if (!response.ok || !json.success) {
        toast({
          title: 'Profile update failed',
          description: json.message || 'Please check your details and try again.',
          variant: 'error',
        });
        return;
      }

      await refreshUser();
      toast({
        title: 'Profile updated',
        description: 'Your account details were saved successfully.',
        variant: 'success',
      });
    } catch {
      toast({
        title: 'Profile update failed',
        description: 'A network or server error prevented the update.',
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const initials = useMemo(() => {
    const first = formData.firstName.trim().charAt(0);
    const last = formData.lastName.trim().charAt(0);
    return `${first}${last}`.trim() || 'AT';
  }, [formData.firstName, formData.lastName]);

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-10 text-slate-900">
      <ToastContainer />
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/70 lg:p-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Profile</p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Update your account</h1>
          <p className="mt-2 text-sm text-gray-500">Keep your ArenaTicket profile current.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-700">Avatar</p>
            <div className="mt-5 flex items-center justify-center">
              <div className="flex h-44 w-44 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-linear-to-br from-indigo-100 via-white to-purple-100 shadow-lg shadow-slate-200/70">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-indigo-600 to-purple-600 text-4xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            <label className="mt-6 block rounded-2xl border border-dashed border-indigo-200 bg-white px-4 py-4 text-sm text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50/40">
              <span className="block font-semibold text-indigo-600">Upload avatar</span>
              <span className="mt-1 block text-xs text-slate-500">PNG, JPG, or WEBP. A preview appears immediately.</span>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setAvatar(event.target.files?.[0] || null)}
                className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-indigo-700"
              />
            </label>
          </section>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/profile/password')}
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Change password
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}