"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { dashboardApi } from "@/lib/api/dashboard-api";

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string };

export default function PasswordPage() {
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<PasswordForm>();
  const update = useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordForm) => dashboardApi.updatePassword({ currentPassword, newPassword }),
    onSuccess: () => { toast.success("Password changed successfully."); reset(); },
    onError: () => toast.error("Password could not be changed. Check your current password."),
  });
  const submit = (values: PasswordForm) => {
    if (values.newPassword !== values.confirmPassword) return setError("confirmPassword", { message: "Passwords do not match" });
    update.mutate(values);
  };

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Security</p><h1 className="mt-2 text-3xl font-black">Change password</h1>
      <form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)}>
        {([["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm password"]] as const).map(([name, label]) => (
          <label key={name} className="block text-sm font-semibold">{label}<input className="input-shell mt-2" type="password" {...register(name, { required: `${label} is required`, minLength: { value: 8, message: "Use at least 8 characters" } })} />{errors[name] && <span className="text-xs text-rose-600">{errors[name]?.message}</span>}</label>
        ))}
        <button className="primary-btn" disabled={update.isPending}>{update.isPending ? "Updating…" : "Update password"}</button>
      </form>
    </section>
  );
}
