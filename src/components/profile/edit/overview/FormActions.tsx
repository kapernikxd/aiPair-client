"use client";

import { Button } from "@/components/ui/Button";

export default function FormActions({
  onCancel,
  isSubmitting = false,
}: {
  onCancel: () => void;
  isSubmitting?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        onClick={onCancel}
        variant="outlineWide"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="solidWhiteWide"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
