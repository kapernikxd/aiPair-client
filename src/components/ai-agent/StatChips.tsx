export default function StatChips({ items }: { items: string[] }) {
    return (
        <div className="flex flex-wrap gap-3 text-sm text-white/70">
            {items.map((chip) => (
                <span key={chip} className="rounded-full bg-white/10 px-3 py-1">
                    {chip}
                </span>
            ))}
        </div>
    );
}