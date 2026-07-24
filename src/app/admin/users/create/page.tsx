"use client";

import UserForm from "@/app/admin/__components/UserForm";
import { createUserAction } from "@/lib/actions/admin/user-action";

export default function CreateUserPage() {
  return (
    <section className="space-y-5">
      <header className="mx-auto max-w-3xl"><p className="label-mini">Users</p><h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Create User</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Create a new ArenaTicket account.</p></header>
      <UserForm
        mode="create"
        onSubmitAction={async (values) => {
          return createUserAction(values);
        }}
      />
    </section>
  );
}
