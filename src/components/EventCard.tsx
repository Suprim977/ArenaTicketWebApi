import { CalendarDays, MapPin } from "lucide-react";
import Link from "next/link";
import EventImage from "@/components/EventImage";
import { formatDate, formatMoney } from "@/lib/format";
import type { ArenaEvent } from "@/types/arena";

export default function EventCard({ event }: { event: ArenaEvent }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
        <EventImage src={event.image} alt={`${event.title} banner`} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div><p className="label-mini">{event.category}</p><h3 className="mt-2 text-xl font-bold">{event.title}</h3><p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><MapPin size={15} />{event.venue}</p></div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${event.seatsLeft > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{event.seatsLeft > 0 ? "Available" : "Sold out"}</span>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4 text-sm"><p className="flex items-center gap-1 text-slate-500"><CalendarDays size={16} />{formatDate(event.date)}</p><p className="font-black">From {formatMoney(event.priceFrom)}</p></div>
        <div className="mt-5 flex items-center justify-between"><p className="text-sm text-slate-500">{event.seatsLeft} seats left</p><Link href={`/event/${event.id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">View Event</Link></div>
      </div>
    </article>
  );
}
