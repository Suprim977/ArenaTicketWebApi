"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { CreditCard } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { useAuth } from "@/lib/contexts/AuthContext";
import type { PaymentMethod } from "@/types/payment";

export default function BookingPage() {
  return <Suspense fallback={<DashboardSkeleton />}><BookingContent /></Suspense>;
}

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const eventId = params.get("eventId") ?? "";
  const requestedTier = params.get("tier") ?? "";
  const [tier, setTier] = useState(requestedTier);
  const [section, setSection] = useState("Arena Floor");
  const [quantity, setQuantity] = useState(1);
  const [method, setMethod] = useState<PaymentMethod>("esewa");
  const eventQuery = useQuery({ queryKey: ["event", eventId], queryFn: () => dashboardApi.getEvent(eventId), enabled: Boolean(eventId) });
  const event = eventQuery.data;
  const tiers = useMemo(() => event?.tiers?.length ? event.tiers : event ? [{ name: "Standard", price: event.priceFrom ?? 0 }, { name: "VIP", price: (event.priceFrom ?? 0) * 1.75 }] : [], [event]);
  const activeTier = tiers.find((item) => item.name === tier) ?? tiers[0];
  const subtotal = (activeTier?.price ?? 0) * quantity;
  const bookingFee = subtotal * 0.05;
  const tax = subtotal * 0.13;
  const total = subtotal + bookingFee + tax;

  const checkout = useMutation({
    mutationFn: async () => {
      if (!event || !activeTier) throw new Error("Choose a valid event and ticket tier.");
      const booking = await dashboardApi.createBooking({
        eventId: event._id || event.id || eventId,
        tier: activeTier.name,
        section,
        quantity,
        attendeeName: [user?.firstName, user?.lastName, user?.person?.firstName, user?.person?.lastName].filter(Boolean).join(" ") || "ArenaTicket Guest",
        attendeeEmail: user?.email ?? "",
      });
      const bookingId = booking._id || booking.id;
      if (!bookingId) throw new Error("The booking API did not return a booking ID.");
      await dashboardApi.initiatePayment({ bookingId, method });
      return booking;
    },
    onSuccess: (booking) => {
      toast.success("Payment successful. Your ticket is ready.");
      router.push(`/dashboard/ticket/${booking.bookingRef || booking._id}`);
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Payment could not be completed."),
  });

  if (!eventId) return <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Select an event from the Events tab to begin booking.</p>;
  if (eventQuery.isLoading) return <DashboardSkeleton />;
  if (!event || eventQuery.isError) return <p className="rounded-xl bg-rose-50 p-5 text-rose-700">The selected event could not be loaded.</p>;

  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Secure checkout</p><h1 className="mt-2 text-3xl font-black">{event.title}</h1></header>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Ticket tier<select className="input-shell mt-2" value={activeTier?.name} onChange={(e) => setTier(e.target.value)}>{tiers.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label className="text-sm font-semibold">Section<select className="input-shell mt-2" value={section} onChange={(e) => setSection(e.target.value)}><option>Arena Floor</option><option>Lower Bowl</option><option>Upper Bowl</option></select></label>
            <label className="text-sm font-semibold">Quantity<input className="input-shell mt-2" type="number" min={1} max={10} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(10, Number(e.target.value))))} /></label>
          </div>
          <div>
            <h2 className="font-bold">Payment method</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <button onClick={() => setMethod("esewa")} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${method === "esewa" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><Image src="/esewa.svg" alt="" width={22} height={22} />eSewa</button>
              <button onClick={() => setMethod("khalti")} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${method === "khalti" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><Image src="/khalti.jpg" alt="" width={24} height={24} className="size-6 rounded-md object-cover" />Khalti</button>
              <button onClick={() => setMethod("card")} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${method === "card" ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><CreditCard size={21} />Card</button>
            </div>
          </div>
        </div>
        <aside className="rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Order summary</p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex justify-between"><span>Subtotal</span><span>Rs {subtotal.toLocaleString("en-NP")}</span></p>
            <p className="flex justify-between"><span>Booking fee (5%)</span><span>Rs {bookingFee.toLocaleString("en-NP")}</span></p>
            <p className="flex justify-between"><span>VAT (13%)</span><span>Rs {tax.toLocaleString("en-NP")}</span></p>
            <p className="flex justify-between border-t border-slate-700 pt-4 text-lg font-black"><span>Total</span><span>Rs {total.toLocaleString("en-NP")}</span></p>
          </div>
          <button onClick={() => checkout.mutate()} disabled={checkout.isPending} className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold hover:bg-indigo-500 disabled:opacity-60">{checkout.isPending ? "Processing…" : "Confirm Payment"}</button>
          <p className="mt-3 text-center text-xs text-slate-400">Payment is mocked; booking and initiation APIs are called.</p>
        </aside>
      </div>
    </section>
  );
}
