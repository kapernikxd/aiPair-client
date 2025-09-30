"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/localization/TranslationProvider";

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
  const { t } = useTranslations();
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
          {t("admin.create.action.back", "Back")}
        </Button>
        <Button
          type="button"
          onClick={onReset}
          variant="outlineMuted"
        >
          {t("admin.create.action.reset", "Start over")}
        </Button>
      </div>
      <div className="self-end">
        <Button
          type="button"
          onClick={onNext}
          disabled={!canNext || isLoading}
          variant="primaryTight"
        >
          {isFinal
            ? isLoading
              ? t("admin.create.action.creating", "Creating…")
              : t("admin.create.action.submit", "Create aiAgent")
            : t("admin.create.action.next", "Continue")}
          {!isLoading && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
