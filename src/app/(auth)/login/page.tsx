'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleLoginUser } from '@/lib/actions/auth-actions';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await handleLoginUser(formData);
      
      if (result.success && result.data?.user) {
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('token', result.data.token);
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(result.message || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err?.message || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 focus:outline-none transition-all duration-200 text-sm font-medium placeholder-gray-400";
  const labelClass = "block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider";

  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden lg:flex lg:w-1/2 bg-[#f8fafc] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4f46e5]/5 to-transparent"></div>
        <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 flex flex-col items-center z-10 border border-gray-100">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 mb-6">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <p className="text-gray-900 font-bold text-xl tracking-tight">ArenaTicket</p>
          <p className="text-gray-400 text-xs mt-2 font-medium">Elite Esports Platform</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 text-base mt-3 leading-relaxed">Access your arena pass and upcoming tournament schedule.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 mb-8 flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label className={labelClass}>Email Address</label>
              <input 
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputClass} 
                autoComplete="email" 
                placeholder="name@company.com"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={labelClass}>Password</label>
                <Link href="/forgot-password" className="text-xs font-bold text-[#4f46e5] hover:text-[#4338ca] transition-colors">Forgot password?</Link>
              </div>
              <input 
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={inputClass} 
                autoComplete="current-password" 
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" />
              <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer select-none">Remember this device for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={loading} 
              className="w-full bg-[#4f46e5] text-white py-4 rounded-xl font-bold text-base hover:bg-[#4338ca] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Login <span className="ml-1">→</span></>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">Or continue with</span></div>
          </div>

          <button type="button" className="w-full border border-gray-200 bg-white text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-500 mt-8 font-medium">
            Don't have an account? <Link href="/register" className="text-[#4f46e5] font-bold hover:text-[#4338ca] transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}