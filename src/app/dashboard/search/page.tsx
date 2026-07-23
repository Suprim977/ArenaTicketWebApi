"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useDeferredValue, useState } from "react";
import DashboardEventCard from "@/components/DashboardEventCard";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const results = useQuery({
    queryKey: ["events", "search", deferredQuery],
    queryFn: () => dashboardApi.getEvents({ search: deferredQuery }),
    enabled: deferredQuery.length > 0,
  });

  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header>
        <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Search</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Find your next event</h1>
      </header>
      <label className="relative block">
        <span className="sr-only">Search events</span>
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} className="input-shell pl-12" placeholder="Search by event, venue, or game…" autoFocus />
      </label>
      {!deferredQuery && <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500 dark:border-slate-700">Start typing to search live events.</p>}
      {results.isLoading && <DashboardSkeleton />}
      {results.isError && <p className="rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">Search is unavailable right now. Please try again.</p>}
      {deferredQuery && !results.isLoading && !results.data?.length && <p className="text-center text-slate-500">No events found for “{deferredQuery}”.</p>}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {results.data?.map((event) => <DashboardEventCard key={event._id || event.id} event={event} />)}
      </div>
    </section>
  );
}
