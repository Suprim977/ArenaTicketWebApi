"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CheckCircle2, Clock3, CreditCard, RefreshCw, TriangleAlert, WalletCards } from "lucide-react";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import StatusBadge from "@/components/StatusBadge";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { useAuth } from "@/lib/contexts/AuthContext";
import { formatDateTime, formatMoney, fullName } from "@/lib/format";

const providerName = (method: string) =>
  method === "esewa" ? "eSewa" : method === "khalti" ? "Khalti" : method === "card" ? "Card" : method;

const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "Your session has expired. Please log in again.";
    if (error.response?.status === 403) return "Administrator access is required.";
  }
  return "Payments could not be loaded. Please try again.";
};

export default function AdminPaymentsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const ready = !authLoading && Boolean(token) && user?.role === "admin";
  const query = useQuery({
    queryKey: ["admin-payments"],
    queryFn: dashboardApi.getAdminPayments,
    enabled: ready,
    retry: false,
    refetchOnMount: "always",
  });

  if (authLoading || (!ready && Boolean(token))) {
    return <div><p className="mb-4 text-sm font-semibold text-slate-500">Loading payments...</p><DashboardSkeleton cards={4} /></div>;
  }
  if (!ready) return null;
  if (query.isLoading) return <div><p className="mb-4 text-sm font-semibold text-slate-500">Loading payments...</p><DashboardSkeleton cards={4} /></div>;
  if (query.isError) return <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-800"><h1 className="text-lg font-black">Payments unavailable</h1><p className="mt-2 text-sm">{errorMessage(query.error)}</p><button onClick={() => query.refetch()} disabled={query.isFetching} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-rose-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-60"><RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />Retry</button></section>;

  const payments = query.data ?? [];
  const successful = payments.filter((payment) => ["success", "completed"].includes(payment.status));
  const pending = payments.filter((payment) => payment.status === "pending");
  const failed = payments.filter((payment) => ["failed", "cancelled"].includes(payment.status));
  const revenue = successful.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="label-mini">Payments</p><h1 className="mt-2 text-3xl font-black">Payments</h1><p className="mt-2 text-sm text-slate-500">Monitor ArenaTicket payment transactions.</p></div><button onClick={() => query.refetch()} disabled={query.isFetching} className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900"><RefreshCw size={16} className={query.isFetching ? "animate-spin" : ""} />Refresh</button></header>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[[CreditCard, "Total Transactions", payments.length], [CheckCircle2, "Successful", successful.length], [Clock3, "Pending", pending.length], [TriangleAlert, "Failed", failed.length], [WalletCards, "Revenue", formatMoney(revenue)]].map(([Icon, label, value]) => { const CardIcon = Icon as typeof CreditCard; return <article key={label as string} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><CardIcon size={21} className="text-indigo-600" /><p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-500">{label as string}</p><p className="mt-1 text-2xl font-black">{value as string | number}</p></article>; })}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="min-w-[1050px] w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Customer</th><th className="px-4 py-3">Event</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Provider</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Transaction</th><th className="px-4 py-3">Date</th></tr></thead>
          <tbody>{payments.map((payment) => { const booking = typeof payment.bookingId === "string" ? undefined : payment.bookingId; const customer = typeof payment.userId === "string" ? undefined : payment.userId; const event = booking?.eventId ?? booking?.event; return <tr key={payment._id} className="border-t border-slate-100 align-top dark:border-slate-800"><td className="px-4 py-4"><p className="font-bold">{fullName(customer) || "Customer details unavailable"}</p><p className="mt-1 text-xs text-slate-500">{customer?.email}</p></td><td className="px-4 py-4"><p className="font-semibold">{event?.title || "Event details unavailable"}</p><p className="mt-1 text-xs text-slate-500">{event?.venue || event?.location}</p></td><td className="px-4 py-4"><p className="font-mono text-xs font-bold">{booking?.bookingRef || "Unavailable"}</p><p className="mt-1 text-xs capitalize text-slate-500">{booking?.tier ? `${booking.tier} × ${booking.quantity}` : ""}</p></td><td className="px-4 py-4"><span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">{providerName(payment.method)}</span></td><td className="px-4 py-4 font-bold">{formatMoney(payment.amount)}</td><td className="px-4 py-4"><StatusBadge status={payment.status} /></td><td className="px-4 py-4 font-mono text-xs">{payment.transactionRef || payment.transactionId || "Pending"}</td><td className="px-4 py-4 whitespace-nowrap">{formatDateTime(payment.createdAt)}</td></tr>; })}</tbody>
        </table>
        {!payments.length && <p className="p-10 text-center text-slate-500">No payment transactions yet.</p>}
      </div>
    </section>
  );
}
