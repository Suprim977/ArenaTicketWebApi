"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { getUserByIdAction } from "@/lib/actions/admin/user-action";

export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useQuery({
    queryKey: ["admin-user", id],
    queryFn: async () => {
      const result = await getUserByIdAction(id);
      if (!result.ok || !result.data) throw new Error(result.message);
      return result.data;
    },
  });
  if (user.isLoading) return <DashboardSkeleton cards={1} />;
  if (user.isError || !user.data) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{user.error instanceof Error ? user.error.message : "User could not be loaded."}</p>;
  const name = `${user.data.person?.firstName ?? ""} ${user.data.person?.lastName ?? ""}`.trim() || "Unnamed user";
  return <section className="mx-auto max-w-3xl space-y-5"><header className="flex items-end justify-between"><div><p className="label-mini">User details</p><h1 className="mt-2 text-3xl font-black">{name}</h1></div><Link href={`/admin/users/${id}/edit`} className="primary-btn">Edit User</Link></header><dl className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2"><div><dt className="label-mini">Email</dt><dd className="mt-1">{user.data.email}</dd></div><div><dt className="label-mini">Role</dt><dd className="mt-1 capitalize">{user.data.role}</dd></div><div><dt className="label-mini">User ID</dt><dd className="mt-1 break-all">{user.data._id}</dd></div><div><dt className="label-mini">Created</dt><dd className="mt-1">{user.data.createdAt ? new Date(user.data.createdAt).toLocaleDateString() : "Not available"}</dd></div></dl></section>;
}
