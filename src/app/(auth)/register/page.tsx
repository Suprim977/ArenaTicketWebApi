'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleRegisterUser } from '@/lib/actions/auth-actions';
import { useState } from 'react';
import Link from 'next/link';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    setError('');
    setLoading(true);
    const result = await handleRegisterUser(data);
    setLoading(false);
    if (!result.success) setError(result.message);
    else window.location.href = '/login';
  };

  // FIXED INPUT CLASS: Clean, thin border, no giant purple ring
  const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none transition bg-white text-gray-900 text-sm placeholder-gray-400";
  const labelClass = "block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="min-h-screen flex">
      {/* LEFT - Form (White) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-indigo-600 font-bold text-lg mb-2">ArenaTicket</h2>
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 text-sm mt-2">Join the elite arena for competitive esports ticketing and event management.</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <div className="grid grid-cols-2 gap-3">
                <input {...register('firstName')} className={inputClass} placeholder="First Name" />
                <input {...register('lastName')} className={inputClass} placeholder="Last Name" />
              </div>
              {(errors.firstName || errors.lastName) && <p className={errorClass}>Name is required</p>}
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input {...register('email')} className={inputClass} placeholder="enter your email" />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Username</label>
              <input {...register('username')} className={inputClass} placeholder="enter your username" />
              {errors.username && <p className={errorClass}>{errors.username.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Password</label>
                <input {...register('password')} type="password" className={inputClass} placeholder="••••••••" />
                {errors.password && <p className={errorClass}>{errors.password.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Confirm Password</label>
                <input {...register('confirmPassword')} type="password" className={inputClass} placeholder="••••••••" />
                {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" className="mt-1 w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500" />
              <label className="text-xs text-gray-600">
                I agree to the <span className="text-indigo-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 hover:underline cursor-pointer">Privacy Policy</span>.
              </label>
            </div>

            <button disabled={loading} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 mt-4 text-sm">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>

      {/* RIGHT - Visual (Light Blue) */}
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
    </div>
  );
}