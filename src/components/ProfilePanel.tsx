"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRound } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import DashboardSkeleton from "@/components/DashboardSkeleton";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { getProfileImageUrl } from "@/lib/profile-image";
import { useAuth } from "@/lib/contexts/AuthContext";
import { profileService } from "@/services/profile.service";
import type { User } from "@/types/user";

const profileSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),
  countryCode: z.enum(["+977", "+91", "+1", "+44"]),
  phoneNumber: z.string().trim().regex(/^\d+$/, "Phone number must contain digits only"),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
}).superRefine((data, context) => {
  if (data.countryCode === "+977" && data.phoneNumber.length !== 10) {
    context.addIssue({ code: "custom", path: ["phoneNumber"], message: "Nepal phone numbers must be exactly 10 digits" });
  }
});
type ProfileForm = z.infer<typeof profileSchema>;
const MAX_PHOTO_SIZE = 3 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function ProfilePanel() {
  const queryClient = useQueryClient();
  const { setUser } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const profile = useQuery({ queryKey: ["current-user"], queryFn: profileService.getProfile });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  const syncUser = (user: User) => {
    queryClient.setQueryData(["current-user"], user);
    setUser(user);
  };

  useEffect(() => {
    if (profile.data) reset({
      firstName: profile.data.firstName ?? "",
      lastName: profile.data.lastName ?? "",
      countryCode: profile.data.countryCode ?? "+977",
      phoneNumber: profile.data.phoneNumber ?? "",
      gender: profile.data.gender ?? "prefer_not_to_say",
    });
  }, [profile.data, reset]);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const update = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (user) => {
      syncUser(user);
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        countryCode: user.countryCode ?? "+977",
        phoneNumber: user.phoneNumber ?? "",
        gender: user.gender ?? "prefer_not_to_say",
      });
      toast.success("Profile updated successfully.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Your profile could not be updated.")),
  });
  const upload = useMutation({
    mutationFn: (photo: File) => profileService.uploadProfilePhoto(photo, setUploadProgress),
    onSuccess: (user) => {
      syncUser({ ...profile.data, ...user, updatedAt: user.updatedAt ?? String(Date.now()) });
      setPhotoError("");
      setFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Profile photo uploaded successfully.");
    },
    onError: (error) => {
      const message = getApiErrorMessage(error, "Profile photo could not be uploaded.");
      setUploadProgress(0);
      setPhotoError(message);
      toast.error(message);
    },
  });
  const remove = useMutation({
    mutationFn: profileService.deleteProfilePhoto,
    onSuccess: (user) => {
      syncUser({ ...profile.data, ...user, profilePicture: null } as User);
      setFile(null);
      setPreviewUrl(null);
      if (inputRef.current) inputRef.current.value = "";
      toast.success("Profile photo removed.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Profile photo could not be removed.")),
  });

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0] ?? null;
    setPhotoError("");
    if (!selected) return;
    if (!ALLOWED_PHOTO_TYPES.includes(selected.type)) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setPhotoError("Only JPG, JPEG, PNG, and WEBP image files are allowed.");
      event.target.value = "";
      return;
    }
    if (selected.size > MAX_PHOTO_SIZE) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(null);
      setPreviewUrl(null);
      setPhotoError("Profile picture must be 3 MB or smaller.");
      event.target.value = "";
      return;
    }
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  if (profile.isLoading) return <DashboardSkeleton cards={1} />;
  if (profile.isError || !profile.data) {
    return <div role="alert" className="mx-auto max-w-3xl rounded-2xl bg-rose-50 p-6 text-rose-700">{getApiErrorMessage(profile.error, "Your profile could not be loaded.")}</div>;
  }

  const user = profile.data;
  const currentImage = getProfileImageUrl(user.profilePicture, user.updatedAt);
  const displayImage = previewUrl ?? currentImage;
  const busy = upload.isPending || remove.isPending;
  const details = [
    ["Email", user.email],
    ["Role", user.role],
    ["Account created", user.createdAt ? new Intl.DateTimeFormat(undefined, { dateStyle: "long" }).format(new Date(user.createdAt)) : "Not available"],
    ...(user.countryCode ? [["Country code", user.countryCode]] : []),
    ...(user.phoneNumber ? [["Phone number", user.phoneNumber]] : []),
    ...(user.gender ? [["Gender", user.gender.replaceAll("_", " ")]] : []),
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center gap-3"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Profile</p><h1 className="text-3xl font-black">Personal details</h1></div>
      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 md:grid-cols-[15rem_1fr]">
        <div>
          <div className="mx-auto flex size-40 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            {displayImage ? <Image unoptimized={Boolean(previewUrl)} src={displayImage} alt="Profile preview" width={160} height={160} className="size-40 object-cover" /> : <UserRound size={72} />}
          </div>
          <input ref={inputRef} className="sr-only" id="profilePicture" type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" disabled={busy} onChange={choosePhoto} />
          <div className="mt-4 grid gap-2">
            <label htmlFor="profilePicture" aria-disabled={busy} className={`rounded-xl border border-slate-300 px-4 py-2 text-center text-sm font-semibold dark:border-slate-700 ${busy ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}>Choose Photo</label>
            <button type="button" aria-disabled={!file || busy} onClick={() => {
              if (!file) {
                setPhotoError("Please choose a profile picture first.");
                return;
              }
              if (!busy) upload.mutate(file);
            }} className={`primary-btn ${!file || busy ? "cursor-not-allowed opacity-50" : ""}`}>{upload.isPending ? `Uploading${uploadProgress ? ` ${uploadProgress}%` : "..."}` : "Upload Photo"}</button>
            <button type="button" disabled={!user.profilePicture || busy} onClick={() => remove.mutate()} className="rounded-xl px-4 py-2 text-sm font-semibold text-rose-600 disabled:opacity-50">Remove Photo</button>
          </div>
          {photoError && <p role="alert" className="mt-2 text-sm text-rose-600">{photoError}</p>}
        </div>
        <div>
          <form className="space-y-4" onSubmit={handleSubmit((values) => update.mutate(values))}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold">First name<input className="input-shell mt-2" {...register("firstName")} />{errors.firstName && <span className="mt-1 block text-xs text-rose-600">{errors.firstName.message}</span>}</label>
              <label className="text-sm font-semibold">Last name<input className="input-shell mt-2" {...register("lastName")} />{errors.lastName && <span className="mt-1 block text-xs text-rose-600">{errors.lastName.message}</span>}</label>
              <label className="text-sm font-semibold">Country code<select className="input-shell mt-2" {...register("countryCode")}><option value="+977">Nepal (+977)</option><option value="+91">India (+91)</option><option value="+1">USA (+1)</option><option value="+44">UK (+44)</option></select></label>
              <label className="text-sm font-semibold">Phone number<input className="input-shell mt-2" inputMode="numeric" {...register("phoneNumber")} />{errors.phoneNumber && <span className="mt-1 block text-xs text-rose-600">{errors.phoneNumber.message}</span>}</label>
              <label className="text-sm font-semibold">Gender<select className="input-shell mt-2" {...register("gender")}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer_not_to_say">Prefer not to say</option></select></label>
              <label className="text-sm font-semibold">Email<input className="input-shell mt-2 cursor-not-allowed bg-slate-100 dark:bg-slate-800" value={user.email} readOnly aria-readonly /></label>
            </div>
            <button className="primary-btn" disabled={update.isPending}>{update.isPending ? "Saving..." : "Save changes"}</button>
          </form>
          <dl className="mt-7 grid gap-4 border-t border-slate-200 pt-6 dark:border-slate-800 sm:grid-cols-2">
            {details.map(([label, value]) => <div key={label}><dt className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</dt><dd className="mt-1 capitalize text-slate-900 dark:text-white">{value}</dd></div>)}
          </dl>
        </div>
      </div>
    </section>
  );
}
