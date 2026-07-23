import Link from "next/link";
import { getCategoriesAction } from "@/lib/actions/arena-action";
import SectionHeader from "@/components/SectionHeader";

export default async function CategoriesPage() {
  const result = await getCategoriesAction();
  const categories = result.data ?? [];
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-6 py-10">
      <SectionHeader
        eyebrow="Categories"
        title="Find your next arena night"
        description="Browse events by game type and discover the competitions that match your play style."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/search?category=${category.name}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <p className="label-mini text-blue-600">{category.name}</p>
            <h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{category.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
            <p className="mt-5 text-sm font-semibold text-arena-indigo">{category.count} events available →</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
