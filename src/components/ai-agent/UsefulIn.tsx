"use client";

import { Sparkles } from "lucide-react";

import { useTranslations } from "@/localization/TranslationProvider";

export default function UsefulIn({ items }: { items: string[] }) {
    const { t } = useTranslations();

    return (
        <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                <Sparkles className="size-4 text-violet-300" /> {t("admin.aiAgent.usefulIn", "Полезно в:")}
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
                {items.map((t) => (
                    <li key={t} className="rounded-2xl border border-white/5 bg-white/5 p-4">{t}</li>
                ))}
            </ul>
        </section>
    );
}