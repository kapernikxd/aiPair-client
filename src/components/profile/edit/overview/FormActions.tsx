"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/localization/TranslationProvider";

export default function FormActions({
  onCancel,
  isSubmitting = false,
}: {
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  const { t } = useTranslations();
  const cancelLabel = t("common.cancel", "Отмена");
  const saveLabel = t("common.save", "Сохранить");
  const savingLabel = t("common.saving", "Сохраняем…");

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        onClick={onCancel}
        variant="outlineWide"
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="solidWhiteWide"
        disabled={isSubmitting}
      >
        {isSubmitting ? savingLabel : saveLabel}
      </Button>
    </div>
  );
}
