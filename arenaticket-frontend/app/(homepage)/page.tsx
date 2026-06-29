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
          <h1 className="text-4xl font-black leading-tight text-gray-900 md:text-5xl">
            Reserve your next esports arena experience.
          </h1>
          <p className="max-w-md text-gray-600">
            Access matches, manage profile details, and control users through one crisp control panel.
          </p>
          <div className="flex gap-3">
            <Link href="/login" className="primary-btn">
              Enter Arena
            </Link>
            <Link href="/register" className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700">
              Create Account
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-fuchsia-50 p-8 shadow-card">
          <h2 className="text-xl font-bold text-gray-900">Live Arena Control</h2>
          <p className="mt-3 text-sm text-gray-600">
            Track members, update avatars, and run secure admin operations with role-based access.
          </p>
          <div className="mt-8 grid gap-4 text-sm">
            <div className="rounded-xl bg-white p-4 shadow-sm">JWT protected auth and profile actions</div>
            <div className="rounded-xl bg-white p-4 shadow-sm">Paginated admin users with quick search</div>
            <div className="rounded-xl bg-white p-4 shadow-sm">Responsive split auth pages tailored for speed</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
