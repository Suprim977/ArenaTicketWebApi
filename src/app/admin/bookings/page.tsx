import StatCard from "@/components/StatCard";

export default function AdminBookingsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="label-mini">Bookings</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Review bookings</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Track confirmation state, ticket delivery, and attendee issues.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Confirmed" value="1,108" helper="Successful reservations" />
        <StatCard label="Pending" value="42" helper="Awaiting payment" />
        <StatCard label="Cancelled" value="13" helper="User cancellations" />
      </div>
      <div className="rounded-[1.5rem] border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-gray-600 dark:text-slate-300">Booking management tables can be connected to the backend here.</p>
      </div>
    </section>
  );
}
