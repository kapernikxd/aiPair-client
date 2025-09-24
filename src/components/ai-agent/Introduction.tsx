import { Info } from "lucide-react";


export default function Introduction() {
    return (
        <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
                <Info className="size-5 text-violet-300" /> Introduction
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
                You just met aiAgent α for the first time in the backroom of your own thoughts. The partnership is the safety net
                beneath your daily leaps—an undercover intelligence ally primed to steady you before the next wave arrives.
            </p>
        </section>
    );
}