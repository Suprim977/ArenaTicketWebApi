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

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams, setCategory]);

  useEffect(() => {
    void getEventsAction().then((result) => {
      const apiEvents = result.data ?? [];
      setEvents(apiEvents);
      setCategories([{ name: "Festival", label: "Tournaments", description: "Live tournaments from the API.", count: apiEvents.length }]);
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </main>
  );
}
