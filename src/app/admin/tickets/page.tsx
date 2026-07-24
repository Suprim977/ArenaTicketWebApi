"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function AdminTicketsPage() {
  const tickets = useQuery({ queryKey: ["admin-tickets"], queryFn: dashboardApi.getAdminTickets });
  if (tickets.isLoading) return <DashboardSkeleton cards={3} />;
  if (tickets.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(tickets.error, "Tickets could not be loaded.")}</p>;
  return <section className="space-y-6"><header><p className="label-mini">Tickets</p><h1 className="mt-2 text-3xl font-black">Sold tickets</h1></header><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Ticket number</th><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Tier</th><th className="px-4 py-3">QR</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{tickets.data?.map((ticket) => { const event = typeof ticket.eventId === "string" ? undefined : ticket.eventId; return <tr key={ticket._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4 font-semibold">{ticket.ticketNumber}</td><td className="px-4 py-4">{typeof ticket.userId === "string" ? ticket.userId : "—"}</td><td className="px-4 py-4">{event?.title ?? "—"}</td><td className="px-4 py-4 capitalize">{ticket.ticketTier}</td><td className="px-4 py-4">{ticket.qrCodeData ? "Generated" : "Missing"}</td><td className="px-4 py-4 capitalize">{ticket.status}</td></tr>; })}</tbody></table>{!tickets.data?.length && <p className="p-8 text-center text-slate-500">No tickets found.</p>}</div></section>;
}
