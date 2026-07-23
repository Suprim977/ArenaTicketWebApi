"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().optional(),
  role: z.enum(["admin", "user"]),
});

type UserFormSchema = z.infer<typeof userSchema>;

type UserFormProps = {
  defaultValues?: Partial<UserFormSchema>;
  submitLabel?: string;
  onSubmitAction: (payload: any) => Promise<{ ok: boolean; message: string }>;
};

export default function UserForm({ defaultValues, submitLabel = "Save User", onSubmitAction }: UserFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
      ...defaultValues,
    },
  });

  const onSubmit = async (values: UserFormSchema) => {
    setApiError("");
    const response = await onSubmitAction(values);

    if (!response.ok) {
      setApiError(response.message);
      return;
    }

    router.push("/admin/users");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="label-mini">First Name</label>
          <input className="input-shell mt-1" {...register("firstName")} />
          {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="label-mini">Last Name</label>
          <input className="input-shell mt-1" {...register("lastName")} />
          {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="label-mini">Email</label>
        <input className="input-shell mt-1" type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label-mini">Password</label>
        <input className="input-shell mt-1" type="password" placeholder="Optional on edit" {...register("password")} />
      </div>

      <div>
        <label className="label-mini">Role</label>
        <select className="input-shell mt-1" {...register("role")}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {apiError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{apiError}</p>}

      <button disabled={isSubmitting} className="primary-btn w-full" type="submit">
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
