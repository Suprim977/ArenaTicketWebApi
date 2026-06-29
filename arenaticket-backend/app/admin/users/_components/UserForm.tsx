"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createUserSchema } from "./schema";
import { handleCreateUser } from "@/lib/actions/admin/user-action";

const fieldClass =
    "h-12 w-full border border-hairline bg-surface-card px-4 text-on-dark placeholder:text-muted outline-none transition-colors focus:border-on-dark";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[1.5px] text-body";
const errClass = "mt-1 block text-sm text-m-red";

export default function UserForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(createUserSchema),
    });

    const onSubmit = (data: any) => {
        setError("");
        startTransition(async () => {
            console.log("Submitting data:", data); // Log the form data for debugging
            try {
                let result = await handleCreateUser({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    username: data.username,
                    role: data.role,
                    password: data.password,
                });
                if (!result.success) throw new Error(result.message);
                toast.success("User created successfully");
                router.push("/admin/users");
                router.refresh();
            } catch (err: any) {
                toast.error(err?.message);
                setError(err?.message || "Something went wrong");
            }
        });
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="mb-6 border border-m-red bg-m-red/10 px-4 py-3 text-sm text-m-red">{error}</div>
                )}


                <div className="mb-5">
                    <label className={labelClass}>Email</label>
                    <input type="email" {...register("email")} placeholder="you@example.com" className={fieldClass} />
                    {errors.email && <span className={errClass}>{errors.email.message as string}</span>}
                </div>

                <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                        <label className={labelClass}>First Name</label>
                        <input type="text" {...register("firstName")} placeholder="Jane" className={fieldClass} />
                        {errors.firstName && <span className={errClass}>{errors.firstName.message as string}</span>}
                    </div>
                    <div>
                        <label className={labelClass}>Last Name</label>
                        <input type="text" {...register("lastName")} placeholder="Doe" className={fieldClass} />
                        {errors.lastName && <span className={errClass}>{errors.lastName.message as string}</span>}
                    </div>
                </div>

                <div className="mb-5">
                    <label className={labelClass}>Username</label>
                    <input type="text" {...register("username")} placeholder="janedoe" className={fieldClass} />
                    {errors.username && <span className={errClass}>{errors.username.message as string}</span>}
                </div>

                <div className="mb-5">
                    <label className={labelClass}>Role</label>
                    <select {...register("role")} className={fieldClass}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <span className={errClass}>{errors.role.message as string}</span>}
                </div>
                <div className="mb-5">
                    <label className={labelClass}>Password</label>
                    <input type="password" {...register("password")} placeholder="••••••••" className={fieldClass} />
                    {errors.password && <span className={errClass}>{errors.password.message as string}</span>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="flex h-12 w-full items-center justify-center bg-on-dark text-xs font-bold uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending
                        ? "Creating..."
                        : "Create user"}
                </button>
            </form>
        </div>
    );
}
