"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import type { AuthUser } from "@/types/auth";
import { adminRegisterSchema, type AdminRegisterSchemaType } from "@/app/(auth)/__components/admin-schema";

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

export default function AdminRegisterForm() {
  const router = useRouter();
  const { login, logout } = useAuth();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegisterSchemaType>({
    resolver: zodResolver(adminRegisterSchema),
  });

  const onSubmit = async (values: AdminRegisterSchemaType) => {
    setApiError("");
    try {
      const result = await authService.registerAdmin(values);
      const user = result.data?.user;

      if (!result.ok || !user) {
        setApiError(result.message || "Admin registration failed. Please try again.");
        return;
      }

      if (user.role !== "admin") {
        logout();
        setApiError("Access denied. Administrator role required.");
        return;
      }

      if (result.data?.token) {
        const authUser: AuthUser = {
          _id: user.id,
          email: user.email,
          role: "admin",
          person: { firstName: user.fullName },
        };
        login(result.data.token, authUser);
      } else {
        logout();
      }

      reset();
      toast.success("Admin account created successfully. Please log in to continue.");
      router.replace("/admin/dashboard");
    } catch {
      setApiError("Unable to create your admin account right now. Please try again.");
    }
  };

  return (
    <div className="space-y-6 lg:min-w-136">
      <div className="space-y-2">
        <p className="label-mini">Create Account</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join ArenaTicket Admin</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Create your admin account to manage ArenaTicket operations.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="label-mini" htmlFor="fullName">Full Name</label>
          <input id="fullName" autoComplete="name" className="input-shell mt-1" {...register("fullName")} />
          <ErrorText message={errors.fullName?.message} />
        </div>

        <div>
          <label className="label-mini" htmlFor="email">Email</label>
          <input id="email" autoComplete="email" className="input-shell mt-1" type="email" placeholder="example@email.com" {...register("email")} />
          <ErrorText message={errors.email?.message} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-mini" htmlFor="password">Password</label>
            <div className="relative">
              <input
                id="password"
                autoComplete="new-password"
                className="input-shell mt-1 pr-11"
                type={showPassword ? "text" : "password"}
                placeholder="Password@123"
                {...register("password")}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorText message={errors.password?.message} />
          </div>

          <div>
            <label className="label-mini" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                autoComplete="new-password"
                className="input-shell mt-1 pr-11"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password@123"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorText message={errors.confirmPassword?.message} />
          </div>
        </div>

        <div>
          <label className="label-mini" htmlFor="adminRegistrationCode">Admin Registration Code</label>
          <input id="adminRegistrationCode" autoComplete="off" className="input-shell mt-1" {...register("adminRegistrationCode")} />
          <ErrorText message={errors.adminRegistrationCode?.message} />
        </div>

        <p className="text-xs leading-5 text-slate-500">Use 8+ characters with uppercase, lowercase, number, and special character.</p>

        {apiError && (
          <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">
            {apiError}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">
          {isSubmitting ? "Creating account..." : "Register as Admin"}
        </button>
      </form>

      <p className="text-sm text-gray-600 dark:text-slate-300">
        Already have admin access?{" "}
        <Link href="/admin/login" className="font-semibold text-arena-indigo">
          Admin Login
        </Link>
      </p>
    </div>
  );
}
