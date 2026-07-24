"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function PaymentSuccessPage() {
  return <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-16"><DashboardSkeleton cards={1} /></main>}><SuccessContent /></Suspense>;
}

function SuccessContent() {
  const params = useSearchParams();
  const requestedTicket = params.get("ticketId");
  const bookingId = params.get("bookingId");
  const tickets = useQuery({
    queryKey: ["tickets"],
    queryFn: dashboardApi.getTickets,
    refetchInterval: (query) => query.state.data?.length ? false : 2000,
  });
  const ticket = tickets.data?.find((item) => {
    const itemBookingId = typeof item.bookingId === "object" ? item.bookingId._id : item.bookingId;
    return (requestedTicket && (item._id === requestedTicket || item.ticketNumber === requestedTicket))
      || (bookingId && itemBookingId === bookingId);
  }) ?? (!requestedTicket && !bookingId ? tickets.data?.[0] : undefined);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16">
      <section className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl dark:border-emerald-900 dark:bg-slate-900">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-100 text-3xl text-emerald-700">✓</div>
        <p className="mt-5 text-sm font-bold uppercase tracking-widest text-emerald-600">Payment successful</p>
        <h1 className="mt-2 text-3xl font-black">Booking confirmed</h1>
        <p className="mt-3 text-slate-500">{tickets.isLoading ? "Generating your ticket..." : ticket ? "Your QR ticket is ready." : "Your payment was received. Your ticket is still being generated."}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {ticket && <Link href={`/tickets/${ticket._id}`} className="primary-btn">View My Ticket</Link>}
          <Link href="/tickets" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">My Tickets</Link>
        </div>
      </section>
    </main>
  );
}
