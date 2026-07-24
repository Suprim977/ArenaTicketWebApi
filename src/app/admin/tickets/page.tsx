"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function AdminTicketsPage() {
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: dashboardApi.getAdminBookings });
  if (bookings.isLoading) return <DashboardSkeleton cards={3} />;
  if (bookings.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(bookings.error, "Tickets could not be loaded.")}</p>;
  const confirmed = bookings.data?.filter((booking) => booking.status === "confirmed") ?? [];
  return <section className="space-y-6"><header><p className="label-mini">Tickets</p><h1 className="mt-2 text-3xl font-black">Sold tickets</h1></header><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Reference</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Quantity</th></tr></thead><tbody>{confirmed.map((booking) => <tr key={booking._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4">{booking.bookingRef}</td><td className="px-4 py-4 font-semibold">{booking.event?.title ?? "—"}</td><td className="px-4 py-4">{booking.attendeeName ?? booking.user?.email ?? "—"}</td><td className="px-4 py-4">{booking.tier ?? "—"}</td><td className="px-4 py-4">{booking.quantity}</td></tr>)}</tbody></table>{!confirmed.length && <p className="p-8 text-center text-slate-500">No confirmed tickets found.</p>}</div></section>;
}
