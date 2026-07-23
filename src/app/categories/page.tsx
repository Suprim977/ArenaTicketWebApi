import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import { mockCategories } from "@/lib/mock/arena-data";

export default function CategoriesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl space-y-8 px-6 py-10">
      <SectionHeader
        eyebrow="Categories"
        title="Browse by game type"
        description="Jump into the type of show you want to attend, from tactical shooters to live finals and community nights."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {mockCategories.map((category) => (
          <article key={category.name} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
            <p className="label-mini">{category.label}</p>
            <h3 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{category.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">{category.count} events</span>
              <Link href={`/search?category=${category.name}`} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-900">
                View events
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
