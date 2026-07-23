"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TicketQR from "@/components/TicketQR";
import { getBookingByRefAction } from "@/lib/actions/arena-action";
import type { Booking } from "@/types/arena";

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function TicketDetailPage({ params }: { params: { bookingRef: string } }) {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const load = async () => {
      const result = await getBookingByRefAction(params.bookingRef);
      if (result.data) {
        setBooking(result.data);
        return;
      }

      const storedBookings: Booking[] = JSON.parse(localStorage.getItem("arenaticket-bookings") || "[]");
      const storedLastBooking = JSON.parse(localStorage.getItem("arenaticket-last-booking") || "null") as Booking | null;
      const found = [...storedBookings, ...(storedLastBooking ? [storedLastBooking] : [])].find(
        (item) => item.bookingRef === params.bookingRef,
      );
      setBooking(found || null);
    };

    void load();
  }, [params.bookingRef]);

  const bookingData = useMemo(() => booking, [booking]);

  if (!bookingData) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="label-mini">Ticket</p>
          <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">Booking not found</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">We could not locate this confirmation. Return to booking history or create a new ticket.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/history" className="primary-btn">Booking history</Link>
            <Link href="/booking" className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">Book again</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="label-mini">QR Ticket</p>
          <div className="mt-6">
            <TicketQR code={bookingData.bookingRef} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <p className="label-mini">Ticket details</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">{bookingData.eventTitle}</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">Your ticket is confirmed and ready for entry.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Seat</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{bookingData.seatType}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Attendee</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{bookingData.attendeeName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Quantity</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{bookingData.quantity}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{currency.format(bookingData.totalPrice)}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/history" className="primary-btn">
              Booking history
            </Link>
            <Link href="/search" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              Explore events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
