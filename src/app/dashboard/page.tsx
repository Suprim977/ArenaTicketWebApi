"use client";

import { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { whoAmIAction } from "@/lib/actions/auth-action";
import { mockMetrics } from "@/lib/mock/arena-data";

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
    <section className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="label-mini">Welcome Back</p>
        <h2 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">{name}, your ArenaTicket dashboard is live.</h2>
        <p className="mt-3 text-gray-600 dark:text-slate-300">Update your profile, check tickets, and review account activity from the top navigation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {mockMetrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} helper={metric.helper} />
        ))}
      </div>
    </section>
  );
}
