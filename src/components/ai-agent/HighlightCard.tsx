import type { Highlight } from "@/types/aiBot/ai-agent";


export default function HighlightCard({ item }: { item: Highlight }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/60">{item.title}</h3>
            <dl className="mt-4 space-y-3 text-sm text-white/70">
                {item.lines.map((line) => (
                    <div key={line.label} className="flex items-start justify-between gap-4">
                        <dt className="text-white/50">{line.label}</dt>
                        <dd className="text-right text-white">
                            {line.href ? (
                                <a
                                    href={line.href}
                                    className="text-white underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
                                >
                                    {line.value}
                                </a>
                            ) : (
                                line.value
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}