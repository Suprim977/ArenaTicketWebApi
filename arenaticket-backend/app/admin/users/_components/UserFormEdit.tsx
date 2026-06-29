"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import {  editUserSchema } from "./schema";
import {  handleUpdateUser } from "@/lib/actions/admin/user-action";

const fieldClass =
    "h-12 w-full border border-hairline bg-surface-card px-4 text-on-dark placeholder:text-muted outline-none transition-colors focus:border-on-dark";
const labelClass = "mb-2 block text-xs font-bold uppercase tracking-[1.5px] text-body";
const errClass = "mt-1 block text-sm text-m-red";

export default function UserFormEdit({ user }: { user?: any }) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState("");
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            username: user?.username || "",
            role: user?.role || "user",
            password: "",
        },
    });

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (file: File | undefined, onChange: (file: File | undefined) => void) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreviewImage(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
        onChange(file);
    };

    const handleDismissImage = (onChange?: (file: File | undefined) => void) => {
        setPreviewImage(null);
        onChange?.(undefined);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const onSubmit = (data: any) => {
        setError("");
        startTransition(async () => {
            try {
                const formdata = new FormData();
                formdata.append("firstName", data.firstName || "");
                formdata.append("lastName", data.lastName || "");
                formdata.append("email", data.email || "");
                formdata.append("username", data.username || "");
                formdata.append("role", data.role || "user");
                if (data.image) formdata.append("profileImage", data.image);
                let result = await handleUpdateUser(user._id, formdata);

                if (!result.success) throw new Error(result.message);
                toast.success("User updated successfully");
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

                <>
                    <div className="mb-4">
                        {previewImage ? (
                            <div className="relative h-24 w-24">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="h-24 w-24 rounded-full object-cover"
                                />
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field: { onChange } }) => (
                                        <button
                                            type="button"
                                            onClick={() => handleDismissImage(onChange)}
                                            className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-m-red text-sm text-white"
                                        >
                                            ✕
                                        </button>
                                    )}
                                />
                            </div>
                        ) : user?.imageUrl ? (
                            <Image
                                src={process.env.NEXT_PUBLIC_API_BASE_URL + user.imageUrl}
                                alt="Profile"
                                width={96}
                                height={96}
                                className="h-24 w-24 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-surface-elevated text-xs text-muted">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="mb-5">
                        <label className={labelClass}>Profile Image</label>
                        <Controller
                            name="image"
                            control={control}
                            render={({ field: { onChange } }) => (
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={(e) => handleImageChange(e.target.files?.[0], onChange)}
                                    accept=".jpg,.jpeg,.png,.webp"
                                    className="text-sm text-muted"
                                />
                            )}
                        />
                        {errors.image && <span className={errClass}>{errors.image.message as string}</span>}
                    </div>
                </>
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
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="••••••••"
                        className={fieldClass}
                    />
                    {errors.password && <span className={errClass}>{errors.password.message as string}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || isPending}
                    className="flex h-12 w-full items-center justify-center bg-on-dark text-xs font-bold uppercase tracking-[1.5px] text-canvas transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isPending
                        ? "Saving..."
                        : "Save changes"
                    }
                </button>
            </form>
        </div>
    );
}
