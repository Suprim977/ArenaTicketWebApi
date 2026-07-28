"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import EventForm from "@/app/admin/__components/EventForm";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import { getApiErrorMessage } from "@/lib/api/error-message";

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const event = useQuery({ queryKey: ["admin-event", id], queryFn: () => dashboardApi.getAdminEvent(id) });

  if (event.isLoading) return <DashboardSkeleton cards={1} />;
  if (event.isError || !event.data) return <p className="rounded-xl bg-rose-50 p-4 text-rose-700">{getApiErrorMessage(event.error, "Event could not be loaded.")}</p>;

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <header><p className="label-mini">Events</p><h1 className="mt-2 text-3xl font-black">Edit event</h1></header>
      <EventForm initialEvent={event.data} submitLabel="Save Changes" onSubmit={(payload, eventImage) => dashboardApi.updateAdminEvent(id, payload, eventImage)} />
    </section>
  );
}
