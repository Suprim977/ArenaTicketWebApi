"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { CheckCircle2, Eye, EyeOff, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { resetPasswordApi } from "@/lib/api/auth";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain an uppercase letter")
      .regex(/[a-z]/, "Password must contain a lowercase letter")
      .regex(/\d/, "Password must contain a number")
      .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

type Props = {
  token: string;
};

export default function ResetPasswordForm({ token }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [done, setDone] = useState(false);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const submit = async (values: ResetPasswordValues) => {
    try {
      const result = await resetPasswordApi({
        token,
        newPassword: values.password,
      });
      setDone(true);
      toast.success(result.message);
    } catch (error: unknown) {
      const apiError = error as AxiosError<{ message?: string }>;
      toast.error(apiError.response?.data?.message ?? "Unable to reset your password right now.");
    }
  };

  if (done) {
    return (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 size={34} />
        </span>
        <h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">Password updated</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Your ArenaTicket password has been reset successfully.
        </p>
        <Link href="/login" className="primary-btn mt-8 w-full">
          Continue to login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        <ShieldAlert size={24} />
      </div>
      <p className="label-mini mt-6">Password Reset</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Create a new password</h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Choose a strong password you have not used before.
      </p>

      <form onSubmit={form.handleSubmit(submit)} className="mt-8 space-y-5">
        <PasswordField
          label="New password"
          id="password"
          visible={showPassword}
          onToggle={() => setShowPassword((current) => !current)}
          register={form.register("password")}
          error={form.formState.errors.password?.message}
        />
        <PasswordField
          label="Confirm password"
          id="confirmPassword"
          visible={showConfirmPassword}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          register={form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword?.message}
        />

        <button type="submit" disabled={form.formState.isSubmitting || !token} className="primary-btn w-full">
          {form.formState.isSubmitting ? "Resetting..." : "Reset password"}
        </button>
      </form>

      <Link
        href="/request-password-reset"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-arena-indigo hover:underline"
      >
        <span aria-hidden="true">←</span>
        Request a new link
      </Link>
    </section>
  );
}

function PasswordField({
  label,
  id,
  visible,
  onToggle,
  register,
  error,
}: {
  label: string;
  id: string;
  visible: boolean;
  onToggle: () => void;
  register: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          className="input-shell mt-2 pr-11"
          {...register}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
