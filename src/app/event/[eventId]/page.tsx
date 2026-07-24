"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getEventByIdAction } from "@/lib/actions/arena-action";
import type { ArenaEvent } from "@/types/arena";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const [event, setEvent] = useState<ArenaEvent | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getEventByIdAction(params.eventId);
      if (result.data) {
        setEvent(result.data);
        return;
      }

      setEvent(null);
    };

    void load();
  }, [params.eventId]);

  if (!event) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
        <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="label-mini">Event details</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Event not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
        <p className="label-mini">Event details</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{event.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">{event.description}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Venue</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{event.venue}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">City</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{event.city}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Time</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{event.date} · {event.time}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">From</p>
            <p className="mt-1 font-semibold text-slate-900 dark:text-white">{currency.format(event.priceFrom)}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/dashboard/booking?eventId=${event.id}`} className="primary-btn">
            Buy Ticket
          </Link>
          <Link href="/search" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            Back to events
          </Link>
        </div>
      </section>
    </main>
  );
}
