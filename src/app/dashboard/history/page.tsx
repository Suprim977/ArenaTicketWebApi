"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { formatDate, formatMoney } from "@/lib/format";

export default function HistoryPage() {
  const query = useQuery({ queryKey: ["bookings"], queryFn: () => dashboardApi.getBookings() });
  if (query.isLoading) return <DashboardSkeleton />;
  if (query.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(query.error, "Bookings could not be loaded.")}</p>;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header><p className="label-mini">My Bookings</p><h1 className="mt-2 text-3xl font-black">Booking history</h1><p className="mt-2 text-slate-500">Every booking and its latest payment status.</p></header>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-[920px] w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Booking status</th><th className="px-4 py-3">Date</th><th className="px-4 py-3"></th></tr></thead>
          <tbody>{query.data?.map((booking) => (
            <tr key={booking._id} className="border-t border-slate-100 dark:border-slate-800">
              <td className="px-4 py-4 font-bold">{booking.event?.title || "Event details unavailable"}</td>
              <td className="px-4 py-4 font-mono text-xs">{booking.bookingRef}</td>
              <td className="px-4 py-4 capitalize">{booking.tier || "Ticket"} × {booking.quantity}</td>
              <td className="px-4 py-4 font-semibold">{formatMoney(booking.totalAmount)}</td>
              <td className="px-4 py-4"><p className="capitalize">{booking.paymentMethod}</p><StatusBadge status={booking.paymentStatus || (booking.status === "confirmed" ? "paid" : "pending")} /></td>
              <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
              <td className="px-4 py-4">{formatDate(booking.createdAt)}</td>
              <td className="px-4 py-4">{booking.status === "confirmed" && <Link href={`/dashboard/ticket/${booking.bookingRef}`} className="font-bold text-indigo-600">View ticket</Link>}</td>
            </tr>
          ))}</tbody>
        </table>
        {!query.data?.length && <div className="p-10 text-center"><p className="font-semibold">No bookings yet</p><Link href="/dashboard/events" className="mt-3 inline-block text-sm font-bold text-indigo-600">Browse events</Link></div>}
      </div>
    </section>
  );
}
