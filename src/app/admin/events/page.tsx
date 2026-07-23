import StatCard from "@/components/StatCard";

export default function AdminEventsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="label-mini">Events</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Manage event listings</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Create, update, publish, or retire esports events from the admin panel.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Published" value="18" helper="Visible in the marketplace" />
        <StatCard label="Drafts" value="6" helper="Waiting on approval" />
        <StatCard label="Sold out" value="4" helper="Fully booked events" />
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-gray-600 dark:text-slate-300">Event CRUD forms can be connected to your backend endpoints here.</p>
      </div>
    </section>
  );
}
