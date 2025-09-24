"use client";

export default function HeroRow({ userName }: { userName?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 text-2xl font-semibold">
        {(userName || "?").charAt(0)}
      </div>
      <p className="text-center text-sm text-neutral-300 sm:text-left">
        Update your personal details to help others know you better.
      </p>
    </div>
  );
}
