"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, Ticket, WalletCards } from "lucide-react";
import { useState } from "react";
import DashboardEventCard from "@/components/DashboardEventCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function DashboardPage() {
  const [now] = useState(() => Date.now());
  const profile = useQuery({ queryKey: ["current-user"], queryFn: dashboardApi.getMe });
  const bookings = useQuery({ queryKey: ["bookings", "confirmed"], queryFn: dashboardApi.getConfirmedBookings });

  if (profile.isLoading || bookings.isLoading) return <DashboardSkeleton cards={4} />;

  const user = profile.data;
  const confirmed = bookings.data ?? [];
  const upcoming = confirmed.filter((booking) => new Date(booking.event?.date).getTime() >= now);
  const attended = user?.eventsAttended ?? confirmed.filter((booking) => new Date(booking.event?.date).getTime() < now).length;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Player";

  return (
    <section className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Overview</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Welcome back, {name}!</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Your tournaments and tickets, all in one place.</p>
      </header>

      {(profile.isError || bookings.isError) && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
          Some dashboard data could not be loaded. Please refresh to try again.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [Ticket, "Total Tickets", user?.totalTickets ?? confirmed.reduce((sum, item) => sum + item.quantity, 0)],
          [CalendarCheck, "Events Attended", attended],
          [WalletCards, "Balance", `Rs ${(user?.balance ?? 0).toLocaleString("en-NP")}`],
        ].map(([Icon, label, value]) => {
          const CardIcon = Icon as typeof Ticket;
          return (
            <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardIcon className="text-indigo-600" size={24} />
              <p className="mt-4 text-sm font-medium text-slate-500">{label as string}</p>
              <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value as string | number}</p>
            </article>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Upcoming Tournaments</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {upcoming.map((booking) => <DashboardEventCard key={booking._id} event={booking.event} />)}
        </div>
        {!upcoming.length && <p className="mt-4 rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">No confirmed upcoming tournaments yet.</p>}
      </div>
    </section>
  );
}
