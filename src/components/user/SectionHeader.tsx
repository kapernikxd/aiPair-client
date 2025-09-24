export default function SectionHeader({ title, subtitle, actionLabel }: { title: string; subtitle?: string; actionLabel?: string }) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-semibold">{title}</h2>
                {subtitle ? <p className="mt-1 text-sm text-white/60">{subtitle}</p> : null}
            </div>
            {actionLabel ? (
                <button className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wide text-white/60 transition hover:bg-white/10 sm:flex">
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}