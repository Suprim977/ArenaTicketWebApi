"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { RegisterSchemaType, registerSchema } from "./schema";

export default function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterSchemaType) => {
    setApiError("");

    try {
      const result = await registerAction({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });

      if (!result.ok || !result.data?.token) {
        setApiError(result.message || "Registration failed. Please try again.");
        return;
      }

      login(result.data.token, result.data.user);
      router.replace("/dashboard");
    } catch (error) {
      console.error("[RegisterForm] Registration failed", error);
      setApiError("Unable to create your account right now. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">Create Account</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join ArenaTicket</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini" htmlFor="firstName">First Name</label>
          <input id="firstName" autoComplete="given-name" className="input-shell mt-1" placeholder="Jordan" {...register("firstName")} />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="label-mini" htmlFor="lastName">Last Name</label>
          <input id="lastName" autoComplete="family-name" className="input-shell mt-1" placeholder="Fan" {...register("lastName")} />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="label-mini">Email</label>
          <input className="input-shell mt-1" type="email" placeholder="fan@arenaticket.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-mini">Password</label>
          <input className="input-shell mt-1" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="label-mini">Confirm Password</label>
          <input className="input-shell mt-1" type="password" placeholder="••••••••" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {apiError && <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}

        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">
          {isSubmitting ? "Creating Profile..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-600 dark:text-slate-300">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-arena-indigo">
          Sign In
        </Link>
      </p>
    </div>
  );
}
