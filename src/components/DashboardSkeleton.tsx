export default function DashboardSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="animate-pulse space-y-6" role="status" aria-label="Loading">
      <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }, (_, index) => (
          <div key={index} className="h-56 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    </div>
  );
}
