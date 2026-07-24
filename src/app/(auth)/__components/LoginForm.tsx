"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { LoginSchemaType, loginSchema } from "./schema";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginSchemaType) => {
    setApiError("");
    try {
      const result = await loginAction(values);
      if (!result.ok || !result.data?.token) {
        setApiError(result.message || "Login failed. Please try again.");
        return;
      }
      login(result.data.token, result.data.user);
      router.replace(result.data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setApiError("Unable to sign in right now. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">Sign In</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue to ArenaTicket</h2>
      </div>
      <button type="button" className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
        <Image src="/google.svg" alt="" width={20} height={20} />
        Continue with Google
      </button>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini" htmlFor="loginEmail">Email</label>
          <input id="loginEmail" className="input-shell mt-1" type="email" autoComplete="email" placeholder="fan@arenaticket.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label-mini" htmlFor="loginPassword">Password</label>
          <div className="relative">
            <input id="loginPassword" className="input-shell mt-1 pr-11" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" {...register("password")} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:text-slate-800 dark:hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        {apiError && <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}
        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">{isSubmitting ? "Signing you in..." : "Sign In"}</button>
      </form>
      <p className="text-sm text-gray-600 dark:text-slate-300">New here? <Link href="/register" className="font-semibold text-arena-indigo">Sign Up</Link>{" | "}<Link href="/forgot-password" className="font-semibold text-arena-indigo">Forgot password?</Link></p>
    </div>
  );
}
