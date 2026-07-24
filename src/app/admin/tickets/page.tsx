"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { fullName } from "@/lib/format";

export default function AdminTicketsPage() {
  const query = useQuery({ queryKey: ["admin-tickets"], queryFn: dashboardApi.getAdminTickets });
  if (query.isLoading) return <DashboardSkeleton cards={3} />;
  if (query.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(query.error, "Tickets could not be loaded.")}</p>;
  return <section className="space-y-6"><header><p className="label-mini">Tickets</p><h1 className="mt-2 text-3xl font-black">Issued tickets</h1></header><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-[940px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Ticket #</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3">Section</th><th className="px-4 py-3">QR Status</th><th className="px-4 py-3">Payment</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{query.data?.map((ticket) => { const event = typeof ticket.eventId === "string" ? undefined : ticket.eventId; const user = typeof ticket.userId === "string" ? undefined : ticket.userId; const booking = typeof ticket.bookingId === "string" ? undefined : ticket.bookingId; return <tr key={ticket._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4 font-semibold">{ticket.ticketNumber}</td><td className="px-4 py-4">{fullName(user) || user?.email || "Customer details unavailable"}</td><td className="px-4 py-4 font-semibold">{event?.title || "Event details unavailable"}</td><td className="px-4 py-4 capitalize">{ticket.ticketTier}</td><td className="px-4 py-4">{ticket.section}</td><td className="px-4 py-4"><StatusBadge status={ticket.qrCodeData ? "valid" : "pending"} /></td><td className="px-4 py-4"><StatusBadge status={booking?.status === "confirmed" ? "paid" : booking?.status} /></td><td className="px-4 py-4"><StatusBadge status={ticket.status} /></td></tr>; })}</tbody></table>{!query.data?.length && <p className="p-8 text-center text-slate-500">No tickets issued.</p>}</div></section>;
}
