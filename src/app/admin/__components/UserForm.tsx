"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const userSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  countryCode: z.enum(["+977", "+91", "+1", "+44"], { message: "Country code is required" }),
  phoneNumber: z.string().trim().regex(/^\d{6,15}$/, "Phone number must contain 6 to 15 digits"),
  gender: z.enum(["male", "female", "other"], { message: "Gender is required" }),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().optional(),
  role: z.enum(["admin", "user"], { message: "Role is required" }),
}).superRefine((data, context) => {
  if (data.countryCode === "+977" && !/^\d{10}$/.test(data.phoneNumber)) {
    context.addIssue({ code: "custom", path: ["phoneNumber"], message: "Nepal phone number must be exactly 10 digits" });
  }
  if (data.password) {
    if (data.password.length < 8) context.addIssue({ code: "custom", path: ["password"], message: "Password must be at least 8 characters" });
    else if (!/[A-Z]/.test(data.password)) context.addIssue({ code: "custom", path: ["password"], message: "Password must contain an uppercase letter" });
    else if (!/[a-z]/.test(data.password)) context.addIssue({ code: "custom", path: ["password"], message: "Password must contain a lowercase letter" });
    else if (!/\d/.test(data.password)) context.addIssue({ code: "custom", path: ["password"], message: "Password must contain a number" });
    else if (!/[^A-Za-z0-9]/.test(data.password)) context.addIssue({ code: "custom", path: ["password"], message: "Password must contain a special character" });
  }
});

type UserFormSchema = z.infer<typeof userSchema>;
export type UserFormPayload = UserFormSchema;

type UserFormProps = {
  defaultValues?: Partial<UserFormSchema>;
  mode: "create" | "edit";
  onSubmitAction: (payload: UserFormPayload) => Promise<{ ok: boolean; message: string }>;
};

const fieldClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:disabled:bg-slate-800";
const labelClass = "text-sm font-semibold text-slate-700 dark:text-slate-200";

export default function UserForm({ defaultValues, mode, onSubmitAction }: UserFormProps) {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: { countryCode: "+977", role: "user", ...defaultValues },
  });

  const submit = async (values: UserFormSchema) => {
    setApiError("");
    if (mode === "create" && !values.password) {
      setError("password", { message: "Password is required" });
      return;
    }
    const response = await onSubmitAction(values);
    if (!response.ok) {
      setApiError(response.message);
      return;
    }
    toast.success(mode === "create" ? "User created successfully." : "User updated successfully.");
    router.push("/admin/users");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="mx-auto max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name *" error={errors.firstName?.message}><input className={fieldClass} autoComplete="given-name" placeholder="First name" {...register("firstName")} /></Field>
        <Field label="Last Name *" error={errors.lastName?.message}><input className={fieldClass} autoComplete="family-name" placeholder="Last name" {...register("lastName")} /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Country Code *" error={errors.countryCode?.message}><select className={fieldClass} {...register("countryCode")}><option value="+977">Nepal (+977)</option><option value="+91">India (+91)</option><option value="+1">USA (+1)</option><option value="+44">UK (+44)</option></select></Field>
        <Field label="Phone Number *" error={errors.phoneNumber?.message}><input className={fieldClass} inputMode="numeric" autoComplete="tel-national" placeholder="9812345678" {...register("phoneNumber")} /></Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Gender *" error={errors.gender?.message}><select className={fieldClass} {...register("gender")}><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></Field>
        <Field label="Role *" error={errors.role?.message}><select className={fieldClass} {...register("role")}><option value="user">User</option><option value="admin">Admin</option></select></Field>
      </div>
      <Field label="Email *" error={errors.email?.message}><input className={fieldClass} type="email" autoComplete="email" placeholder="name@example.com" disabled={mode === "edit"} {...register("email")} />{mode === "edit" && <p className="mt-2 text-xs text-slate-500">Email cannot be changed from the admin API.</p>}</Field>
      <Field label={`Password${mode === "create" ? " *" : ""}`} error={errors.password?.message}><input className={fieldClass} type="password" autoComplete="new-password" placeholder={mode === "create" ? "Minimum 8 characters" : "Leave blank to keep current password"} {...register("password")} /></Field>
      {apiError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">{apiError}</p>}
      <button disabled={isSubmitting} className="primary-btn w-full" type="submit">{isSubmitting ? (mode === "create" ? "Creating User..." : "Updating User...") : (mode === "create" ? "Create User" : "Update User")}</button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return <label className={labelClass}>{label}{children}{error && <p className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}</label>;
}
