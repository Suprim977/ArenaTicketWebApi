"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import Logo from "@/app/__components/Logo";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import TicketQR from "@/components/TicketQR";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const tickets = useQuery({ queryKey: ["tickets"], queryFn: dashboardApi.getTickets });
  if (tickets.isLoading) return <main className="mx-auto max-w-4xl px-6 py-10"><DashboardSkeleton cards={1} /></main>;
  if (tickets.isError) return <main className="mx-auto max-w-4xl px-6 py-10"><p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(tickets.error, "Ticket could not be loaded.")}</p></main>;
  const ticket = tickets.data?.find((item) => item._id === id || item.id === id || item.ticketNumber === id);
  if (!ticket) return <main className="mx-auto max-w-4xl px-6 py-10"><p className="rounded-xl bg-rose-50 p-4 text-rose-700">Ticket not found.</p></main>;
  const event = typeof ticket.eventId === "object" ? ticket.eventId as typeof ticket.eventId & { location?: string } : undefined;
  const booking = typeof ticket.bookingId === "object" ? ticket.bookingId : undefined;
  const holder = [user?.firstName, user?.lastName, user?.person?.firstName, user?.person?.lastName].filter(Boolean).join(" ") || user?.email || "ArenaTicket holder";

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="flex items-center justify-between border-b border-slate-200 p-6 dark:border-slate-800"><Logo /><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase text-emerald-700">Paid</span></header>
        <div className="grid gap-8 p-7 md:grid-cols-[19rem_1fr]">
          <div><TicketQR code={ticket.qrToken || ticket.ticketNumber} qrCodeData={ticket.qrCodeData} /><p className="mt-4 text-center font-mono text-sm font-bold">{ticket.ticketNumber}</p><p className="mt-2 text-center text-xs text-slate-500">Scan this code to verify entry.</p></div>
          <div><p className="label-mini">Digital Ticket</p><h1 className="mt-2 text-3xl font-black">{event?.title ?? "ArenaTicket Event"}</h1><dl className="mt-6 grid gap-4 sm:grid-cols-2">{[
            ["Ticket holder", holder],
            ["Ticket tier", ticket.ticketTier],
            ["Section", ticket.section],
            ["Quantity", ticket.quantity],
            ["Date", event?.date ? new Date(event.date).toLocaleDateString() : "TBA"],
            ["Time", event?.date ? new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : event?.startTime || "TBA"],
            ["Venue", event?.venue || event?.location || "TBA"],
            ["Booking status", booking?.status || "confirmed"],
            ["Payment status", "paid"],
          ].map(([label, value]) => <div key={String(label)} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt><dd className="mt-1 font-semibold capitalize">{value}</dd></div>)}</dl><Link href="/tickets" className="primary-btn mt-6">Back to My Tickets</Link></div>
        </div>
      </div>
    </main>
  );
}
