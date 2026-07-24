"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getApiErrorMessage } from "@/lib/api/error-message";
import type { AdminEventPayload } from "@/lib/api/dashboard-api";
import type { Event } from "@/types/event";

const schema = z.object({
  title: z.string().trim().min(2, "Event name is required"),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  category: z.string().trim().min(2, "Category is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location: z.string().trim().min(2, "Venue is required"),
  imageUrl: z.string().url("Enter a valid image URL"),
  format: z.string().trim().min(2, "Format is required"),
  prizePool: z.coerce.number().min(0),
  normalPrice: z.coerce.number().positive(),
  vipPrice: z.coerce.number().positive(),
  normalCapacity: z.coerce.number().int().positive(),
  vipCapacity: z.coerce.number().int().positive(),
  availability: z.boolean(),
});

type Input = z.input<typeof schema>;
type Values = z.infer<typeof schema>;
type Props = { initialEvent?: Event; submitLabel: string; onSubmit: (payload: AdminEventPayload) => Promise<Event> };

export default function EventForm({ initialEvent, submitLabel, onSubmit }: Props) {
  const router = useRouter();
  const normal = initialEvent?.tiers?.find((tier) => /^(normal|standard)$/i.test(tier.name));
  const vip = initialEvent?.tiers?.find((tier) => /^vip$/i.test(tier.name));
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Input, unknown, Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialEvent?.title ?? "",
      slug: initialEvent?.slug ?? "",
      description: initialEvent?.description ?? "",
      category: initialEvent?.category ?? "",
      date: initialEvent?.date?.slice(0, 10) ?? "",
      time: initialEvent?.time ?? initialEvent?.startTime ?? "",
      location: initialEvent?.location ?? initialEvent?.venue ?? "",
      imageUrl: initialEvent?.imageUrl ?? initialEvent?.image ?? "",
      format: initialEvent?.format ?? "",
      prizePool: initialEvent?.prizePool ?? 0,
      normalPrice: initialEvent?.ticketPrices?.normal ?? normal?.price ?? 600,
      vipPrice: initialEvent?.ticketPrices?.vip ?? vip?.price ?? 1500,
      normalCapacity: normal?.capacity ?? normal?.available ?? 1,
      vipCapacity: vip?.capacity ?? vip?.available ?? 1,
      availability: initialEvent?.availability ?? true,
    },
  });

  const submit = async (values: Values) => {
    try {
      await onSubmit(values);
      toast.success(initialEvent ? "Event updated successfully." : "Event created successfully.");
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "The event could not be saved."));
    }
  };
  const fieldError = (name: keyof Values) => errors[name] ? <span className="mt-1 block text-xs text-rose-600">{errors[name]?.message}</span> : null;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">Event name<input className="input-shell mt-2" {...register("title")} />{fieldError("title")}</label>
        <label className="text-sm font-semibold">Slug<input className="input-shell mt-2" placeholder="event-name-kathmandu" {...register("slug")} />{fieldError("slug")}</label>
        <label className="text-sm font-semibold">Category / game<input className="input-shell mt-2" {...register("category")} />{fieldError("category")}</label>
        <label className="text-sm font-semibold">Venue<input className="input-shell mt-2" {...register("location")} />{fieldError("location")}</label>
        <label className="text-sm font-semibold">Date<input className="input-shell mt-2" type="date" {...register("date")} />{fieldError("date")}</label>
        <label className="text-sm font-semibold">Time<input className="input-shell mt-2" type="time" {...register("time")} />{fieldError("time")}</label>
        <label className="text-sm font-semibold">Image URL<input className="input-shell mt-2" type="url" {...register("imageUrl")} />{fieldError("imageUrl")}</label>
        <label className="text-sm font-semibold">Tournament format<input className="input-shell mt-2" placeholder="Double Elimination • Best of 3" {...register("format")} />{fieldError("format")}</label>
        <label className="text-sm font-semibold">Prize pool (Rs)<input className="input-shell mt-2" type="number" min={0} {...register("prizePool")} />{fieldError("prizePool")}</label>
      </div>
      <label className="block text-sm font-semibold">Description<textarea className="input-shell mt-2 min-h-28" {...register("description")} />{fieldError("description")}</label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-semibold">Standard price<input className="input-shell mt-2" type="number" min={1} {...register("normalPrice")} />{fieldError("normalPrice")}</label>
        <label className="text-sm font-semibold">VIP price<input className="input-shell mt-2" type="number" min={1} {...register("vipPrice")} />{fieldError("vipPrice")}</label>
        <label className="text-sm font-semibold">Standard capacity<input className="input-shell mt-2" type="number" min={1} {...register("normalCapacity")} />{fieldError("normalCapacity")}</label>
        <label className="text-sm font-semibold">VIP capacity<input className="input-shell mt-2" type="number" min={1} {...register("vipCapacity")} />{fieldError("vipCapacity")}</label>
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold"><input type="checkbox" className="size-4" {...register("availability")} /> Tickets available</label>
      <div className="flex gap-3"><button type="submit" disabled={isSubmitting} className="primary-btn">{isSubmitting ? "Saving..." : submitLabel}</button><button type="button" onClick={() => router.back()} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold dark:border-slate-700">Cancel</button></div>
    </form>
  );
}
