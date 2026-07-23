"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordAction } from "@/lib/actions/auth-action";
import { ResetPasswordSchemaType, resetPasswordSchema } from "./schema";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordSchemaType) => {
    setApiError("");

    const result = await resetPasswordAction({
      token,
      password: values.password,
      confirmPassword: values.confirmPassword,
    });

    if (!result.ok) {
      setApiError(result.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">New Password</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a new ArenaTicket password</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini">New Password</label>
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
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      <p className="text-sm text-gray-600 dark:text-slate-300">
        Return to sign in{" "}
        <Link href="/login" className="font-semibold text-arena-indigo">
          Login
        </Link>
      </p>
    </div>
  );
}
