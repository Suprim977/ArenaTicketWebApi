import type { ArenaEvent } from "@/types/arena";

type BookingSummaryProps = {
  event: ArenaEvent;
  seatType: string;
  quantity: number;
};

export default function BookingSummary({ event, seatType, quantity }: BookingSummaryProps) {
  const ticketPrice = seatType === "VIP" ? 1500 : 600;
  const total = ticketPrice * quantity;

  return (
    <aside className="rounded-4xl border border-slate-200 bg-linear-to-br from-sky-50 to-white p-6 shadow-card dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
      <p className="label-mini">Summary</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{event.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{event.venue} · {event.city}</p>

      <div className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <span>Ticket price</span>
          <span className="font-semibold">Rs {ticketPrice.toLocaleString("en-NP")}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <span>Quantity</span>
          <span className="font-semibold">{quantity}</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
          <span>Total</span>
          <span className="font-semibold">Rs {total.toLocaleString("en-NP")}</span>
        </div>
      </div>
    </aside>
  );
}
