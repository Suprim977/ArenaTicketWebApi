"use client";

import Image from "next/image";
import { ImageIcon, Ticket } from "lucide-react";
import { useState } from "react";
import { getMediaUrl } from "@/lib/media-url";

type Props = {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export default function EventImage({
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className = "object-cover",
}: Props) {
  const imageUrl = getMediaUrl(src);
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (!imageUrl || failedUrl === imageUrl) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-linear-to-br from-indigo-950 via-indigo-800 to-violet-700 text-white">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-white/15 shadow-lg ring-1 ring-white/20">
          {failedUrl ? <ImageIcon size={24} aria-hidden /> : <Ticket size={24} aria-hidden />}
        </span>
        <span className="mt-3 text-sm font-black tracking-wide">ArenaTicket</span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-indigo-200">
          Event banner
        </span>
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={() => setFailedUrl(imageUrl)}
    />
  );
}
