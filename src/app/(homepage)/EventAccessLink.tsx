"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";

type EventAccessLinkProps = {
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
};

export default function EventAccessLink({ children, className, showArrow = false }: EventAccessLinkProps) {
  const router = useRouter();
  const { user, token } = useAuth();

  const openEvents = () => {
    router.push(user || token ? "/search" : "/login?callbackUrl=/search");
  };

  return <button type="button" onClick={openEvents} className={className}>{children}{showArrow ? " →" : null}</button>;
}
