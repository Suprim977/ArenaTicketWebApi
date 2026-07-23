"use client";

import { useEffect, useMemo, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import EventCard from "@/components/EventCard";
import EventFilterBar from "@/components/EventFilterBar";
import StatCard from "@/components/StatCard";
import { getCategoriesAction, getEventsAction } from "@/lib/actions/arena-action";
import { mockCategories, mockEvents } from "@/lib/mock/arena-data";
import { useEventFiltersStore } from "@/store/useEventFiltersStore";
import type { ArenaEvent, EventCategorySummary } from "@/types/arena";

export default function EventsPage() {
  const [events, setEvents] = useState<ArenaEvent[]>(mockEvents);
  const [categories, setCategories] = useState<EventCategorySummary[]>(mockCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = useEventFiltersStore((state) => state.query);
  const category = useEventFiltersStore((state) => state.category);

  useEffect(() => {
    const load = async () => {
      const [eventsResult, categoriesResult] = await Promise.all([getEventsAction(), getCategoriesAction()]);

      if (eventsResult.data?.length) {
        setEvents(eventsResult.data);
      }

      if (categoriesResult.data?.length) {
        setCategories(categoriesResult.data);
      }

      if (!eventsResult.ok || !categoriesResult.ok) {
        setError("Showing featured ArenaTicket data while the API is unavailable.");
      }

      setLoading(false);
    };

    void load();
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
        eyebrow="Events"
        title="Explore the ArenaTicket lineup"
        description="Browse featured esports events, discover what is live now, and move into details or checkout without friction."
      />

      <div className="grid gap-4 md:grid-cols-4">
        {mockCategories.slice(0, 4).map((item) => (
          <StatCard key={item.name} label={item.label} value={`${item.count}`} helper={item.description} />
        ))}
      </div>

      <EventFilterBar categories={categories} />

      {loading && <p className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Loading events...</p>}
      {!loading && error && <p className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6 text-sm text-amber-700">{error}</p>}
      {!loading && <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}</div>}
    </main>
  );
}
