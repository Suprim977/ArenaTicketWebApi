"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { registerAction } from "@/lib/actions/auth-action";
import { RegisterSchemaType, registerSchema } from "./schema";

const ErrorText = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

export default function RegisterForm() {
  const router = useRouter();
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<RegisterSchemaType>({
      resolver: zodResolver(registerSchema),
      defaultValues: { countryCode: "+977", gender: "prefer_not_to_say" },
    });

  const onSubmit = async (values: RegisterSchemaType) => {
    setApiError("");
    try {
      const result = await registerAction({
        ...values,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: values.phoneNumber.replace(/\s/g, ""),
        email: values.email.trim().toLowerCase(),
      });
      if (!result.ok) {
        setApiError(result.message || "Registration failed. Please try again.");
        return;
      }
      reset();
      toast.success("Registration successful! Please log in to continue.");
      router.replace(`/login?email=${encodeURIComponent(values.email.trim().toLowerCase())}`);
    } catch {
      setApiError("Unable to create your account right now. Please try again.");
    }
  };

  return (
    <div className="space-y-6 lg:min-w-[34rem]">
      <div className="space-y-2">
        <p className="label-mini">Create Account</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Join ArenaTicket</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Create your account to book and manage event tickets.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label-mini" htmlFor="firstName">First name</label><input id="firstName" autoComplete="given-name" className="input-shell mt-1" placeholder="Suprim" {...register("firstName")} /><ErrorText message={errors.firstName?.message} /></div>
          <div><label className="label-mini" htmlFor="lastName">Last name</label><input id="lastName" autoComplete="family-name" className="input-shell mt-1" placeholder="Panta" {...register("lastName")} /><ErrorText message={errors.lastName?.message} /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-[11rem_1fr]">
          <div><label className="label-mini" htmlFor="countryCode">Country code</label><select id="countryCode" className="input-shell mt-1" {...register("countryCode")}><option value="+977">Nepal (+977)</option><option value="+91">India (+91)</option><option value="+1">United States (+1)</option><option value="+44">United Kingdom (+44)</option></select></div>
          <div><label className="label-mini" htmlFor="phoneNumber">Phone number</label><input id="phoneNumber" inputMode="numeric" autoComplete="tel-national" className="input-shell mt-1" placeholder="98XXXXXXXX" {...register("phoneNumber")} /><ErrorText message={errors.phoneNumber?.message} /></div>
        </div>
        <div><label className="label-mini" htmlFor="gender">Gender</label><select id="gender" className="input-shell mt-1" {...register("gender")}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select></div>
        <div><label className="label-mini" htmlFor="email">Email</label><input id="email" autoComplete="email" className="input-shell mt-1" type="email" placeholder="example@email.com" {...register("email")} /><ErrorText message={errors.email?.message} /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label-mini" htmlFor="password">Password</label><div className="relative"><input id="password" autoComplete="new-password" className="input-shell mt-1 pr-11" type={showPassword ? "text" : "password"} placeholder="Password@123" {...register("password")} /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><ErrorText message={errors.password?.message} /></div>
          <div><label className="label-mini" htmlFor="confirmPassword">Confirm password</label><div className="relative"><input id="confirmPassword" autoComplete="new-password" className="input-shell mt-1 pr-11" type={showConfirmPassword ? "text" : "password"} placeholder="Password@123" {...register("confirmPassword")} /><button type="button" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><ErrorText message={errors.confirmPassword?.message} /></div>
        </div>
        <p className="text-xs leading-5 text-slate-500">Use 8+ characters with uppercase, lowercase, number, and special character.</p>
        {apiError && <p role="alert" aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-300">{apiError}</p>}
        <button type="submit" disabled={isSubmitting} className="primary-btn w-full">{isSubmitting ? "Creating account..." : "Create account"}</button>
      </form>
      <p className="text-sm text-gray-600 dark:text-slate-300">Already have an account? <Link href="/login" className="font-semibold text-arena-indigo">Log in</Link></p>
    </div>
  );
}
