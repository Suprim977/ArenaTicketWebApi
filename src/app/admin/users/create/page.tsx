"use client";

import UserForm from "@/app/admin/_components/UserForm";
import { createUserAction } from "@/lib/actions/admin/user-action";

export default function CreateUserPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Create User</h2>
      <UserForm
        submitLabel="Create User"
        onSubmitAction={async (values) => {
          return createUserAction(values);
        }}
      />
    </section>
  );
}
