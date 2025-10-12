"use client";

import { useTranslations } from "@/localization/TranslationProvider";

export default function LastNameField({
  value,
  onChange,
  max = 18,
}: {
  value: string;
  onChange: (val: string) => void;
  max?: number;
}) {
  const { t } = useTranslations();
  const counter = value?.length?.toString()?.padStart(2, "0");
  return (
    <label className="block space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400">
        <span>{t('admin.profile.edit.lastNameLabel', 'Last Name')}</span>
        <span>{counter}/{max}</span>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, max))}
        placeholder={t('admin.profile.edit.lastNamePlaceholder', 'Enter your display name')}
        maxLength={max}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
      />
    </label>
  );
}
