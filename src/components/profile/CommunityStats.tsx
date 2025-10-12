import { Star, Users2 } from "lucide-react";
import { useTranslations } from "@/localization/TranslationProvider";

export default function CommunityStats() {
    const { t } = useTranslations();
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">{t('admin.profile.communityStats.title', 'Community stats')}</h2>
            <div className="mt-4 grid gap-4">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">{t('admin.profile.communityStats.coreCircle', 'Core circle')}</p>
                        <p className="text-sm text-white">{t('admin.profile.communityStats.members', '58 members')}</p>
                    </div>
                    <Users2 className="size-6 text-white/60" />
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3">
                    <div>
                        <p className="text-xs uppercase tracking-wide text-white/40">{t('admin.profile.communityStats.avgRating', 'Avg. rating')}</p>
                        <p className="text-sm text-white">4.9</p>
                    </div>
                    <Star className="size-6 text-amber-400" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white/70">
                    {t('admin.profile.communityStats.testimonial', '“Vadim’s sessions feel like stepping into a movie scene you secretly hope is real.”')}
                </div>
            </div>
        </section>
    );
}