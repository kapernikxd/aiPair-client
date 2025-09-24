import Image from "next/image";
import { ShieldCheck } from "lucide-react";


export default function HeaderCard() {
    return (
        <div className="flex items-center gap-4">
            <div className="relative size-20 overflow-hidden rounded-3xl border border-white/10">
                <Image src="/img/mizuhara.png" alt="aiAgent portrait" fill sizes="80px" className="object-cover" />
            </div>
            <div>
                <div className="flex items-center gap-2 text-sm text-white/60">
                    <ShieldCheck className="size-4 text-violet-300" />
                    Curated Intelligence
                </div>
                <h1 className="text-3xl font-semibold tracking-tight">aiAgent α</h1>
                <p className="text-sm text-white/70">Designed for deep, real-time co-thinking.</p>
            </div>
        </div>
    );
}