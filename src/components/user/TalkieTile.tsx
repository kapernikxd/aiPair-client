import Image from "next/image";
import type { TalkieCard } from "@/helpers/types/profile";


export default function TalkieTile({ talkie }: { talkie: TalkieCard }) {
    return (
        <article className="group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-[0_20px_40px_-20px_rgba(59,0,104,0.45)] transition hover:border-violet-400/40">
            <div className="relative h-52 w-full overflow-hidden">
                <Image src={talkie.image} alt={talkie.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
            </div>
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">{talkie.name}</h3>
                    <span className="text-xs uppercase tracking-widest text-violet-200/80">Secure</span>
                </div>
                <p className="text-sm leading-6 text-white/70">{talkie.description}</p>
                <div className="flex items-center gap-3 text-sm text-white/70">
                    {talkie.stats.map((stat) => (
                        <span key={stat.label} className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium">
                            <stat.icon className="size-3.5 text-violet-200" />
                            {stat.value}
                        </span>
                    ))}
                </div>
            </div>
        </article>
    );
}