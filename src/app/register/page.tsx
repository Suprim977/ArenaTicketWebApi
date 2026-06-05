'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { api } from '@/lib/api';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
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
      result.error.errors.forEach((err) => { newErrors[err.path[0] as string] = err.message; });
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
      setErrors({ submit: 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input name="fullName" value={formData.fullName} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input name="confirm" type="password" value={formData.confirm} onChange={handleChange} className={`w-full border rounded px-3 py-2 ${errors.confirm ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
          </div>
          <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Registering...' : 'Register'}
          </button>
          {errors.submit && <p className="text-red-500 text-center text-sm">{errors.submit}</p>}
        </form>
        <p className="text-center mt-4 text-sm">Already have an account? <Link href="/login" className="text-blue-600">Login</Link></p>
      </div>
    </div>
  );
}