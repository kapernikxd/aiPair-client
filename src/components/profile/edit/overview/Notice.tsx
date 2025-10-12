"use client";

import { useTranslations } from "@/localization/TranslationProvider";

export default function Notice() {
  const { t } = useTranslations();

  return (
    <p className="rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-xs text-neutral-400">
      {t(
        "admin.profile.edit.notice",
        "Please note that name and introduction can only be changed 1 time within 7 days.",
      )}
    </p>
  );
}
