import Link from "next/link";
import type { Booking } from "@/types/arena";

type BookingCardProps = {
  booking: Booking;
};

const currency = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-mini">{booking.bookingRef}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{booking.eventTitle}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.seatType} · Qty {booking.quantity} · {booking.attendeeName}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {booking.status}
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">{currency.format(booking.totalPrice)}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link href={`/ticket/${booking.bookingRef}`} className="primary-btn">
          Open QR ticket
        </Link>
        <Link href={`/event/${booking.eventId}`} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          Event details
        </Link>
      </div>
    </article>
  );
}
