import { Clock } from "lucide-react";
import type { Opening } from "@/types/aiBot/ai-agent";


export default function OpeningsList({ openings }: { openings: Opening[] }) {
    return (
        <section>
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
                <Clock className="size-4 text-violet-300" /> Начало диалога
            </h3>
            <div className="mt-4 space-y-3">
                {openings.map((o) => (
                    <div key={o.title} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                        <h4 className="text-sm font-semibold text-white">{o.title}</h4>
                        <p className="mt-1 text-sm text-white/70">{o.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}