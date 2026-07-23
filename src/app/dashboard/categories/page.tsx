"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DashboardEventCard from "@/components/DashboardEventCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function CategoriesPage() {
  const [selected, setSelected] = useState("");
  const allEvents = useQuery({ queryKey: ["events"], queryFn: () => dashboardApi.getEvents() });
  const categories = [...new Set((allEvents.data ?? []).map((event) => event.category))].sort();
  const events = useQuery({
    queryKey: ["events", "category", selected],
    queryFn: () => dashboardApi.getEvents({ category: selected }),
    enabled: Boolean(selected),
  });
  const visibleEvents = selected ? events.data : allEvents.data;
  const loading = selected ? events.isLoading : allEvents.isLoading;
  const hasError = selected ? events.isError : allEvents.isError;

  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Categories</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Browse by game type</h1>
      </header>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelected(category)}
            className={`rounded-xl border px-4 py-5 text-sm font-bold transition ${
              selected === category
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <h2 className="text-xl font-bold text-slate-950 dark:text-white">{selected || "All"} Events</h2>
      {loading ? <DashboardSkeleton /> : hasError ? (
        <p className="rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">We couldn&apos;t load this category.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleEvents?.map((event) => <DashboardEventCard key={event._id || event.id} event={event} />)}
        </div>
      )}
      {!loading && !visibleEvents?.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">No {selected || "matching"} events are available.</p>}
    </section>
  );
}
