import { Info } from "lucide-react";


export default function Introduction({ text }: { text: string }) {
    return (
        <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Info className="size-5 text-violet-300" /> Introduction
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">{text}</p>
        </section>
    );
}