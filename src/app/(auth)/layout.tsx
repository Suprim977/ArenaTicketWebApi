import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import Logo from "@/app/__components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 p-3 dark:bg-slate-950 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-360 overflow-hidden bg-white shadow-2xl dark:bg-slate-900 dark:shadow-black/30 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.3fr_0.7fr]">
        <aside className="relative hidden overflow-hidden bg-[#eef3ff] p-12 dark:bg-slate-900 lg:flex lg:flex-col lg:items-center lg:justify-center">
          <div aria-hidden="true" className="absolute inset-0 opacity-50 bg-[radial-gradient(#2563eb_1px,transparent_1px)] bg-size-[28px_28px]" />
          <div className="relative w-full max-w-sm text-center">
            <div className="rounded-2xl bg-white px-10 py-12 shadow-xl shadow-blue-950/10 dark:bg-slate-800">
              <div className="flex justify-center"><Logo /></div>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Esports ticketing</p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-8 text-center"><p><strong className="block text-xl text-indigo-600">500+</strong><span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Annual tournaments</span></p><p><strong className="block text-xl text-indigo-600">2M+</strong><span className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Tickets secured</span></p></div>
          </div>
        </aside>

        <section className="flex min-h-full items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between md:hidden">
            <Logo />
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-slate-300">
              Home
            </Link>
          </div>
          {children}
          <div className="mt-12 border-t border-slate-100 pt-5 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500"><ShieldCheck className="mr-1 inline-block size-3" />Secure account access</div>
        </div>
        </section>
      </div>
    </div>
  );
}
