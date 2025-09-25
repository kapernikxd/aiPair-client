"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function ActionBar({
  canBack,
  canNext,
  onBack,
  onReset,
  onNext,
  isFinal,
  isLoading = false,
}: {
  canBack: boolean;
  canNext: boolean;
  onBack: () => void;
  onReset: () => void;
  onNext: () => void;
  isFinal: boolean;
  isLoading?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          disabled={!canBack}
          variant="outline"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onReset}
          variant="outlineMuted"
        >
          Start over
        </Button>
      </div>
      <div className="self-end">
        <Button
          type="button"
          onClick={onNext}
          disabled={!canNext || isLoading}
          variant="primaryTight"
        >
          {isFinal ? (isLoading ? "Creating…" : "Create aiAgent") : "Continue"}
          {!isLoading && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
