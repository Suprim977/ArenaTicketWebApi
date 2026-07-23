import Link from "next/link";
import Logo from "../_components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-white px-10 py-12 dark:bg-slate-950 md:flex">
        <div>
          <Logo />
          <div className="mt-16 max-w-sm space-y-3">
            <p className="label-mini">ArenaTicket Access</p>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Plan your next arena night.</h1>
            <p className="text-slate-600 dark:text-slate-300">Sign in to manage tickets, update your profile, and keep your account in sync.</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Need help? Contact support@arenaticket.local</p>
      </aside>

      <section className="flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08),transparent_38%),linear-gradient(180deg,#eff6ff_0%,#ffffff_100%)] px-5 py-8 dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.14),transparent_38%),linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
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
