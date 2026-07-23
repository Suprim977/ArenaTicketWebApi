"use client";

import { useEventFiltersStore } from "@/store/useEventFiltersStore";
import type { EventCategorySummary } from "@/types/arena";

type EventFilterBarProps = {
  categories: EventCategorySummary[];
};

export default function EventFilterBar({ categories }: EventFilterBarProps) {
  const query = useEventFiltersStore((state) => state.query);
  const category = useEventFiltersStore((state) => state.category);
  const setQuery = useEventFiltersStore((state) => state.setQuery);
  const setCategory = useEventFiltersStore((state) => state.setCategory);
  const reset = useEventFiltersStore((state) => state.reset);

  return (
    <div className="grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[1.3fr_0.7fr_auto] md:items-end">
      <label className="space-y-2">
        <span className="label-mini">Search</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input-shell"
          placeholder="Search events, venues, or cities"
        />
      </label>

      <label className="space-y-2">
        <span className="label-mini">Category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="input-shell">
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-arena-indigo dark:border-slate-700 dark:text-slate-200">
        Reset filters
      </button>
    </div>
  );
}
