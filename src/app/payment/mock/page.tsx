"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import Logo from "@/app/__components/Logo";
import { API_BASE_URL } from "@/lib/api/endpoints";
import { formatLongDate, formatMoney, formatTime } from "@/lib/format";

type PaymentContext = {
  eventTitle?: string;
  eventDate?: string;
  venue?: string;
  bookingRef?: string;
  tier?: string;
  quantity?: number;
  amount?: number;
  method?: string;
};

export default function MockPaymentPage() {
  return <Suspense fallback={<PaymentShell>Preparing secure demo payment…</PaymentShell>}><MockPaymentContent /></Suspense>;
}

function MockPaymentContent() {
  const params = useSearchParams();
  const [context, setContext] = useState<PaymentContext>({});
  const [processing, setProcessing] = useState<"pay" | "cancel" | null>(null);
  const method = (params.get("method") || context.method || "payment").toLowerCase();
  const paymentId = params.get("paymentId") || "";
  const token = params.get("token") || "";
  const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, "");
  const actionBase = `${apiOrigin}/api/v1/mock-payments/${encodeURIComponent(method)}`;
  const validAccess = Boolean(paymentId && token);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.sessionStorage.getItem("arena-payment-context");
      if (!stored) return;
      try { setContext(JSON.parse(stored) as PaymentContext); } catch { setContext({}); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const submit = (kind: "pay" | "cancel") => (event: FormEvent<HTMLFormElement>) => {
    if (processing) {
      event.preventDefault();
      return;
    }
    setProcessing(kind);
  };

  if (!validAccess) return <PaymentShell><h1 className="text-2xl font-black">Payment link unavailable</h1><p className="mt-3 text-slate-500">This secure demo-payment link is incomplete or expired.</p><Link href="/dashboard/events" className="primary-btn mt-6">Browse events</Link></PaymentShell>;

  return (
    <PaymentShell>
      <div className="flex items-center justify-between gap-4"><div><p className="label-mini">{method} payment</p><h1 className="mt-2 text-3xl font-black capitalize">{method} Payment</h1></div><ShieldCheck className="text-emerald-500" size={36} /></div>
      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><strong>DEMO PAYMENT</strong><p className="mt-1">No real money will be charged.</p></div>
      <dl className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
        <Row label="Event" value={context.eventTitle || "ArenaTicket Event"} />
        <Row label="Date" value={`${formatLongDate(context.eventDate)} · ${formatTime(context.eventDate)}`} />
        <Row label="Venue" value={context.venue || "Venue details unavailable"} />
        <Row label="Booking" value={context.bookingRef || "Booking created"} />
        <Row label="Ticket" value={`${context.tier || "Ticket"} × ${context.quantity || 1}`} />
        <Row label="Status" value="Pending" />
      </dl>
      <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white"><p className="text-sm text-slate-400">Amount due</p><p className="mt-1 text-3xl font-black">{formatMoney(context.amount)}</p></div>
      <form method="post" action={`${actionBase}/success`} onSubmit={submit("pay")} className="mt-6">
        <input type="hidden" name="paymentId" value={paymentId} /><input type="hidden" name="token" value={token} />
        <button disabled={Boolean(processing)} className="w-full rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white disabled:opacity-60">{processing === "pay" ? "Processing…" : `Pay ${formatMoney(context.amount)}`}</button>
      </form>
      <form method="post" action={`${actionBase}/cancel`} onSubmit={submit("cancel")} className="mt-3">
        <input type="hidden" name="paymentId" value={paymentId} /><input type="hidden" name="token" value={token} />
        <button disabled={Boolean(processing)} className="w-full rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-600 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300">{processing === "cancel" ? "Cancelling…" : "Cancel Payment"}</button>
      </form>
    </PaymentShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr]"><dt className="text-sm text-slate-500">{label}</dt><dd className="font-semibold">{value}</dd></div>;
}

function PaymentShell({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10 dark:bg-slate-950"><section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8"><div className="mb-7 border-b border-slate-100 pb-5 dark:border-slate-800"><Logo /></div>{children}</section></main>;
}
