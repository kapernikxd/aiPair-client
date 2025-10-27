"use client";

import { useEffect, useMemo } from "react";
import { X } from "lucide-react";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { SnackbarType } from "@/types/ui";

const VARIANT_STYLES: Record<SnackbarType, string> = {
  success: "bg-emerald-500 text-white",
  error: "bg-rose-500 text-white",
  warning: "bg-amber-400 text-neutral-900",
  info: "bg-sky-500 text-white",
};

const AUTO_HIDE_TIMEOUT = 4000;

export default function Snackbar() {
  const { uiStore } = useRootStore();
  const snackbar = useStoreData(uiStore, (store) => store.snackBar);

  useEffect(() => {
    if (!snackbar.visible) return;

    const timer = window.setTimeout(() => {
      uiStore.hideSnackbar();
    }, AUTO_HIDE_TIMEOUT);

    return () => {
      window.clearTimeout(timer);
    };
  }, [snackbar.visible, uiStore]);

  const className = useMemo(() => {
    const variant = VARIANT_STYLES[snackbar.type] ?? VARIANT_STYLES.success;
    return `pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm shadow-lg transition ${variant}`;
  }, [snackbar.type]);

  if (!snackbar.visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[1000] flex justify-center px-4 sm:bottom-8">
      <div role="status" aria-live="polite" className={className}>
        <span className="flex-1 leading-snug">{snackbar.message}</span>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => uiStore.hideSnackbar()}
          className="rounded-full p-1 transition hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
