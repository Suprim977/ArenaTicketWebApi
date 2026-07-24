"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { AdminEventPayload } from "@/lib/api/dashboard-api";
import type { Event } from "@/types/event";

const eventSchema = z.object({
  title: z.string().trim().min(2, "Event name is required"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Time is required"),
  venue: z.string().trim().min(2, "Venue is required"),
  stadium: z.string().trim().min(2, "Stadium is required"),
  normalPrice: z.coerce.number().min(0, "Normal price cannot be negative"),
  vipPrice: z.coerce.number().min(0, "VIP price cannot be negative"),
  normalAvailability: z.coerce.number().int().min(0, "Availability cannot be negative"),
  vipAvailability: z.coerce.number().int().min(0, "Availability cannot be negative"),
  active: z.boolean(),
});

type EventFormValues = z.infer<typeof eventSchema>;
type EventFormInput = z.input<typeof eventSchema>;
type EventFormProps = {
  initialEvent?: Event;
  submitLabel: string;
  onSubmit: (payload: AdminEventPayload) => Promise<Event>;
};

export default function EventForm({ initialEvent, submitLabel, onSubmit }: EventFormProps) {
  const router = useRouter();
  const [image, setImage] = useState<File>();
  const normal = initialEvent?.tiers?.find((tier) => tier.name.toLowerCase() === "normal");
  const vip = initialEvent?.tiers?.find((tier) => tier.name.toLowerCase() === "vip");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormInput, unknown, EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialEvent?.title ?? "",
      description: initialEvent?.description ?? "",
      date: initialEvent?.date?.slice(0, 10) ?? "",
      startTime: initialEvent?.startTime ?? "",
      venue: initialEvent?.venue ?? "",
      stadium: initialEvent?.stadium ?? "",
      normalPrice: normal?.price ?? 600,
      vipPrice: vip?.price ?? 1500,
      normalAvailability: normal?.available ?? 0,
      vipAvailability: vip?.available ?? 0,
      active: initialEvent?.active ?? true,
    },
  });

  const submit = async (values: EventFormValues) => {
    try {
      await onSubmit({ ...values, image });
      toast.success(initialEvent ? "Event updated successfully." : "Event created successfully.");
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "The event could not be saved."));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">Event name<input className="input-shell mt-2" {...register("title")} />{errors.title && <span className="mt-1 block text-xs text-rose-600">{errors.title.message}</span>}</label>
        <label className="text-sm font-semibold">Venue<input className="input-shell mt-2" {...register("venue")} />{errors.venue && <span className="mt-1 block text-xs text-rose-600">{errors.venue.message}</span>}</label>
        <label className="text-sm font-semibold">Stadium<input className="input-shell mt-2" {...register("stadium")} />{errors.stadium && <span className="mt-1 block text-xs text-rose-600">{errors.stadium.message}</span>}</label>
        <label className="text-sm font-semibold">Event image<input className="input-shell mt-2" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0])} /></label>
        <label className="text-sm font-semibold">Date<input className="input-shell mt-2" type="date" {...register("date")} />{errors.date && <span className="mt-1 block text-xs text-rose-600">{errors.date.message}</span>}</label>
        <label className="text-sm font-semibold">Time<input className="input-shell mt-2" type="time" {...register("startTime")} />{errors.startTime && <span className="mt-1 block text-xs text-rose-600">{errors.startTime.message}</span>}</label>
      </div>
      <label className="block text-sm font-semibold">Description<textarea className="input-shell mt-2 min-h-28" {...register("description")} />{errors.description && <span className="mt-1 block text-xs text-rose-600">{errors.description.message}</span>}</label>
      <div>
        <h2 className="font-bold">Ticket prices and availability</h2>
        <div className="mt-3 grid gap-5 md:grid-cols-2">
          <label className="text-sm font-semibold">Normal Ticket Price<input className="input-shell mt-2" type="number" min={0} {...register("normalPrice")} />{errors.normalPrice && <span className="mt-1 block text-xs text-rose-600">{errors.normalPrice.message}</span>}</label>
          <label className="text-sm font-semibold">VIP Ticket Price<input className="input-shell mt-2" type="number" min={0} {...register("vipPrice")} />{errors.vipPrice && <span className="mt-1 block text-xs text-rose-600">{errors.vipPrice.message}</span>}</label>
          <label className="text-sm font-semibold">Normal tickets available<input className="input-shell mt-2" type="number" min={0} {...register("normalAvailability")} />{errors.normalAvailability && <span className="mt-1 block text-xs text-rose-600">{errors.normalAvailability.message}</span>}</label>
          <label className="text-sm font-semibold">VIP tickets available<input className="input-shell mt-2" type="number" min={0} {...register("vipAvailability")} />{errors.vipAvailability && <span className="mt-1 block text-xs text-rose-600">{errors.vipAvailability.message}</span>}</label>
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" className="size-4" {...register("active")} /> Active and visible to users</label>
      <div className="flex gap-3">
        <button type="submit" disabled={isSubmitting} className="primary-btn">{isSubmitting ? "Saving..." : submitLabel}</button>
        <button type="button" onClick={() => router.back()} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">Cancel</button>
      </div>
    </form>
  );
}
