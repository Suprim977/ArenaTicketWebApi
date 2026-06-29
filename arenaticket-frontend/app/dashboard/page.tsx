"use client";

import { useEffect, useState } from "react";
import { whoAmIAction } from "@/lib/actions/auth-action";

export default function DashboardPage() {
  const [name, setName] = useState("Player");

  useEffect(() => {
    const loadProfile = async () => {
      const result = await whoAmIAction();
      if (result.ok && result.data?.person) {
        setName(`${result.data.person.firstName || ""} ${result.data.person.lastName || ""}`.trim() || "Player");
      }
    };

    void loadProfile();
  }, []);

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <p className="label-mini">Welcome Back</p>
      <h2 className="mt-2 text-3xl font-black text-gray-900">{name}, your arena control is live.</h2>
      <p className="mt-3 text-gray-600">Update your profile and credentials from the top navigation.</p>
    </section>
  );
}
