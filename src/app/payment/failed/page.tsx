import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <section className="rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl dark:border-rose-900 dark:bg-slate-900">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-rose-100 text-3xl text-rose-700">×</div>
        <p className="mt-5 text-sm font-bold uppercase tracking-widest text-rose-600">Payment failed</p>
        <h1 className="mt-2 text-3xl font-black">Your payment was not completed</h1>
        <p className="mt-3 text-slate-500">No ticket has been issued. Return to events and try again, or choose another payment method.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/dashboard/events" className="primary-btn">Back to Events</Link><Link href="/bookings" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">My Bookings</Link></div>
      </section>
    </main>
  );
}
