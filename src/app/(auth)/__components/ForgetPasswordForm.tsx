"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordAction } from "@/lib/actions/auth-action";
import { ForgotPasswordSchemaType, forgotPasswordSchema } from "./schema";

export default function ForgetPasswordForm() {
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordSchemaType) => {
    setApiError("");
    setSuccessMessage("");

    const result = await forgotPasswordAction(values);

    if (!result.ok) {
      setApiError(result.message);
      return;
    }

    setSuccessMessage(result.message);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="label-mini">Account Recovery</p>
        <h2 className="text-2xl font-bold text-gray-900">Reset your ArenaTicket account access</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label-mini">Email</label>
          <input className="input-shell mt-1" type="email" placeholder="fan@arenaticket.com" {...register("email")} />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}
        {successMessage && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>}

        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">
          {isSubmitting ? "Sending link..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-sm text-gray-600">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-arena-indigo">
          Back to login
        </Link>
      </p>
    </div>
  );
}