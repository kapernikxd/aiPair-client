'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

export type HoverSwapCardProps = {
  src?: string;             // делаем опциональным — будет заглушка, если пусто
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
    <div className="group relative isolate w-full aspect-[11/14] overflow-hidden rounded-3xl bg-zinc-900 shadow-xl ring-1 ring-black/10 transition-all hover:ring-black/20 hover:z-10">
      {/* Изображение или заглушка */}
      {src ? (
        <img
          src={src}
          alt={title}
          className="absolute inset-0 size-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-zinc-800" />
      )}

      {/* Hover затемнение */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />

      {/* Внутренняя рамка */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

      {/* Градиент снизу */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Заголовок + просмотры */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <h3 className="text-ellipsis break-words text-2xl font-bold text-white drop-shadow-sm">
          {title}
        </h3>

        {typeof views !== 'undefined' && (
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-300">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
              <path
                d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span>{views}</span>
          </div>
        )}
      </div>

      {/* Hover-панель */}
      <div className="absolute inset-x-0 bottom-0 translate-y-6 opacity-0 [transition:transform_250ms_ease,opacity_250ms_ease] group-hover:translate-y-0 group-hover:opacity-100">
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
            {hoverText && (
              <p className="line-clamp-4 text-sm leading-snug text-zinc-200">{hoverText}</p>
            )}
          </div>

          <div className="w-full">
            <div className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 py-3 text-sm font-semibold text-zinc-900 shadow [transition:background-color_200ms_ease] hover:bg-white">
              <MessageSquare className="size-4" aria-hidden />
              Chat Now
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block">{CardInner}</Link> : <div className="block">{CardInner}</div>;
}
