"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import DeleteModal from "@/app/admin/__components/DeleteModal";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function AdminEventsPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const events = useQuery({ queryKey: ["admin-events"], queryFn: dashboardApi.getAdminEvents });
  const remove = useMutation({
    mutationFn: dashboardApi.deleteAdminEvent,
    onSuccess: async () => {
      setDeleteId(null);
      await queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Event could not be deleted.")),
  });

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="label-mini">Events</p><h1 className="mt-2 text-3xl font-black">Event management</h1><p className="mt-2 text-sm text-slate-500">Manage event details, availability, status, and backend ticket prices.</p></div>
        <Link href="/admin/events/create" className="primary-btn">Add Event</Link>
      </header>
      {events.isLoading && <DashboardSkeleton cards={3} />}
      {events.isError && <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(events.error, "Events could not be loaded.")}</p>}
      {events.data && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800"><tr><th className="px-4 py-3">Event</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Normal</th><th className="px-4 py-3">VIP</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
            <tbody>{events.data.map((event) => {
              const id = event._id || event.id || "";
              const normal = event.tiers?.find((tier) => tier.name.toLowerCase() === "normal");
              const vip = event.tiers?.find((tier) => tier.name.toLowerCase() === "vip");
              return <tr key={id} className="border-t border-slate-100 dark:border-slate-800"><td className="px-4 py-4"><p className="font-bold">{event.title}</p><p className="text-xs text-slate-500">{event.venue}</p></td><td className="px-4 py-4">{new Date(event.date).toLocaleDateString()}</td><td className="px-4 py-4">Rs {(normal?.price ?? 0).toLocaleString("en-NP")}</td><td className="px-4 py-4">Rs {(vip?.price ?? 0).toLocaleString("en-NP")}</td><td className="px-4 py-4 capitalize">{event.active === false ? "inactive" : event.status}</td><td className="px-4 py-4"><div className="flex gap-3"><Link href={`/event/${id}`} className="font-semibold text-slate-600">View</Link><Link href={`/admin/events/${id}/edit`} className="font-semibold text-indigo-600">Edit</Link><button onClick={() => setDeleteId(id)} className="font-semibold text-rose-600">Delete</button></div></td></tr>;
            })}</tbody>
          </table>
          {!events.data.length && <p className="p-8 text-center text-slate-500">No events found.</p>}
        </div>
      )}
      <DeleteModal open={Boolean(deleteId)} loading={remove.isPending} onClose={() => setDeleteId(null)} onConfirm={() => deleteId && remove.mutate(deleteId)} title="Delete Event" message="Are you sure you want to delete this event?" />
    </section>
  );
}
