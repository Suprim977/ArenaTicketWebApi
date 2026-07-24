"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { formatDate, formatMoney, fullName } from "@/lib/format";

export default function AdminBookingsPage() {
  const query = useQuery({ queryKey: ["admin-bookings"], queryFn: dashboardApi.getAdminBookings });
  if (query.isLoading) return <DashboardSkeleton cards={3} />;
  if (query.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(query.error, "Bookings could not be loaded.")}</p>;
  return <section className="space-y-6"><header><p className="label-mini">Bookings</p><h1 className="mt-2 text-3xl font-black">All bookings</h1></header><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-[980px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Ticket</th><th className="px-4 py-3">Quantity</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead><tbody>{query.data?.map((booking) => <tr key={booking._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4"><p className="font-semibold">{fullName(booking.user) || booking.attendeeName || "Customer details unavailable"}</p><p className="text-xs text-slate-500">{booking.user?.email || booking.attendeeEmail}</p></td><td className="px-4 py-4 font-semibold">{booking.event?.title || "Event details unavailable"}</td><td className="px-4 py-4 capitalize">{booking.tier || "Ticket"}</td><td className="px-4 py-4">{booking.quantity}</td><td className="px-4 py-4 font-semibold">{formatMoney(booking.totalAmount)}</td><td className="px-4 py-4"><p className="capitalize">{booking.paymentMethod}</p><StatusBadge status={booking.paymentStatus || (booking.status === "confirmed" ? "paid" : "pending")} /></td><td className="px-4 py-4"><StatusBadge status={booking.status} /></td><td className="px-4 py-4">{formatDate(booking.createdAt)}</td></tr>)}</tbody></table>{!query.data?.length && <p className="p-8 text-center text-slate-500">No bookings yet.</p>}</div></section>;
}
