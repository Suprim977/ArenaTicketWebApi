"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import TicketQR from "@/components/TicketQR";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { Event } from "@/types/event";

export default function TicketsPage() {
  const tickets = useQuery({ queryKey: ["tickets"], queryFn: dashboardApi.getTickets });
  if (tickets.isLoading) return <main className="mx-auto max-w-6xl px-6 py-10"><DashboardSkeleton cards={3} /></main>;
  if (tickets.isError) return <main className="mx-auto max-w-6xl px-6 py-10"><p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(tickets.error, "Tickets could not be loaded.")}</p></main>;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <header><p className="label-mini">My Tickets</p><h1 className="mt-2 text-3xl font-black">Your QR tickets</h1><p className="mt-2 text-sm text-slate-500">Confirmed tickets issued after successful payment.</p></header>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {tickets.data?.map((ticket) => {
          const event = typeof ticket.eventId === "object" ? ticket.eventId as Event & { location?: string } : undefined;
          const booking = typeof ticket.bookingId === "object" ? ticket.bookingId : undefined;
          return <article key={ticket._id} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-[9rem_1fr]"><TicketQR code={ticket.qrToken || ticket.ticketNumber} qrCodeData={ticket.qrCodeData} /><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{ticket.ticketNumber}</p><h2 className="mt-2 text-xl font-black">{event?.title ?? "ArenaTicket Event"}</h2><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Tier</dt><dd className="font-semibold capitalize">{ticket.ticketTier}</dd></div><div><dt className="text-slate-500">Section</dt><dd className="font-semibold">{ticket.section}</dd></div><div><dt className="text-slate-500">Quantity</dt><dd className="font-semibold">{ticket.quantity}</dd></div><div><dt className="text-slate-500">Payment</dt><dd className="font-semibold text-emerald-600">Paid</dd></div><div><dt className="text-slate-500">Date</dt><dd className="font-semibold">{event?.date ? new Date(event.date).toLocaleDateString() : "TBA"}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="font-semibold capitalize">{booking?.status ?? ticket.status}</dd></div></dl><p className="mt-3 text-sm text-slate-500">{event?.venue ?? event?.location ?? "Venue TBA"}</p><Link href={`/tickets/${ticket._id}`} className="primary-btn mt-4">Open Ticket</Link></div></article>;
        })}
      </div>
      {!tickets.data?.length && <p className="mt-7 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No paid tickets yet.</p>}
    </main>
  );
}
