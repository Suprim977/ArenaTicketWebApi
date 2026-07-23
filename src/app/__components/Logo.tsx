"use client";

import { Ticket } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function Logo() {
  const { isAuthenticated } = useAuth();
  return (
    <Link href={isAuthenticated ? "/dashboard" : "/"} className="inline-flex items-center gap-3" aria-label="ArenaTicket home">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 to-indigo-500 text-white shadow-sm">
        <Ticket className="h-5 w-5" />
      </div>
      <div>
        <p className="text-lg font-extrabold text-gray-900 dark:text-white">ArenaTicket</p>
        <p className="text-xs tracking-[0.14em] text-gray-500 dark:text-slate-400">ESPORTS TICKETING</p>
      </div>
    </Link>
  );
}
