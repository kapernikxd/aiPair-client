import { Sparkles } from "lucide-react";


export default function UsefulIn({ items }: { items: string[] }) {
    return (
        <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                <Sparkles className="size-4 text-violet-300" /> Useful in:
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
                {items.map((t) => (
                    <li key={t} className="rounded-2xl border border-white/5 bg-white/5 p-4">{t}</li>
                ))}
            </ul>
        </section>
    );
}