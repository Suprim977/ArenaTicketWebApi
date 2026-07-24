"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordAction } from "@/lib/actions/auth-action";
import { ForgotPasswordSchemaType, forgotPasswordSchema } from "./schema";

export default function ForgetPasswordForm() {
  const [apiError, setApiError] = useState("");
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const form = useForm<ForgotPasswordSchemaType>({ resolver: zodResolver(forgotPasswordSchema) });

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const submit = async (values: ForgotPasswordSchemaType) => {
    if (cooldown > 0) return;
    setApiError("");
    const result = await forgotPasswordAction({ email: values.email.trim().toLowerCase() });
    if (!result.ok) {
      setApiError(result.message);
      return;
    }
    setSent(true);
    setCooldown(30);
  };

  if (sent) {
    return <section className="mx-auto max-w-lg text-center"><span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"><CheckCircle2 size={34} /></span><p className="label-mini mt-6">Account Recovery</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Check your email</h1><p className="mx-auto mt-4 max-w-md leading-7 text-slate-600 dark:text-slate-300">If an ArenaTicket account exists for this email, we&apos;ve sent password reset instructions.</p><div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60"><p className="text-sm text-slate-500">Didn&apos;t receive it?</p><button type="button" onClick={form.handleSubmit(submit)} disabled={cooldown > 0 || form.formState.isSubmitting} className="mt-2 font-bold text-indigo-600 disabled:cursor-not-allowed disabled:text-slate-400">{form.formState.isSubmitting ? "Sending..." : cooldown > 0 ? `Resend available in ${cooldown}s` : "Send Again"}</button></div>{apiError && <p role="alert" className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{apiError}</p>}<Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"><ArrowLeft size={16} />Back to Login</Link></section>;
  }

  return (
    <section className="mx-auto max-w-lg">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"><Mail size={24} /></div>
      <p className="label-mini mt-6">Account Recovery</p>
      <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Forgot your password?</h1>
      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">No worries. Enter the email address associated with your ArenaTicket account and we&apos;ll send you instructions to reset your password.</p>
      <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-5">
        <div><label htmlFor="recoveryEmail" className="text-sm font-semibold text-slate-700 dark:text-slate-200">Email address</label><input id="recoveryEmail" className="input-shell mt-2" type="email" autoComplete="email" placeholder="you@example.com" {...form.register("email")} />{form.formState.errors.email && <p className="mt-1.5 text-xs font-medium text-rose-600">{form.formState.errors.email.message}</p>}</div>
        {apiError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{apiError}</p>}
        <button type="submit" disabled={form.formState.isSubmitting} className="primary-btn w-full">{form.formState.isSubmitting ? "Sending..." : "Send Reset Link"}</button>
      </form>
      <Link href="/login" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-indigo-600"><ArrowLeft size={16} />Back to Login</Link>
    </section>
  );
}
