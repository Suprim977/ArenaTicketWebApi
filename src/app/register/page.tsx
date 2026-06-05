'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords don't match",
  path: ["confirm"],
});

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => { newErrors[err.path[0] as string] = err.message; });
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const response = await api.register({ fullName: formData.fullName, email: formData.email, password: formData.password });
      if (response.error) {
        setErrors({ email: response.error });
      } else {
        router.push('/login?registered=true');
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-600 mb-2">ArenaTicket</h2>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-2">Join the elite arena for competitive esports ticketing</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              value={formData.email} 
              onChange={handleChange}
              placeholder="john@example.com"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              name="password" 
              type="password" 
              value={formData.password} 
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <input 
              name="confirm" 
              type="password" 
              value={formData.confirm} 
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${errors.confirm ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-indigo-500'}`} 
            />
            {errors.confirm && <p className="text-red-500 text-xs mt-1">{errors.confirm}</p>}
          </div>

          <button 
            disabled={loading} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          {errors.submit && <p className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">{errors.submit}</p>}
        </form>

        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">Login</Link>
        </p>
      </div>
    </div>
  );
}