import Link from "next/link";
import Footer from "../_components/Footer";
import Navbar from "../_components/Navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
        <div className="space-y-6">
          <p className="label-mini">ArenaTicket Platform</p>
          <h1 className="max-w-xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
            Book your seat for the biggest esports moments.
          </h1>
          <p className="max-w-md text-slate-600">
            Discover live events, secure your ticket, and manage your ArenaTicket account from one focused frontend.
          </p>
          <div className="flex gap-3">
            <Link href="/events" className="primary-btn">
              Explore Events
            </Link>
            <Link href="/register" className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-arena-indigo">
              Create Account
            </Link>
          </div>
        </div>
        <div className="rounded-[2rem] border border-blue-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(239,246,255,0.95))] p-8 shadow-card">
          <h2 className="text-xl font-bold text-slate-900">Live Arena Control</h2>
          <p className="mt-3 text-sm text-slate-600">
            Browse events, reserve seats, scan QR tickets, and manage admin operations with role-based access.
          </p>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="rounded-xl bg-white p-4 shadow-sm">Auth, registration, and password recovery</div>
            <div className="rounded-xl bg-white p-4 shadow-sm">Event discovery, booking, and QR tickets</div>
            <div className="rounded-xl bg-white p-4 shadow-sm">Admin dashboards for users, bookings, and payments</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
