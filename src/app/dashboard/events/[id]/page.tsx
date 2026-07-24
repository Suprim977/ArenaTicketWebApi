"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const query = useQuery({ queryKey: ["event", id], queryFn: () => dashboardApi.getEvent(id) });

  if (query.isLoading) return <DashboardSkeleton />;
  if (!query.data || query.isError) return <p className="rounded-xl bg-rose-50 p-5 text-rose-700">This event could not be loaded.</p>;
  const event = query.data;
  const tiers = event.tiers ?? [];

  return (
    <section className="mx-auto max-w-5xl space-y-7">
      <Link href="/dashboard/events" className="text-sm font-semibold text-indigo-600">← Back to events</Link>
      <div className="overflow-hidden rounded-3xl bg-linear-to-br from-indigo-700 to-violet-800 p-8 text-white sm:p-12">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">{event.category}</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">{event.title}</h1>
        <p className="mt-5 max-w-3xl text-indigo-100">{event.description}</p>
        <div className="mt-7 flex flex-wrap gap-5 text-sm">
          <span className="flex items-center gap-2"><CalendarDays size={18} /> {new Date(event.date).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}</span>
          <span className="flex items-center gap-2"><MapPin size={18} /> {[event.venue, event.city].filter(Boolean).join(", ")}</span>
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-black text-slate-950 dark:text-white">Choose your tier</h2>
        {!tiers.length && <p className="mt-4 rounded-xl bg-amber-50 p-4 text-amber-700">Ticket pricing is not configured for this event.</p>}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {tiers.map((tier) => (
            <article key={tier.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <p className="mt-2 text-2xl font-black text-indigo-600">Rs {tier.price.toLocaleString("en-NP")}</p>
              {tier.available != null && <p className="mt-2 text-sm text-slate-500">{tier.available} remaining</p>}
              <Link href={`/dashboard/booking?eventId=${id}&tier=${encodeURIComponent(tier.name)}`} className="primary-btn mt-5 w-full">Select {tier.name}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
