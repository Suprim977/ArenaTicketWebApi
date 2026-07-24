"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ClipboardList, ShieldCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import DashboardEventCard from "@/components/DashboardEventCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { formatDate, formatMoney } from "@/lib/format";

export default function DashboardPage() {
  const [now] = useState(() => Date.now());
  const profile = useQuery({ queryKey: ["current-user"], queryFn: dashboardApi.getMe });
  const events = useQuery({ queryKey: ["events"], queryFn: () => dashboardApi.getEvents() });
  const bookings = useQuery({ queryKey: ["bookings"], queryFn: () => dashboardApi.getBookings() });
  const tickets = useQuery({ queryKey: ["tickets"], queryFn: dashboardApi.getTickets });

  if ([profile, events, bookings, tickets].some((query) => query.isLoading)) {
    return <DashboardSkeleton cards={4} />;
  }

  const bookingRows = bookings.data ?? [];
  const ticketRows = tickets.data ?? [];
  const upcoming = (events.data ?? [])
    .filter((event) => new Date(event.date).getTime() >= now && event.status !== "cancelled")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  const recent = bookingRows.slice(0, 5);
  const confirmedTickets = ticketRows.filter((ticket) => ticket.status === "valid").length;
  const firstName = profile.data?.firstName || "Player";

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Overview</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Welcome back, {firstName}</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Manage bookings and access your ArenaTicket passes.</p>
      </header>

      {[profile, events, bookings, tickets].some((query) => query.isError) && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          Some live dashboard data could not be loaded. Refresh to try again.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [CalendarDays, "Upcoming Events", upcoming.length],
          [ClipboardList, "My Bookings", bookingRows.length],
          [Ticket, "My Tickets", ticketRows.length],
          [ShieldCheck, "Confirmed Tickets", confirmedTickets],
        ].map(([Icon, label, value]) => {
          const CardIcon = Icon as typeof Ticket;
          return (
            <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardIcon className="text-indigo-600" size={24} />
              <p className="mt-4 text-sm font-medium text-slate-500">{label as string}</p>
              <p className="mt-1 text-2xl font-black">{value as number}</p>
            </article>
          );
        })}
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div><p className="label-mini">Discover</p><h2 className="mt-1 text-xl font-bold">Upcoming Events</h2></div>
          <Link href="/dashboard/events" className="text-sm font-bold text-indigo-600">View all</Link>
        </div>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((event) => <DashboardEventCard key={event._id} event={event} />)}
        </div>
        {!upcoming.length && <p className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">No upcoming events.</p>}
      </div>

      <div>
        <div className="flex items-end justify-between gap-4">
          <div><p className="label-mini">Activity</p><h2 className="mt-1 text-xl font-bold">Recent Bookings</h2></div>
          <Link href="/dashboard/history" className="text-sm font-bold text-indigo-600">View all</Link>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          {recent.map((booking) => (
            <article key={booking._id} className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-0 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">{booking.event?.title || "Event details unavailable"}</p>
                <p className="mt-1 text-sm text-slate-500">{booking.bookingRef} · {booking.tier || "Ticket"} × {booking.quantity} · {formatDate(booking.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3"><StatusBadge status={booking.status} /><strong>{formatMoney(booking.totalAmount)}</strong></div>
            </article>
          ))}
          {!recent.length && <p className="p-8 text-center text-slate-500">No bookings yet.</p>}
        </div>
      </div>
    </section>
  );
}
