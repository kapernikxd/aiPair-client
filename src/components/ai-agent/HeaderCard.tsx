import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import type { AiAgentHeader } from "@/stores/AiBotStore";

export default function HeaderCard({ header }: { header: AiAgentHeader }) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-3xl border border-white/10">
                <Image src={header.avatarSrc} alt={`${header.name} portrait`} fill sizes="80px" className="object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <ShieldCheck className="size-4 text-violet-300" />
                    {header.curatorLabel}
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">{header.name}</h1>
                <p className="text-sm text-white/70">{header.tagline}</p>
            </div>
        </div>
    );
}