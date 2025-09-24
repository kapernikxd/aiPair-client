"use client";

import { Button } from "@/components/ui/Button";

export default function FormActions({
  onCancel,
}: {
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button
        type="button"
        onClick={onCancel}
        variant="outlineWide"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="solidWhiteWide"
      >
        Save
      </Button>
    </div>
  );
}
