'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  // Handle form submit and redirect to login
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Stop page from reloading
    router.push('/login'); // Redirect to login page
  };

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <h2 className="text-xl font-bold text-indigo-600 mb-2">ArenaTicket</h2>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 mb-8 text-sm">Join the elite arena for competitive esports ticketing and event management.</p>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Full Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                required
              />
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                  required
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                  required
                />
              </div>

            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" id="terms" className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600" required />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
              </label>
            </div>

            {/* Register Button */}
            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
              Sign Up
            </button>

          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* Right Side - Logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="bg-white p-12 rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-b from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">ArenaTicket</h2>
        </div>
      </div>

    </div>
  );
}