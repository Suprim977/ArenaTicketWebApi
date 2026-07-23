"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function HistoryPage() {
  const query = useQuery({ queryKey: ["bookings", "confirmed"], queryFn: () => dashboardApi.getBookings("confirmed") });
  if (query.isLoading) return <DashboardSkeleton />;
  return (
    <section className="mx-auto max-w-5xl space-y-6">
      <header><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">History</p><h1 className="mt-2 text-3xl font-black">Your confirmed bookings</h1></header>
      {query.isError && <p className="rounded-xl bg-rose-50 p-4 text-rose-700">Booking history could not be loaded.</p>}
      <div className="space-y-3">
        {query.data?.map((booking) => (
          <article key={booking._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{booking.bookingRef}</p><h2 className="mt-1 text-lg font-bold">{booking.event?.title ?? "Tournament"}</h2><p className="mt-1 text-sm text-slate-500">{booking.quantity} ticket(s) · Rs {booking.totalAmount?.toLocaleString("en-NP")}</p></div>
            <Link href={`/dashboard/ticket/${booking.bookingRef}`} className="primary-btn">View Ticket</Link>
          </article>
        ))}
      </div>
      {!query.data?.length && !query.isError && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No confirmed bookings yet.</p>}
    </section>
  );
}
