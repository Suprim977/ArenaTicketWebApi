"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { formatDate, formatMoney, fullName } from "@/lib/format";

const providerName = (method: string) => method === "esewa" ? "eSewa" : method.charAt(0).toUpperCase() + method.slice(1);

export default function AdminHomePage() {
  const [now] = useState(() => Date.now());
  const stats = useQuery({ queryKey: ["admin-dashboard"], queryFn: dashboardApi.getAdminDashboard });
  const events = useQuery({ queryKey: ["admin-events"], queryFn: dashboardApi.getAdminEvents });
  const bookings = useQuery({ queryKey: ["admin-bookings"], queryFn: dashboardApi.getAdminBookings });
  if (stats.isLoading || events.isLoading || bookings.isLoading) return <DashboardSkeleton cards={5} />;

  const totals = stats.data;
  const upcoming = (events.data ?? []).filter((event) => new Date(event.date).getTime() >= now).slice(0, 5);
  const recent = [...(bookings.data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return <section className="space-y-8">
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="label-mini">Admin Dashboard</p><h1 className="mt-2 text-3xl font-black">ArenaTicket control room</h1><p className="mt-2 text-sm text-slate-500">Live management data from the ArenaTicket backend.</p></div><Link href="/admin/events/create" className="primary-btn">Create Event</Link></header>
    {(stats.isError || events.isError || bookings.isError) && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">Some management data could not be loaded. Refresh to try again.</p>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Total Events" value={String(totals?.totalEvents ?? 0)} helper="All event records" /><StatCard label="Total Users" value={String(totals?.totalUsers ?? 0)} helper="Registered accounts" /><StatCard label="Total Bookings" value={String(totals?.totalBookings ?? 0)} helper="All reservations" /><StatCard label="Tickets Sold" value={String(totals?.ticketsSold ?? 0)} helper="Confirmed tickets" /><StatCard label="Total Revenue" value={formatMoney(totals?.totalRevenue)} helper="Successful payments" /></div>
    <div className="grid gap-6 lg:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Upcoming Events</h2><Link href="/admin/events" className="text-sm font-semibold text-indigo-600">View all</Link></div><div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">{upcoming.map((event) => <div key={event._id} className="flex justify-between gap-4 py-3"><div><p className="font-semibold">{event.title}</p><p className="text-xs text-slate-500">{event.venue}</p></div><time className="text-sm text-slate-500">{formatDate(event.date)}</time></div>)}{!upcoming.length && <p className="py-6 text-sm text-slate-500">No upcoming events.</p>}</div></article>
      <article className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><h2 className="text-lg font-bold">Recent Bookings</h2><Link href="/admin/bookings" className="text-sm font-semibold text-indigo-600">View all</Link></div><div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">{recent.map((booking) => <div key={booking._id} className="py-4"><div className="flex justify-between gap-4"><div><p className="font-semibold">{booking.event?.title || "Event details unavailable"}</p><p className="mt-1 text-xs text-slate-500">{fullName(booking.user) || booking.user?.email || booking.attendeeName || "Customer details unavailable"} · {booking.tier || "Ticket"} × {booking.quantity}</p></div><p className="whitespace-nowrap text-sm font-bold">{formatMoney(booking.totalAmount)}</p></div><div className="mt-2 flex items-center gap-2 text-xs"><span className="font-semibold">{providerName(booking.paymentMethod)}</span><span>·</span><StatusBadge status={booking.status === "confirmed" ? "paid" : "pending"} /><StatusBadge status={booking.status} /></div></div>)}{!recent.length && <p className="py-6 text-sm text-slate-500">No recent bookings.</p>}</div></article>
    </div>
  </section>;
}
