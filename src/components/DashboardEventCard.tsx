import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { Event } from "@/types/event";

export default function DashboardEventCard({ event }: { event: Event }) {
  const id = event._id || event.id;
  const price = event.priceFrom ??
    (event.tiers?.length ? Math.min(...event.tiers.map((tier) => tier.price)) : 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="h-2 bg-linear-to-r from-indigo-600 to-violet-600" />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">{event.category}</p>
          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">{event.status}</span>
        </div>
        <h2 className="mt-3 text-xl font-bold text-slate-950 dark:text-white">{event.title}</h2>
        <div className="mt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(event.date).toLocaleDateString("en-NP", { dateStyle: "medium" })}</p>
          <p className="flex items-center gap-2"><MapPin size={16} /> {[event.venue, event.city].filter(Boolean).join(", ")}</p>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="font-bold text-slate-950 dark:text-white">From Rs {price.toLocaleString("en-NP")}</p>
          <Link href={`/dashboard/events/${id}`} className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
