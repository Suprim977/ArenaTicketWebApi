"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CheckCircle2, Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch, type UseFormRegisterReturn } from "react-hook-form";
import { resetPasswordAction } from "@/lib/actions/auth-action";
import { ResetPasswordSchemaType, resetPasswordSchema } from "./schema";

const requirements = [
  ["At least 8 characters", (value: string) => value.length >= 8],
  ["Uppercase letter", (value: string) => /[A-Z]/.test(value)],
  ["Lowercase letter", (value: string) => /[a-z]/.test(value)],
  ["Number", (value: string) => /\d/.test(value)],
  ["Special character", (value: string) => /[^A-Za-z0-9]/.test(value)],
] as const;

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("resetToken") || "";
  const [state, setState] = useState<"form" | "success" | "expired">(token ? "form" : "expired");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<ResetPasswordSchemaType>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: "", confirmPassword: "" } });
  const password = useWatch({ control: form.control, name: "password" }) ?? "";

  const submit = async (values: ResetPasswordSchemaType) => {
    setApiError("");
    const result = await resetPasswordAction({ token, password: values.password, confirmPassword: values.confirmPassword });
    if (!result.ok) {
      if (/token|expired|invalid|reset link/i.test(result.message)) {
        setState("expired");
        return;
      }
      setApiError(result.message);
      return;
    }
    setState("success");
  };

  if (state === "success") return <ResultState icon={<CheckCircle2 size={34} />} title="Password reset successful" description="Your ArenaTicket password has been updated successfully."><Link href="/login" className="primary-btn mt-7 w-full">Continue to Login</Link></ResultState>;
  if (state === "expired") return <ResultState icon={<X size={34} />} title="Reset link expired" description="This password reset link is no longer valid. Request a new one to continue." destructive><Link href="/forgot-password" className="primary-btn mt-7 w-full">Request New Reset Link</Link><Link href="/login" className="mt-4 inline-block text-sm font-bold text-indigo-600">Back to Login</Link></ResultState>;

  return (
    <section className="mx-auto max-w-lg">
      <p className="label-mini">Password Reset</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Create new password</h1><p className="mt-3 text-slate-600 dark:text-slate-300">Choose a strong password you haven&apos;t used before.</p>
      <form onSubmit={form.handleSubmit(submit)} className="mt-7 space-y-5">
        <PasswordField id="newPassword" label="New Password" visible={showPassword} toggle={() => setShowPassword((value) => !value)} registration={form.register("password")} error={form.formState.errors.password?.message} />
        <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/60">{requirements.map(([label, test]) => { const valid = test(password); return <p key={label} className={`flex items-center gap-2 ${valid ? "text-emerald-700 dark:text-emerald-300" : "text-slate-500"}`}>{valid ? <Check size={15} /> : <span className="size-[15px] rounded-full border border-current" />}{label}</p>; })}</div>
        <PasswordField id="confirmNewPassword" label="Confirm New Password" visible={showConfirmPassword} toggle={() => setShowConfirmPassword((value) => !value)} registration={form.register("confirmPassword")} error={form.formState.errors.confirmPassword?.message} />
        {apiError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">{apiError}</p>}
        <button type="submit" disabled={form.formState.isSubmitting} className="primary-btn w-full">{form.formState.isSubmitting ? "Resetting password..." : "Reset Password"}</button>
      </form>
      <Link href="/login" className="mt-6 inline-block text-sm font-bold text-indigo-600">Back to Login</Link>
    </section>
  );
}

function PasswordField({ id, label, visible, toggle, registration, error }: { id: string; label: string; visible: boolean; toggle: () => void; registration: UseFormRegisterReturn; error?: string }) {
  return <div><label htmlFor={id} className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label><div className="relative"><input id={id} className="input-shell mt-2 pr-11" type={visible ? "text" : "password"} autoComplete="new-password" placeholder="••••••••" {...registration} /><button type="button" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}</div>;
}

function ResultState({ icon, title, description, destructive = false, children }: { icon: React.ReactNode; title: string; description: string; destructive?: boolean; children: React.ReactNode }) {
  return <section className="mx-auto max-w-lg text-center"><span className={`mx-auto flex size-16 items-center justify-center rounded-full ${destructive ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"}`}>{icon}</span><h1 className="mt-6 text-3xl font-black text-slate-950 dark:text-white">{title}</h1><p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{description}</p>{children}</section>;
}
