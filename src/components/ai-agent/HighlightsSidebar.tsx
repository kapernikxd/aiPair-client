import type { Highlight } from "@/helpers/types/ai-agent";
import HighlightCard from "./HighlightCard";
import SessionVibe from "./SessionVibe";


export default function HighlightsSidebar({ highlights }: { highlights: Highlight[] }) {
    return (
        <aside className="flex flex-col gap-6">
            {highlights.map((h) => (
                <HighlightCard key={h.title} item={h} />
            ))}
            <SessionVibe />
        </aside>
    );
}