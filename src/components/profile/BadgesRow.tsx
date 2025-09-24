export default function BadgesRow({ badges }: { badges: string[] }) {
    return (
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
                <div key={badge} className="rounded-2xl border border-white/10 bg-white/[0.08] px-4 py-3 text-sm text-white/80">
                    {badge}
                </div>
            ))}
        </div>
    );
}