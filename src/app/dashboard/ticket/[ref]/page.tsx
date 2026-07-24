"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import TicketQR from "@/components/TicketQR";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function DigitalTicketPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = use(params);
  const query = useQuery({ queryKey: ["booking", ref], queryFn: () => dashboardApi.getBooking(ref) });
  if (query.isLoading) return <DashboardSkeleton />;
  if (!query.data || query.isError) return <p className="rounded-xl bg-rose-50 p-5 text-rose-700">We couldn&apos;t find this ticket.</p>;
  const booking = query.data;

  return (
    <section className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <header className="bg-linear-to-r from-indigo-700 to-violet-700 px-7 py-6 text-white">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-indigo-200">ArenaTicket · Digital Entry</p>
          <h1 className="mt-2 text-3xl font-black">{booking.event?.title ?? "Tournament Ticket"}</h1>
        </header>
        <div className="grid gap-8 p-7 md:grid-cols-[18rem_1fr]">
          <div><TicketQR code={booking.bookingRef} qrCodeData={booking.qrCodeData} /><p className="mt-4 text-center font-mono text-sm font-bold">#{booking.bookingRef}</p></div>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {[
              ["Date", booking.event?.date ? new Date(booking.event.date).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" }) : "TBA"],
              ["Venue", booking.event?.venue ?? "TBA"],
              ["Seat / Section", [booking.tier, booking.section, ...(booking.seats ?? [])].filter(Boolean).join(" · ") || "General"],
              ["Quantity", booking.quantity],
              ["Attendee", booking.attendeeName ?? [booking.user?.firstName, booking.user?.lastName].filter(Boolean).join(" ")],
              ["Email", booking.attendeeEmail ?? booking.user?.email ?? "—"],
            ].map(([label, value]) => <div key={label as string} className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800"><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 font-semibold">{value}</p></div>)}
            <div className="sm:col-span-2"><p className="text-xs text-slate-500">Present this QR code at the arena entrance. Screenshots are accepted.</p><Link href="/dashboard/history" className="primary-btn mt-5">Back to history</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
