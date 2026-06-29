"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Overview", exact: true },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/blogs", label: "Blogs" },
];

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

    return (
        <aside className="hidden w-60 shrink-0 flex-col border-r border-hairline bg-surface-soft md:flex">
            <div className="flex h-16 items-center gap-3 border-b border-hairline px-6">
                <span className="m-stripe h-5 w-1 rounded-full" />
                <span className="text-sm font-bold uppercase tracking-[1.5px] text-on-dark">
                    Admin
                </span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4" aria-label="Admin sections">
                {NAV.map(({ href, label, exact }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            aria-current={active ? "page" : undefined}
                            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                active
                                    ? "bg-surface-card text-on-dark"
                                    : "text-muted hover:bg-surface-card hover:text-body-strong"
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-hairline p-4">
                <Link
                    href="/dashboard"
                    className="text-xs font-medium tracking-[0.5px] text-muted transition-colors hover:text-body-strong"
                >
                    ← Back to app
                </Link>
            </div>
        </aside>
    );
}
