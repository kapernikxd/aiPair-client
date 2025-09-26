import { Info } from "lucide-react";
import TruncatedReveal from "../ui/TruncatedReveal";


export default function Introduction({ text }: { text: string }) {
    return (
        <section className="p-2 md:p-0">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Info className="size-5 text-violet-300" /> Introduction
            </h2>
            <TruncatedReveal
                text={text}
                maxChars={160}
                className="mt-3 text-sm leading-6 text-white/70"
                title="Подробнее"
            />
        </section>
    );
}