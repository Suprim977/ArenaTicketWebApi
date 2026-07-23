type StatCardProps = {
  label: string;
  value: string;
  helper: string;
};

export default function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <p className="label-mini">{label}</p>
      <p className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p>
    </div>
  );
}
