import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <p className="label-mini">Profile</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">Your ArenaTicket account</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">Update your personal details, keep your fan tag current, and manage the account that powers every ticket purchase.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link href="/dashboard/profile" className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-900 transition hover:border-blue-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <p className="text-sm font-semibold">Edit profile</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Update name, avatar, and Arena Tag.</p>
          </Link>
          <Link href="/dashboard/password" className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-900 transition hover:border-blue-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <p className="text-sm font-semibold">Change password</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Keep the account secure.</p>
          </Link>
          <Link href="/history" className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-900 transition hover:border-blue-200 hover:bg-white dark:border-slate-800 dark:bg-slate-950 dark:text-white">
            <p className="text-sm font-semibold">Booking history</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Open recent tickets and confirmations.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
