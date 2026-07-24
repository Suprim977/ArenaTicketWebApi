"use client";

import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function AdminPaymentsPage() {
  const payments = useQuery({ queryKey: ["admin-payments"], queryFn: dashboardApi.getAdminPayments });
  if (payments.isLoading) return <DashboardSkeleton cards={3} />;
  if (payments.isError) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(payments.error, "Payments could not be loaded.")}</p>;
  return <section className="space-y-6"><header><p className="label-mini">Payments</p><h1 className="mt-2 text-3xl font-black">Payment management</h1></header><div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Transaction</th><th className="px-4 py-3">Booking</th><th className="px-4 py-3">Method</th><th className="px-4 py-3">Amount</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Date</th></tr></thead><tbody>{payments.data?.map((payment) => <tr key={payment._id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4">{payment.transactionId ?? "—"}</td><td className="px-4 py-4">{payment.bookingId}</td><td className="px-4 py-4 uppercase">{payment.method}</td><td className="px-4 py-4">Rs {payment.amount.toLocaleString("en-NP")}</td><td className="px-4 py-4 capitalize">{payment.status}</td><td className="px-4 py-4">{new Date(payment.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table>{!payments.data?.length && <p className="p-8 text-center text-slate-500">No payments found.</p>}</div></section>;
}
