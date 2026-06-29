"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { updatePasswordAction } from "@/lib/actions/auth-action";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function PasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (values: PasswordFormValues) => {
    const result = await updatePasswordAction({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    toast.success("Password changed successfully");
    reset();
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label-mini">Current Password</label>
          <input className="input-shell mt-1" type="password" {...register("currentPassword")} />
          {errors.currentPassword && <p className="mt-1 text-xs text-red-500">{errors.currentPassword.message}</p>}
        </div>

        <div>
          <label className="label-mini">New Password</label>
          <input className="input-shell mt-1" type="password" {...register("newPassword")} />
          {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="label-mini">Confirm Password</label>
          <input className="input-shell mt-1" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        <button className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
