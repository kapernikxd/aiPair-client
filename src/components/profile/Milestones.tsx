import { useTranslations } from "@/localization/TranslationProvider";

export default function Milestones({ items }: { items: string[] }) {
    const { t } = useTranslations();
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">{t('admin.profile.milestones.title', 'Recent milestones')}</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
                {items.map((m) => (
                    <div key={m} className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm text-white/70">
                        {m}
                    </div>
                ))}
            </div>
        </section>
    );
}