"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserForm from "@/app/admin/__components/UserForm";
import { getUserByIdAction, type AdminUser, updateUserAction } from "@/lib/actions/admin/user-action";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await getUserByIdAction(params.id);

      if (!result.ok || !result.data) {
        setError(result.message);
        setLoading(false);
        return;
      }

      setUser(result.data);
      setLoading(false);
    };

    void fetchUser();
  }, [params.id]);

  if (loading) return <p className="rounded-xl bg-white p-4 text-sm text-gray-600">Loading user...</p>;
  if (error || !user) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error || "User not found."}</p>;

  return (
    <section className="space-y-5">
      <header className="mx-auto max-w-3xl"><p className="label-mini">Users</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Edit User</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Update this ArenaTicket account.</p></header>
      <UserForm
        mode="edit"
        defaultValues={{
          firstName: user.firstName ?? user.person?.firstName,
          lastName: user.lastName ?? user.person?.lastName,
          countryCode: user.countryCode as "+977" | "+91" | "+1" | "+44" | undefined,
          phoneNumber: user.phoneNumber,
          gender: user.gender as "male" | "female" | "other" | undefined,
          email: user.email,
          role: user.role,
        }}
        onSubmitAction={async (values) => {
          return updateUserAction(params.id, values);
        }}
      />
    </section>
  );
}
