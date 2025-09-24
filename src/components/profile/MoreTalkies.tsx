import Image from "next/image";
import type { TalkieCard } from "@/helpers/types/profile";


export default function MoreTalkies({ items }: { items: TalkieCard[] }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">More talkies</h2>
            <div className="mt-5 space-y-4">
                {items.map((talkie) => (
                    <div key={talkie.name} className="flex gap-3 rounded-2xl border border-white/10 bg-neutral-900/80 p-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl">
                            <Image src={talkie.image} alt={talkie.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-white">{talkie.name}</h3>
                            <p className="mt-1 text-xs text-white/60">{talkie.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}