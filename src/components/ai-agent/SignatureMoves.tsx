import { Sparkles } from "lucide-react";


const items = [
    "Detects emotional drift and reorients the conversation with grounding prompts.",
    "Threads long-form context into crisp strategies without losing warmth.",
    "Mirrors your language patterns to reduce friction and build momentum.",
];


export default function SignatureMoves() {
    return (
        <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                <Sparkles className="size-4 text-violet-300" /> Signature Moves
            </h3>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
                {items.map((t) => (
                    <li key={t} className="rounded-2xl border border-white/5 bg-white/5 p-4">{t}</li>
                ))}
            </ul>
        </section>
    );
}