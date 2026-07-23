"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardEventCard from "@/components/DashboardEventCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function EventsPage() {
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const events = useQuery({
    queryKey: ["events", { category, date }],
    queryFn: () => dashboardApi.getEvents({ category: category || undefined, date: date || undefined }),
  });

  const categories = [...new Set((events.data ?? []).map((event) => event.category))].sort();

  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Events</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Upcoming Tournaments</h1>
        <p className="mt-2 text-slate-500">Find the next arena worth showing up for.</p>
      </header>
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Category
          <select className="input-shell mt-2" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Date
          <input className="input-shell mt-2" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      </div>
      {events.isLoading ? <DashboardSkeleton /> : events.isError ? (
        <p className="rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">We couldn&apos;t load events. Please try again.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.data?.map((event) => <DashboardEventCard key={event._id || event.id} event={event} />)}
        </div>
      )}
      {!events.isLoading && !events.data?.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">No events match these filters.</p>}
    </section>
  );
}
