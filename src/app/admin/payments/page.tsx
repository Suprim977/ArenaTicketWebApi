import StatCard from "@/components/StatCard";

export default function AdminPaymentsPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="label-mini">Payments</p>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Track payments</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">Monitor successful charges, failed payments, and refunds.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Revenue" value="₦24.8m" helper="This month" />
        <StatCard label="Success rate" value="98.7%" helper="Processed payments" />
        <StatCard label="Refunds" value="17" helper="Recent refunds" />
      </div>
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-gray-600 dark:text-slate-300">Payment rows and reconciliation tools can be wired into the API here.</p>
      </div>
    </section>
  );
}
