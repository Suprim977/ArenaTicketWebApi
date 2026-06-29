import Link from "next/link";
import Logo from "../_components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-white px-10 py-12 md:flex">
        <div>
          <Logo />
          <div className="mt-16 max-w-sm space-y-3">
            <p className="label-mini">ArenaTicket Identity</p>
            <h1 className="text-4xl font-black text-gray-900">Welcome to the esports gate.</h1>
            <p className="text-gray-600">Sign in to manage your profile, update credentials, and access arena administration.</p>
          </div>
        </div>
        <p className="text-sm text-gray-500">Need help? Contact support@arenaticket.local</p>
      </aside>

      <section className="flex items-center justify-center bg-[#F3F4F6] px-5 py-8">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-card">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo />
            <Link href="/" className="text-sm font-medium text-gray-600">
              Home
            </Link>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
