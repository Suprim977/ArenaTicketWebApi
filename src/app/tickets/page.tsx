"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/app/__components/Logo";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import TicketQR from "@/components/TicketQR";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { Event } from "@/types/event";

export default function TicketsPage() {
  const router = useRouter();
  const tickets = useQuery({ queryKey: ["tickets"], queryFn: dashboardApi.getTickets });
  if (tickets.isLoading) return <main className="mx-auto max-w-6xl px-6 py-10"><DashboardSkeleton cards={3} /></main>;
  if (tickets.isError) return <main className="mx-auto max-w-6xl px-6 py-10"><p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(tickets.error, "Tickets could not be loaded.")}</p></main>;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <button
        type="button"
        onClick={() => {
          if (window.history.length > 1) router.back();
          else router.push("/dashboard");
        }}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-700 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
        aria-label="Go back to the previous page"
      >
        <ArrowLeft size={17} aria-hidden />
        Go Back
      </button>
      <header><p className="label-mini">My Tickets</p><h1 className="mt-2 text-3xl font-black">Your QR tickets</h1><p className="mt-2 text-sm text-slate-500">Confirmed tickets issued after successful payment.</p></header>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {tickets.data?.map((ticket) => {
          const event = typeof ticket.eventId === "object" ? ticket.eventId as Event & { location?: string } : undefined;
          const booking = typeof ticket.bookingId === "object" ? ticket.bookingId : undefined;
          return <article key={ticket._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-5 border-b border-slate-100 pb-4 dark:border-slate-800"><Logo /></div><div className="grid gap-5 sm:grid-cols-[9rem_1fr]"><TicketQR code={ticket.qrToken || ticket.ticketNumber} qrCodeData={ticket.qrCodeData} /><div><p className="text-xs font-bold uppercase tracking-wider text-indigo-600">{ticket.ticketNumber}</p><h2 className="mt-2 text-xl font-black">{event?.title ?? "ArenaTicket Event"}</h2><dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Tier</dt><dd className="font-semibold capitalize">{ticket.ticketTier}</dd></div><div><dt className="text-slate-500">Section</dt><dd className="font-semibold">{ticket.section}</dd></div><div><dt className="text-slate-500">Quantity</dt><dd className="font-semibold">{ticket.quantity}</dd></div><div><dt className="text-slate-500">Payment</dt><dd className="font-semibold text-emerald-600">Paid</dd></div><div><dt className="text-slate-500">Date</dt><dd className="font-semibold">{event?.date ? new Date(event.date).toLocaleDateString() : "TBA"}</dd></div><div><dt className="text-slate-500">Time</dt><dd className="font-semibold">{event?.date ? new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "TBA"}</dd></div><div><dt className="text-slate-500">Status</dt><dd className="font-semibold capitalize">{booking?.status ?? ticket.status}</dd></div></dl><p className="mt-3 text-sm text-slate-500">{event?.venue ?? event?.location ?? "Venue TBA"}</p><Link href={`/tickets/${ticket._id}`} className="primary-btn mt-4">Open Ticket</Link></div></div></article>;
        })}
      </div>
      {!tickets.data?.length && <p className="mt-7 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">No paid tickets yet.</p>}
    </main>
  );
}
