"use client";

export default function DialogHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
      <h2 className="text-xl font-semibold sm:text-2xl">Edit Profile</h2>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
