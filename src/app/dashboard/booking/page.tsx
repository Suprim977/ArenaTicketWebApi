"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { formatMoney } from "@/lib/format";
import type { PaymentMethod } from "@/types/payment";

export default function BookingPage() {
  return <Suspense fallback={<DashboardSkeleton />}><BookingContent /></Suspense>;
}

function BookingContent() {
  const params = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const eventId = params.get("eventId") ?? "";
  const requestedTier = params.get("tier") ?? "";
  const [tier, setTier] = useState(requestedTier);
  const [section, setSection] = useState("Arena Floor");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [checkoutError, setCheckoutError] = useState("");
  const eventQuery = useQuery({ queryKey: ["event", eventId], queryFn: () => dashboardApi.getEvent(eventId), enabled: Boolean(eventId) });
  const event = eventQuery.data;
  const tiers = useMemo(() => event?.tiers ?? [], [event?.tiers]);
  const activeTier = tiers.find((item) => item.name === tier) ?? tiers[0];
  const total = (activeTier?.price ?? 0) * quantity;

  const checkout = useMutation({
    mutationFn: async () => {
      setCheckoutError("");
      if (!eventId || !event) throw new Error("Event not found.");
      if (!activeTier) throw new Error("Please select a ticket tier.");
      if (!section.trim()) throw new Error("Please select a section.");
      const bookingQuantity = Number(quantity);
      if (!Number.isInteger(bookingQuantity) || bookingQuantity < 1) throw new Error("Quantity must be at least 1.");
      if (!paymentMethod) throw new Error("Please select a payment method.");
      const ticketTier: "normal" | "vip" = /^vip$/i.test(activeTier.name) ? "vip" : "normal";
      const booking = await dashboardApi.createBooking({
        eventId: event._id || event.id || eventId,
        ticketTier,
        section,
        quantity: bookingQuantity,
        paymentMethod,
      });
      const bookingId = booking._id || booking.id;
      if (!bookingId) throw new Error("The booking API did not return a booking ID.");
      const payment = await dashboardApi.initiatePayment({ bookingId, paymentMethod });
      return { booking, payment };
    },
    onSuccess: async ({ booking, payment }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings"] }),
        queryClient.invalidateQueries({ queryKey: ["tickets"] }),
      ]);
      toast.success("Booking created. Continue to payment.");
      if (payment.paymentUrl) {
        const gatewayUrl = new URL(payment.paymentUrl);
        const method = gatewayUrl.pathname.split("/").filter(Boolean).at(-1) || paymentMethod;
        window.sessionStorage.setItem("arena-payment-context", JSON.stringify({
          eventTitle: event?.title,
          eventDate: event?.date,
          venue: event?.venue,
          bookingRef: booking.bookingRef,
          tier: activeTier?.name,
          quantity,
          amount: payment.payment?.amount ?? booking.totalAmount,
          method,
        }));
        const query = new URLSearchParams({
          method,
          paymentId: gatewayUrl.searchParams.get("paymentId") || "",
          token: gatewayUrl.searchParams.get("token") || "",
        });
        router.push(`/payment/mock?${query.toString()}`);
        return;
      }
      router.push(`/dashboard/ticket/${booking.bookingRef || booking._id}`);
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Payment could not be completed.");
      setCheckoutError(message);
      toast.error(message);
    },
  });

  if (!eventId) return <p className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Select an event from the Events tab to begin booking.</p>;
  if (eventQuery.isLoading) return <DashboardSkeleton />;
  if (!event || eventQuery.isError) return <p className="rounded-xl bg-rose-50 p-5 text-rose-700">The selected event could not be loaded.</p>;
  if (!tiers.length) return <p className="rounded-xl bg-amber-50 p-5 text-amber-700">Ticket pricing is not configured for this event. Please contact an administrator.</p>;

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
              <button type="button" onClick={() => setPaymentMethod("esewa")} aria-pressed={paymentMethod === "esewa"} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${paymentMethod === "esewa" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><Image src="/esewa.svg" alt="" width={22} height={22} />eSewa{paymentMethod === "esewa" && <CheckCircle2 size={18} />}</button>
              <button type="button" onClick={() => setPaymentMethod("khalti")} aria-pressed={paymentMethod === "khalti"} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${paymentMethod === "khalti" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><Image src="/khalti.jpg" alt="" width={24} height={24} className="size-6 rounded-md object-cover" />Khalti{paymentMethod === "khalti" && <CheckCircle2 size={18} />}</button>
              <button type="button" onClick={() => setPaymentMethod("card")} aria-pressed={paymentMethod === "card"} className={`flex items-center justify-center gap-2 rounded-xl border p-4 font-bold ${paymentMethod === "card" ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-600/20 dark:bg-indigo-950/40" : "border-slate-200 dark:border-slate-700"}`}><Image src="/card-brands.svg" alt="Visa and Mastercard" width={48} height={24} />Card{paymentMethod === "card" && <CheckCircle2 size={18} />}</button>
            </div>
            {checkoutError && <p role="alert" className="mt-3 text-sm text-rose-600">{checkoutError}</p>}
          </div>
        </div>
        <aside className="rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">Order summary</p>
          <div className="mt-6 space-y-3 text-sm">
            <p className="flex justify-between gap-4"><span className="text-slate-400">Event</span><span className="text-right font-semibold">{event.title}</span></p>
            <p className="flex justify-between"><span className="text-slate-400">Ticket type</span><span className="font-semibold">{activeTier?.name}</span></p>
            <p className="flex justify-between"><span>Ticket price</span><span>{formatMoney(activeTier?.price)}</span></p>
            <p className="flex justify-between"><span>Quantity</span><span>{quantity}</span></p>
            <p className="flex justify-between border-t border-slate-700 pt-4 text-lg font-black"><span>Total</span><span>{formatMoney(total)}</span></p>
          </div>
          <button onClick={() => checkout.mutate()} disabled={checkout.isPending} className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{checkout.isPending ? "Preparing payment..." : "Confirm Payment"}</button>
          <p className="mt-3 text-center text-xs text-slate-400">Secure demo checkout. No real money will be charged.</p>
        </aside>
      </div>
    </section>
  );
}
