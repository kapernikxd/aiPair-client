"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

export default function ActionBar({
  canBack,
  canNext,
  onBack,
  onReset,
  onNext,
  isFinal,
}: {
  canBack: boolean;
  canNext: boolean;
  onBack: () => void;
  onReset: () => void;
  onNext: () => void;
  isFinal: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10"
        >
          Start over
        </button>
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="inline-flex items-center gap-2 self-end rounded-2xl bg-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isFinal ? "Create aiAgent" : "Continue"}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
