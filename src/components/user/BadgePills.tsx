export default function BadgePills({ badges }: { badges: string[] }) {
    return (
        <div className="flex flex-wrap gap-2">
            {badges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60">
                    {badge}
                </span>
            ))}
        </div>
    );
}