"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuth } from "@/lib/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";
import { adminLoginSchema, type AdminLoginSchemaType } from "@/app/(auth)/__components/admin-schema";

export default function AdminLoginForm() {
  const router = useRouter();
  const { login, setUser, logout } = useAuth();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminLoginSchemaType>({ resolver: zodResolver(adminLoginSchema) });

  const onSubmit = async (values: AdminLoginSchemaType) => {
    setApiError("");
    const result = await authService.loginAdmin(values);
    const user = result.data?.user;
    if (!result.ok || !user) {
      setApiError(result.message || "Admin login failed.");
      return;
    }
    if (user.role !== "admin") {
      logout();
      setApiError("Administrator access is required.");
      return;
    }
    const authUser: AuthUser = {
      _id: user.id,
      email: user.email,
      role: "admin",
      person: { firstName: user.fullName },
    };
    if (result.data?.token) {
      login(result.data.token, authUser);
    } else {
      setUser(authUser);
    }
    toast.success("Admin login successful.");
    router.replace("/admin/dashboard");
  };

  return (
    <div className="space-y-6 lg:min-w-136">
      <div className="space-y-2">
        <p className="label-mini">Admin Access</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Sign in with your administrator account.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label-mini" htmlFor="adminLoginEmail">Email</label>
          <input id="adminLoginEmail" className="input-shell mt-1" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="label-mini" htmlFor="adminLoginPassword">Password</label>
          <div className="relative">
            <input id="adminLoginPassword" className="input-shell mt-1 pr-11" type={showPassword ? "text" : "password"} autoComplete="current-password" {...register("password")} />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        {apiError && <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}
        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">{isSubmitting ? "Signing in..." : "Login as Admin"}</button>
      </form>
      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-slate-300">
        <Link href="/request-password-reset" className="font-semibold text-arena-indigo">Forgot Password?</Link>
        <Link href="/admin/register" className="font-semibold text-arena-indigo">Admin Registration</Link>
      </div>
    </div>
  );
}
