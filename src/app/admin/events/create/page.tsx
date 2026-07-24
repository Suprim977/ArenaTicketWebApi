"use client";

import EventForm from "@/app/admin/__components/EventForm";
import { dashboardApi } from "@/lib/api/dashboard-api";

export default function CreateEventPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <header><p className="label-mini">Events</p><h1 className="mt-2 text-3xl font-black">Create event</h1></header>
      <EventForm submitLabel="Create Event" onSubmit={dashboardApi.createAdminEvent} onUploadImage={dashboardApi.uploadEventImage} />
    </section>
  );
}
