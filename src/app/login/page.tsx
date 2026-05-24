import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      
      {/* Left Side - Logo & Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12">
        <div className="text-center">
          
          {/* Logo */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="w-20 h-20 bg-gradient-to-b from-purple-600 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">ArenaTicket</h2>
          </div>

          {/* Stats */}
          <div className="flex gap-12 text-gray-600">
            <div>
              <div className="text-3xl font-bold text-gray-800">500+</div>
              <div className="text-sm">Annual Tournaments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">2M+</div>
              <div className="text-sm">Tickets Secured</div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500 mb-8 text-sm">Access your arena pass and upcoming tournament schedule.</p>

          {/* Form */}
          <form className="space-y-5">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-gray-700 uppercase">Password</label>
                <a href="#" className="text-xs text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <input 
                type="password" 
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white text-gray-900"
                required
              />
            </div>

            {/* Login Button */}
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium">
              Login →
            </button>

          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </p>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-gray-600">Privacy Policy</a>
              <a href="#" className="hover:text-gray-600">Terms of Service</a>
              <a href="#" className="hover:text-gray-600">Support</a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}