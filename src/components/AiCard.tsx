'use client'

import React from "react";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

/**
 * HoverSwapCard
 *
 * A single card that shows one image by default and darkens it on hover, revealing extra content.
 *
 * Uses Tailwind classes only (no external CSS).
 */
export type HoverSwapCardProps = {
  src: string;
  avatarSrc?: string;
  title: string;
  views?: number | string;
  hoverText?: string;
  href?: string;
};

export default function HoverSwapCard({
  src,
  avatarSrc,
  title,
  views,
  hoverText,
  href,
}: HoverSwapCardProps) {
  const CardInner = (
    <div
      className="group relative isolate w-full max-w-[260px] overflow-hidden rounded-3xl bg-zinc-900 shadow-xl ring-1 ring-black/10 transition-all hover:ring-black/20"
      style={{ aspectRatio: "11 / 14" }}
    >
      {/* Image */}
      <img
        src={src}
        alt="card"
        className="absolute inset-0 size-full object-cover"
        draggable={false}
      />

      {/* Dark overlay on hover */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />

      {/* Subtle inner border */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

      {/* Gradient bottom for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Title + stats */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-white text-3xl font-bold drop-shadow-sm">{title}</h3>
        {typeof views !== "undefined" && (
          <div className="mt-1 flex items-center gap-2 text-zinc-300 text-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Z" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span>{views}</span>
          </div>
        )}
      </div>

      {/* Hover panel */}
      <div className="absolute inset-x-0 bottom-0 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 [transition:transform_250ms_ease,opacity_250ms_ease]">
        <div className="px-5 pb-5">
          <div className="mb-3 flex items-center gap-3">
            {avatarSrc && (
              <img
                src={avatarSrc}
                alt="avatar"
                className="size-8 rounded-full object-cover ring-2 ring-white/20"
                draggable={false}
              />
            )}
            <p className="text-zinc-200 text-sm leading-snug line-clamp-4">
              {hoverText}
            </p>
          </div>

          <div className="w-full">
            <div className="flex items-center justify-center gap-2 w-full rounded-full bg-white/95 text-zinc-900 text-sm font-semibold py-3 shadow hover:bg-white [transition:background-color_200ms_ease]">
              <MessageSquare className="size-4" aria-hidden />
              Chat Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">{CardInner}</Link>
  ) : (
    <div className="block">{CardInner}</div>
  );
}

// Example usage:
// <HoverSwapCard
//   src="/img/magnus.jpg"
//   avatarSrc="/img/magnus-avatar.jpg"
//   title="Magnus"
//   views={806}
//   hoverText="(Annoyed Dragon) Oh, wonderful. Another one..."
//   href="/chat/magnus"
// />