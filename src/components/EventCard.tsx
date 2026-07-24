import Link from "next/link";
import type { ArenaEvent } from "@/types/arena";

type EventCardProps = {
  event: ArenaEvent;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="label-mini">{event.category}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{event.title}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{event.venue} · {event.city}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          {event.status}
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.description}</p>

      <div className="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-600 dark:text-slate-300">
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Date</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">{event.date}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Time</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">{event.time}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">From</p>
          <p className="mt-1 font-semibold text-slate-900 dark:text-white">Rs {event.priceFrom.toLocaleString("en-NP")}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{event.seatsLeft} seats left</p>
        <Link href={`/event/${event.id}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
          View details
        </Link>
      </div>
    </article>
  );
}
