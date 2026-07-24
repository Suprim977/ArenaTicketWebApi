"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import EventCard from "@/components/EventCard";
import EventFilterBar from "@/components/EventFilterBar";
import { getEventsAction } from "@/lib/actions/arena-action";
import type { ArenaEvent, EventCategorySummary } from "@/types/arena";
import { useEventFiltersStore } from "@/store/useEventFiltersStore";

export default function SearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto min-h-screen max-w-6xl px-6 py-10" />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = useEventFiltersStore((state) => state.query);
  const category = useEventFiltersStore((state) => state.category);
  const setCategory = useEventFiltersStore((state) => state.setCategory);
  const [events, setEvents] = useState<ArenaEvent[]>([]);
  const [categories, setCategories] = useState<EventCategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams, setCategory]);

  useEffect(() => {
    void getEventsAction().then((result) => {
      if (!result.ok) {
        setError("Events could not be loaded.");
        setLoading(false);
        return;
      }
      const apiEvents = result.data ?? [];
      setEvents(apiEvents);
      const uniqueCategories = [...new Set(apiEvents.map((event) => event.category))];
      setCategories(uniqueCategories.map((name) => ({
        name,
        label: name,
        description: `${name} events`,
        count: apiEvents.filter((event) => event.category === name).length,
      })));
      setLoading(false);
    });
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesQuery = [event.title, event.venue, event.city, event.description].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || event.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, events, query]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-6 py-10">
      <SectionHeader
        eyebrow="Search"
        title="Find an event faster"
        description="Use the search box to narrow events by venue, city, or title, then jump straight into the detail page."
      />

      <EventFilterBar categories={categories} />

      {loading && <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading events...</p>}
      {error && !loading && <p className="rounded-xl bg-rose-50 p-4 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">Events could not be loaded.</p>}
      {!loading && !error && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}</div>}
      {!loading && !error && !filteredEvents.length && <p className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">No upcoming events available.</p>}
    </main>
  );
}
