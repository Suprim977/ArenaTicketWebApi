type StatusBadgeProps = {
  status?: string | null;
};

const tone = (status: string) => {
  if (["confirmed", "paid", "success", "completed", "valid", "published"].includes(status)) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300";
  }
  if (["failed", "cancelled", "refunded", "used"].includes(status)) {
    return "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300";
  }
  return "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300";
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = (status || "pending").toLowerCase();
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ring-1 ring-inset ${tone(normalized)}`}>
      {normalized}
    </span>
  );
}
