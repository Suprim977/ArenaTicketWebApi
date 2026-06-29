import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { handleGetUserById } from "@/lib/actions/admin/user-action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await handleGetUserById(id);
    if (!result.success || !result.data) notFound();

    const user = result.data;
    const rows: [string, string][] = [
        ["First name", user.firstName],
        ["Last name", user.lastName],
        ["Email", user.email],
        ["Username", user.username],
        ["Role", user.role],
        ["Created", user.createdAt ? new Date(user.createdAt).toLocaleString() : "—"],
    ];

    return (
        <section className="mx-auto w-full max-w-[700px]">
            <Link href="/admin/users" className="text-xs uppercase tracking-[1.5px] text-muted hover:text-on-dark">
                ← Back to users
            </Link>

            <div className="mt-4 mb-8 flex items-center gap-4">
                {user.imageUrl ? (
                    <Image
                        src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                        alt="Profile"
                        width={72}
                        height={72}
                        className="h-18 w-18 rounded-full object-cover"
                    />
                ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-elevated text-xs text-muted">
                        No Image
                    </div>
                )}
                <div>
                    <h2 className="text-2xl font-bold text-on-dark">
                        {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-sm text-muted">{user.email}</p>
                </div>
                <Link
                    href={`/admin/users/${user._id}/edit`}
                    className="ml-auto flex h-10 items-center border border-hairline px-4 text-xs font-bold uppercase tracking-[1.5px] text-body transition-colors hover:text-on-dark"
                >
                    Edit
                </Link>
            </div>

            <dl className="divide-y divide-hairline border border-hairline">
                {rows.map(([label, value]) => (
                    <div key={label} className="flex justify-between px-4 py-3">
                        <dt className="text-xs uppercase tracking-[1px] text-muted">{label}</dt>
                        <dd className="text-sm text-on-dark">{value || "—"}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
