"use client";

export default function FormActions({
  onCancel,
}: {
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="inline-flex items-center justify-center rounded-2xl border border-white/15 px-6 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-200"
      >
        Save
      </button>
    </div>
  );
}
