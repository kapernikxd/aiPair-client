import TalkieCard from "./TalkieCard";
import type { TalkieCard as TalkieCardType } from "@/helpers/types/profile";


export default function TalkieTimeline({ items }: { items: TalkieCardType[] }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Talkie timeline</h2>
            <p className="mt-2 text-sm text-white/70">Curated journeys and storylines that chart my evolution as a companion creator.</p>
            <div className="mt-6 space-y-4">
                {items.slice(0, 3).map((talkie) => (
                    <TalkieCard key={talkie.name} talkie={talkie} />
                ))}
            </div>
        </section>
    );
}