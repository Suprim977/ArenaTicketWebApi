"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import EventCard from "@/components/EventCard";
import EventFilterBar from "@/components/EventFilterBar";
import { mockCategories, mockEvents } from "@/lib/mock/arena-data";
import { useEventFiltersStore } from "@/store/useEventFiltersStore";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = useEventFiltersStore((state) => state.query);
  const category = useEventFiltersStore((state) => state.category);
  const setCategory = useEventFiltersStore((state) => state.setCategory);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setCategory(categoryParam);
    }
  }, [searchParams, setCategory]);

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      const matchesQuery = [event.title, event.venue, event.city, event.description].join(" ").toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || event.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, query]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-6 py-10">
      <SectionHeader
        eyebrow="Search"
        title="Find an event faster"
        description="Use the search box to narrow events by venue, city, or title, then jump straight into the detail page."
      />

      <EventFilterBar categories={mockCategories} />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
      </div>
    </main>
  );
}
