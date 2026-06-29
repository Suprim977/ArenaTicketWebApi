"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";
import { setTokenCookie } from "@/lib/cookies";
import { LoginSchemaType, loginSchema } from "./schema";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginSchemaType) => {
    setApiError("");
    const result = await loginAction(values);

    if (!result.ok || !result.data?.token) {
      setApiError(result.message);
      return;
    }

    localStorage.setItem("token", result.data.token);
    setTokenCookie(result.data.token);
    login(result.data.token, result.data.user);
    router.push("/dashboard");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">Sign In</p>
        <h2 className="text-2xl font-bold text-gray-900">Continue to ArenaTicket</h2>
      </div>

      <button type="button" className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700">
        Continue with Google
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini">Email</label>
          <input className="input-shell mt-1" type="email" placeholder="captain@arena.gg" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="label-mini">Password</label>
          <input className="input-shell mt-1" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}

        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">
          {isSubmitting ? "Entering Arena..." : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        New here?{" "}
        <Link href="/register" className="font-semibold text-arena-indigo">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
