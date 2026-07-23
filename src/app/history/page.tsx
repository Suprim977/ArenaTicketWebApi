"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/components/SectionHeader";
import BookingCard from "@/components/BookingCard";
import { getBookingsAction } from "@/lib/actions/arena-action";
import { mockBookings } from "@/lib/mock/arena-data";
import type { Booking } from "@/types/arena";

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getBookingsAction();
      if (result.data?.length) {
        setBookings(result.data);
        setLoading(false);
        return;
      }

      const stored = JSON.parse(localStorage.getItem("arenaticket-bookings") || "[]") as Booking[];
      setBookings([...stored, ...mockBookings]);
      setLoading(false);
    };

    void load();
  }, []);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <SectionHeader
        eyebrow="Booking history"
        title="Your recent ArenaTicket bookings"
        description="Review confirmed and pending tickets, then jump back into the QR page or event detail when you need it."
      />

      {loading ? (
        <p className="mt-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Loading booking history...</p>
      ) : (
        <div className="mt-8 space-y-4">
          {bookings.map((booking) => (
            <BookingCard key={booking.bookingRef} booking={booking} />
          ))}
        </div>
      )}
    </main>
  );
}
