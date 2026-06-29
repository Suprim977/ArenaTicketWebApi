import Link from "next/link";

const CARDS = [
    { href: "/admin/users", label: "Users", desc: "Manage accounts, roles and access." },
    { href: "/admin/blogs", label: "Blogs", desc: "Create, edit and publish posts." },
];

export default function Page() {
    return (
        <section className="mx-auto w-full max-w-[1100px]">
            <p className="mb-2 text-xs font-bold uppercase tracking-[1.5px] text-muted">
                Admin
            </p>
            <h2 className="mb-8 text-3xl font-bold text-on-dark">Overview</h2>

            <div className="grid gap-4 sm:grid-cols-2">
                {CARDS.map(({ href, label, desc }) => (
                    <Link
                        key={href}
                        href={href}
                        className="group rounded-lg border border-hairline bg-surface-card p-6 transition-colors hover:border-muted"
                    >
                        <h3 className="mb-1 text-lg font-bold text-on-dark">{label}</h3>
                        <p className="text-sm text-muted">{desc}</p>
                        <span className="mt-4 inline-block text-xs font-medium tracking-[0.5px] text-body-strong opacity-0 transition-opacity group-hover:opacity-100">
                            Manage →
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
