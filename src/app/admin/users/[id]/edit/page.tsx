"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserForm from "@/app/admin/_components/UserForm";
import { getUserByIdAction, updateUserAction } from "@/lib/actions/admin/user-action";

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const result = await getUserByIdAction(params.id);

      if (!result.ok) {
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
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Edit User</h2>
      <UserForm
        submitLabel="Update User"
        defaultValues={{
          firstName: user.person?.firstName,
          lastName: user.person?.lastName,
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
