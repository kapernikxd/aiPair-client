import type { Highlight } from "@/types/aiBot/ai-agent";
import HighlightCard from "./HighlightCard";


export default function HighlightsSidebar({ highlights }: { highlights: Highlight[] }) {
    return (
        <aside className="flex flex-col gap-6">
            {highlights.map((h) => (
                <HighlightCard key={h.title} item={h} />
            ))}
        </aside>
    );
}