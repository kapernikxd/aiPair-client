"use client";

import { useEffect, useMemo, useState } from "react";
import ModalShell from "@/components/profile/edit/overview/ModalShell";

const userReportReasons = [
  "Spam or scam",
  "Harassment or bullying",
  "Inappropriate content",
  "Fake profile",
  "Other",
];

const aiAgentReportReasons = [
  "Spam or misleading",
  "Hate speech or discrimination",
  "Violence or threats",
  "Sexually explicit content",
  "Harassment or bullying",
  "Other",
];

type ReportType = "user" | "aiAgent";

interface ReportModalProps {
  open: boolean;
  type: ReportType;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => Promise<void> | void;
  isSubmitting?: boolean;
  error?: string | null;
}

export default function ReportModal({
  open,
  type,
  onClose,
  onSubmit,
  isSubmitting = false,
  error = null,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) {
      setSelectedReason(null);
      setDetails("");
    }
  }, [open]);

  const title = type === "user" ? "Report user" : "Report AI agent";
  const description =
    type === "user"
      ? "Let us know why you believe this profile violates our guidelines."
      : "Tell us what feels off about this AI agent so our team can review it.";

  const reasons = useMemo(() => {
    return type === "user" ? userReportReasons : aiAgentReportReasons;
  }, [type]);

  const handleSubmit = async () => {
    if (!selectedReason || isSubmitting) return;
    await onSubmit(selectedReason, details.trim());
  };

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <div className="space-y-6 p-6">
        <header className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-white/70">{description}</p>
          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}
        </header>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Select a reason
          </p>
          <div className="grid gap-2">
            {reasons.map((reason) => {
              const isActive = selectedReason === reason;
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    isActive
                      ? "border-white/80 bg-white text-neutral-900 shadow"
                      : "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {reason}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-white/60">
            Additional details
          </label>
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            rows={4}
            placeholder="Provide any extra context (optional)"
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2 text-sm font-medium text-white/70 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedReason || isSubmitting}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/60"
          >
            {isSubmitting ? "Sending…" : "Send report"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
