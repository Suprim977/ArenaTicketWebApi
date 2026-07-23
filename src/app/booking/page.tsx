"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import SectionHeader from "@/components/SectionHeader";
import BookingSummary from "@/components/BookingSummary";
import { createBookingAction, getEventsAction } from "@/lib/actions/arena-action";
import { mockEvents } from "@/lib/mock/arena-data";
import { bookingSchema, type BookingSchemaInput, type BookingSchemaType } from "@/lib/schemas/booking-schema";
import type { ArenaEvent } from "@/types/arena";

export default function BookingPage() {
  const router = useRouter();
  const [events, setEvents] = useState<ArenaEvent[]>(mockEvents);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BookingSchemaInput, unknown, BookingSchemaType>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventId: mockEvents[0].id,
      seatType: "General",
      quantity: 1,
      attendeeName: "Jordan Fan",
      attendeeEmail: "fan@arenaticket.com",
    },
  });

  const eventId = useWatch({ control, name: "eventId" });
  const seatType = useWatch({ control, name: "seatType" });
  const quantity = useWatch({ control, name: "quantity" });

  useEffect(() => {
    const loadEvents = async () => {
      const result = await getEventsAction();
      if (result.data?.length) {
        setEvents(result.data);
      }
      setLoading(false);
    };

    void loadEvents();
  }, []);

  const selectedEvent = useMemo(() => events.find((item) => item.id === eventId) || events[0], [eventId, events]);

  const onSubmit = async (values: BookingSchemaType) => {
    setApiError("");
    setSubmitLoading(true);

    const result = await createBookingAction(values);
    const booking = result.data;

    if (!result.ok || !booking) {
      setApiError(result.message || "Booking could not be created.");
      setSubmitLoading(false);
      return;
    }

    const existing = JSON.parse(localStorage.getItem("arenaticket-bookings") || "[]");
    localStorage.setItem("arenaticket-bookings", JSON.stringify([booking, ...existing]));
    localStorage.setItem("arenaticket-last-booking", JSON.stringify(booking));

    setSubmitLoading(false);
    router.push(`/ticket/${booking.bookingRef}`);
  };

  if (loading) {
    return <main className="mx-auto min-h-screen max-w-6xl px-6 py-10"><p className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">Loading booking flow...</p></main>;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <SectionHeader
        eyebrow="Booking"
        title="Reserve your seat"
        description="Choose an event, pick a seat tier, and confirm the attendee details to generate your ArenaTicket booking."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
          <div>
            <label className="label-mini">Event</label>
            <select className="input-shell mt-1" {...register("eventId", { onChange: (event) => setValue("eventId", event.target.value) })}>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            {errors.eventId && <p className="mt-1 text-xs text-red-500">{errors.eventId.message}</p>}
          </div>

          <div>
            <label className="label-mini">Seat type</label>
            <select className="input-shell mt-1" {...register("seatType")}>
              <option>General</option>
              <option>Premium</option>
              <option>VIP</option>
            </select>
            {errors.seatType && <p className="mt-1 text-xs text-red-500">{errors.seatType.message}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="label-mini">Quantity</label>
              <input className="input-shell mt-1" type="number" min={1} max={10} {...register("quantity")} />
              {errors.quantity && <p className="mt-1 text-xs text-red-500">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="label-mini">Attendee name</label>
              <input className="input-shell mt-1" {...register("attendeeName")} />
              {errors.attendeeName && <p className="mt-1 text-xs text-red-500">{errors.attendeeName.message}</p>}
            </div>
          </div>

          <div>
            <label className="label-mini">Attendee email</label>
            <input className="input-shell mt-1" type="email" {...register("attendeeEmail")} />
            {errors.attendeeEmail && <p className="mt-1 text-xs text-red-500">{errors.attendeeEmail.message}</p>}
          </div>

          {apiError && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">{apiError}</p>}

          <button type="submit" disabled={submitLoading} className="primary-btn w-full">
            {submitLoading ? "Creating booking..." : "Confirm Booking"}
          </button>
        </form>

        <BookingSummary event={selectedEvent} seatType={seatType} quantity={Number(quantity)} />
      </div>
    </main>
  );
}
