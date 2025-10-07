"use client";

import { useCallback } from "react";

import { useRootStore } from "@/stores/StoreProvider";
import { useTranslations } from "@/localization/TranslationProvider";

const ensureAbsoluteUrl = (href: string) => {
  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  if (typeof window === "undefined") {
    return href;
  }

  return `${window.location.origin}${href.startsWith("/") ? href : `/${href}`}`;
};

const copyTextToClipboard = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";

  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  try {
    return document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};

export function useCopyLink() {
  const { uiStore } = useRootStore();
  const { t } = useTranslations();

  return useCallback(
    async (href: string) => {
      if (typeof window === "undefined") {
        return false;
      }

      const absoluteUrl = ensureAbsoluteUrl(href);

      try {
        const didCopy = await copyTextToClipboard(absoluteUrl);

        if (didCopy) {
          uiStore.showSnackbar(
            t("common.copyLink.success", "Link copied to clipboard"),
            "success",
          );
          return true;
        }

        uiStore.showSnackbar(
          t("common.copyLink.error", "Unable to copy link. Please try again."),
          "error",
        );
        return false;
      } catch (error) {
        console.error("Failed to copy link", error);
        uiStore.showSnackbar(
          t("common.copyLink.error", "Unable to copy link. Please try again."),
          "error",
        );
        return false;
      }
    },
    [t, uiStore],
  );
}

