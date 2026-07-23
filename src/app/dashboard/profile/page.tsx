"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateProfileAction, whoAmIAction } from "@/lib/actions/auth-action";
import { useAuth } from "@/lib/contexts/AuthContext";

type ProfileForm = {
  firstName: string;
  lastName: string;
  arenaTag: string;
};

export default function ProfilePage() {
  const { setUser } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileForm>();

  useEffect(() => {
    const loadProfile = async () => {
      const result = await whoAmIAction();
      if (result.ok && result.data) {
        reset({
          firstName: result.data.person?.firstName || "",
          lastName: result.data.person?.lastName || "",
          arenaTag: result.data.person?.arenaTag || "",
        });
        if (result.data.person?.avatar) {
          setAvatarPreview(`http://localhost:8089${result.data.person.avatar}`);
        }
      }
    };

    void loadProfile();
  }, [reset]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (values: ProfileForm) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("arenaTag", values.arenaTag);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const result = await updateProfileAction(formData);

    if (!result.ok) {
      toast.error(result.message);
      return;
    }

    const updatedUser = result.data ?? null;
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    toast.success("Profile updated successfully");
  };

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="label-mini">Avatar</label>
          <div className="mt-2 flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">No image</div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label-mini">First Name</label>
            <input className="input-shell mt-1" {...register("firstName")} />
          </div>
          <div>
            <label className="label-mini">Last Name</label>
            <input className="input-shell mt-1" {...register("lastName")} />
          </div>
        </div>

        <div>
          <label className="label-mini">Arena Tag</label>
          <input className="input-shell mt-1" {...register("arenaTag")} />
        </div>

        <button className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Update Profile"}
        </button>
      </form>
    </section>
  );
}
