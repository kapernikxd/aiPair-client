"use client";

import { Button } from "@/components/ui/Button";

export default function DialogHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 pb-4 pt-6 sm:px-8">
      <h2 className="text-xl font-semibold sm:text-2xl">Edit Profile</h2>
      <Button
        type="button"
        onClick={onClose}
        variant="frostedIconCompact"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </Button>
    </div>
  );
}
