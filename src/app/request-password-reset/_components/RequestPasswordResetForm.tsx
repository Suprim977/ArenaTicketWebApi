"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { requestPasswordResetApi } from "@/lib/api/auth";

const requestPasswordResetSchema = z.object({
  email: z.string().email("Valid email is required"),
});

type RequestPasswordResetValues = z.infer<typeof requestPasswordResetSchema>;

export default function RequestPasswordResetForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<RequestPasswordResetValues>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: { email: "" },
  });

  const submit = async (values: RequestPasswordResetValues) => {
    try {
      const result = await requestPasswordResetApi({ email: values.email.trim().toLowerCase() });
      setSubmitted(true);
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Unable to request a password reset right now.");
    }
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <p className="label-mini">Account Recovery</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Check your inbox</h1>
        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          If that email belongs to an ArenaTicket account, we sent password reset instructions.
        </p>
        <Link href="/login" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-arena-indigo hover:underline">
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-blue-100 text-arena-indigo dark:bg-blue-950/50">
        <Mail size={24} />
      </div>
      <p className="label-mini mt-6">Account Recovery</p>
      <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Forgot your password?</h1>
      <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
        Enter your email address and we&apos;ll send a reset link if an account exists.
      </p>

      <form onSubmit={form.handleSubmit(submit)} className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="input-shell mt-2"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{form.formState.errors.email.message}</p>
          )}
        </div>

        <button type="submit" disabled={form.formState.isSubmitting} className="primary-btn w-full">
          {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-arena-indigo hover:underline">
        <ArrowLeft size={16} />
        Back to login
      </Link>
    </section>
  );
}
