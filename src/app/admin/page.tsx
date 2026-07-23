import Link from "next/link";
import StatCard from "@/components/StatCard";
import { mockMetrics } from "@/lib/mock/arena-data";

export default function AdminHomePage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-mini">Admin</p>
          <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">ArenaTicket administration</h2>
          <p className="mt-3 max-w-2xl text-sm text-gray-600 dark:text-slate-300">Monitor events, users, bookings, and payments from one control room.</p>
        </div>
        <Link href="/admin/users" className="primary-btn w-fit">
          Open Users
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockMetrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} helper={metric.helper} />
        ))}
      </div>
    </section>
  );
}
