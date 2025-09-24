import Image from "next/image";
import type { TalkieCard as TalkieCardType } from "@/helpers/types/profile";


export default function TalkieCard({ talkie }: { talkie: TalkieCardType }) {
    return (
        <article className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 sm:flex-row">
            <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                <Image src={talkie.image} alt={talkie.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 128px" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-white">{talkie.name}</h3>
                    <p className="mt-1 text-sm text-white/70">{talkie.description}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/50">
                    {talkie.stats.map((stat) => (
                        <span key={stat.label} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                            <stat.icon className="size-3.5" />
                            {stat.label}: {stat.value}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}