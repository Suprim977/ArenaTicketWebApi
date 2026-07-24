"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function AdminBookingsPage() {
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: dashboardApi.getAdminBookings });
  if (bookings.isLoading) return <DashboardSkeleton cards={3} />;
  if (bookings.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(bookings.error, "Bookings could not be loaded.")}</p>;

  return (
    <section className="space-y-6">
      <header><p className="label-mini">Bookings</p><h1 className="mt-2 text-3xl font-black">All bookings</h1></header>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Ticket type</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>{bookings.data?.map((booking) => <tr key={booking._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4">{booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : booking.attendeeName ?? "—"}</td><td className="px-4 py-4 font-semibold">{booking.event?.title ?? "—"}</td><td className="px-4 py-4">{booking.tier ?? "—"}</td><td className="px-4 py-4">{booking.quantity}</td><td className="px-4 py-4">Rs {booking.totalAmount?.toLocaleString("en-NP") ?? "—"}</td><td className="px-4 py-4">—</td><td className="px-4 py-4 capitalize">{booking.status}</td><td className="px-4 py-4">{new Date(booking.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
        {!bookings.data?.length && <p className="p-8 text-center text-slate-500">No bookings found.</p>}
      </div>
    </section>
  );
}
