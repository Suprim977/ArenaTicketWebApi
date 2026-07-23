"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { dashboardApi } from "@/lib/api/dashboard-api";
import type { UpdateUserPayload } from "@/types/user";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["current-user"], queryFn: dashboardApi.getMe });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserPayload>();
  useEffect(() => {
    if (profile.data) reset({ firstName: profile.data.firstName ?? "", lastName: profile.data.lastName ?? "", email: profile.data.email });
  }, [profile.data, reset]);
  const update = useMutation({
    mutationFn: dashboardApi.updateMe,
    onSuccess: (user) => {
      queryClient.setQueryData(["current-user"], user);
      toast.success("Profile updated successfully.");
    },
    onError: () => toast.error("Your profile could not be updated."),
  });
  if (profile.isLoading) return <DashboardSkeleton cards={1} />;

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Profile</p>
      <h1 className="mt-2 text-3xl font-black">Personal details</h1>
      <form className="mt-7 space-y-4" onSubmit={handleSubmit((values) => update.mutate(values))}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold">First name<input className="input-shell mt-2" {...register("firstName", { required: "First name is required" })} />{errors.firstName && <span className="text-xs text-rose-600">{errors.firstName.message}</span>}</label>
          <label className="text-sm font-semibold">Last name<input className="input-shell mt-2" {...register("lastName", { required: "Last name is required" })} />{errors.lastName && <span className="text-xs text-rose-600">{errors.lastName.message}</span>}</label>
        </div>
        <label className="block text-sm font-semibold">Email<input className="input-shell mt-2" type="email" {...register("email", { required: "Email is required" })} />{errors.email && <span className="text-xs text-rose-600">{errors.email.message}</span>}</label>
        <button className="primary-btn" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save changes"}</button>
      </form>
    </section>
  );
}
