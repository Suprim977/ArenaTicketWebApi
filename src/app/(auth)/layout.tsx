import Logo from '../_components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visual (Dark) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-50"></div>
        <div className="relative z-10">
          <Logo />
        </div>
        <div className="relative z-10 text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-6xl">🎫</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Join the Arena</h2>
          <p className="text-gray-300 text-lg mb-8">Access exclusive tournaments and secure your spot in competitive esports history.</p>
          <div className="flex justify-center gap-8 text-sm">
            <div>
              <div className="text-3xl font-bold text-indigo-400">500+</div>
              <div className="text-gray-400">Annual Tournaments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">2M+</div>
              <div className="text-gray-400">Tickets Secured</div>
            </div>
          </div>
        </div>
        <div className="relative z-10"></div>
      </div>

      {/* Right Side - Form (White) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}