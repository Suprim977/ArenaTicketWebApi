'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleLoginUser } from '@/lib/actions/auth-actions';
import { useState } from 'react';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setError('');
    setLoading(true);
    const result = await handleLoginUser(data);
    setLoading(false);
    if (!result.success) setError(result.message);
  };

  // Clean input styling
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition bg-white text-gray-900 text-sm placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-900 mb-1.5 uppercase tracking-wide";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-screen flex bg-white">
      {/* LEFT - Visual (Light Blue) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-50 items-center justify-center p-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
            </svg>
          </div>
          <p className="text-gray-900 font-bold text-lg text-center">ArenaTicket</p>
        </div>
      </div>

      {/* RIGHT - Form (White) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 text-sm mt-2">Access your arena pass and upcoming tournament schedule.</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={labelClass}>Email Address</label>
              <input {...register('email')} className={inputClass} placeholder="enter your email" />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={labelClass}>Password</label>
                <Link href="#" className="text-xs text-indigo-600 hover:underline font-semibold">Forgot password?</Link>
              </div>
              <input {...register('password')} type="password" className={inputClass} placeholder="••••••••" />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-xs text-gray-700">Remember this device for 30 days</label>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {loading ? 'Signing in...' : 'Login →'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            </div>

            <button type="button" className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2 text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link href="/register" className="text-indigo-600 font-semibold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}