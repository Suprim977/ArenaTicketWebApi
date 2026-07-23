"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { setAuthCookies } from "@/lib/cookies";
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

    const [firstName, ...restName] = values.fullName.trim().split(" ");
    const result = await registerAction({
      firstName,
      lastName: restName.join(" ") || "Player",
      email: values.email,
      password: values.password,
      arenaTag: values.fullName.replace(/\s+/g, "_"),
    });

    if (!result.ok || !result.data?.token) {
      setApiError(result.message);
      return;
    }

    localStorage.setItem("token", result.data.token);
    localStorage.setItem("user", JSON.stringify(result.data.user));
    setAuthCookies(result.data.token, result.data.user?.role);
    login(result.data.token, result.data.user);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">Create Account</p>
        <h2 className="text-2xl font-bold text-gray-900">Join ArenaTicket</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini">Full Name</label>
          <input className="input-shell mt-1" placeholder="Jordan Fan" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
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

        {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}

        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">
          {isSubmitting ? "Creating Profile..." : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-arena-indigo">
          Sign In
        </Link>
      </p>
    </div>
  );
}
