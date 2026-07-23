"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { useAuth } from "@/lib/contexts/AuthContext";

type Tab = "users" | "events" | "bookings";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("users");
  useEffect(() => {
    if (!isLoading && user?.role !== "admin") router.replace("/dashboard");
  }, [isLoading, router, user?.role]);
  const users = useQuery({ queryKey: ["admin", "users"], queryFn: dashboardApi.getAdminUsers, enabled: user?.role === "admin" && tab === "users" });
  const events = useQuery({ queryKey: ["admin", "events"], queryFn: dashboardApi.getAdminEvents, enabled: user?.role === "admin" && tab === "events" });
  const bookings = useQuery({ queryKey: ["admin", "bookings"], queryFn: dashboardApi.getAdminBookings, enabled: user?.role === "admin" && tab === "bookings" });
  const removeUser = useMutation({ mutationFn: dashboardApi.deleteAdminUser, onSuccess: () => { toast.success("User deleted."); queryClient.invalidateQueries({ queryKey: ["admin", "users"] }); }, onError: () => toast.error("User could not be deleted.") });
  const removeEvent = useMutation({ mutationFn: dashboardApi.deleteAdminEvent, onSuccess: () => { toast.success("Event deleted."); queryClient.invalidateQueries({ queryKey: ["admin", "events"] }); }, onError: () => toast.error("Event could not be deleted.") });

  if (isLoading || user?.role !== "admin") return <DashboardSkeleton />;
  const activeQuery = tab === "users" ? users : tab === "events" ? events : bookings;

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Admin</p><h1 className="mt-2 text-3xl font-black">Arena operations</h1></header>
      <div className="flex gap-2 overflow-x-auto">
        {(["users", "events", "bookings"] as const).map((item) => <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-4 py-2.5 text-sm font-bold capitalize ${tab === item ? "bg-indigo-600 text-white" : "bg-white text-slate-600 dark:bg-slate-900 dark:text-slate-300"}`}>Manage {item}</button>)}
      </div>
      {activeQuery.isLoading && <DashboardSkeleton />}
      {activeQuery.isError && <p className="rounded-xl bg-rose-50 p-4 text-rose-700">Admin data could not be loaded.</p>}
      {tab === "users" && users.data && <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"><table className="w-full text-left text-sm"><thead className="border-b border-slate-200 dark:border-slate-800"><tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Action</th></tr></thead><tbody>{users.data.map((item) => <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800"><td className="p-4">{item.firstName} {item.lastName}</td><td className="p-4">{item.email}</td><td className="p-4 capitalize">{item.role}</td><td className="p-4"><button onClick={() => window.confirm("Delete this user?") && removeUser.mutate(item._id)} className="font-semibold text-rose-600">Delete</button></td></tr>)}</tbody></table></div>}
      {tab === "events" && events.data && <div className="grid gap-4 md:grid-cols-2">{events.data.map((item) => <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"><p className="text-xs font-bold uppercase text-indigo-600">{item.category}</p><h2 className="mt-2 text-lg font-bold">{item.title}</h2><p className="mt-1 text-sm text-slate-500">{item.venue}</p><button onClick={() => window.confirm("Delete this event?") && removeEvent.mutate(item._id)} className="mt-4 text-sm font-semibold text-rose-600">Delete event</button></article>)}</div>}
      {tab === "bookings" && bookings.data && <div className="space-y-3">{bookings.data.map((item) => <article key={item._id} className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-5 text-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-4"><strong>{item.bookingRef}</strong><span>{item.event?.title}</span><span>{item.quantity} ticket(s)</span><span className="capitalize text-indigo-600">{item.status}</span></article>)}</div>}
    </section>
  );
}
