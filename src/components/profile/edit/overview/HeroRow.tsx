"use client";

import Image from "next/image";
import { ChangeEvent, useRef } from "react";

type Props = {
  userName?: string;
  avatarUrl?: string | null;
  onAvatarSelect?: (file: File) => void | Promise<void>;
  onAvatarRemove?: () => void;
  canRemoveAvatar?: boolean;
  description?: string;
};

export default function HeroRow({
  userName,
  avatarUrl,
  onAvatarSelect,
  onAvatarRemove,
  canRemoveAvatar,
  description = "Update your personal details to help others know you better.",
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onAvatarSelect) {
      void onAvatarSelect(file);
    }

    // allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative">
          <div className="relative left-[26px] flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-400 to-red-500 text-2xl font-semibold">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Profile avatar preview"
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              (userName || "?").charAt(0)
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />

          <div className="mt-2 grid gap-2 sm:grid-cols-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/80 transition hover:bg-white/10"
            >
              Change photo
            </button>

            {onAvatarRemove && canRemoveAvatar && (
              <button
                type="button"
                onClick={onAvatarRemove}
                className="w-full rounded-2xl border border-transparent bg-white/0 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/60 transition hover:text-white"
              >
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-300 sm:mt-2 sm:text-left">
        {description}
      </p>
    </div>
  );
}
