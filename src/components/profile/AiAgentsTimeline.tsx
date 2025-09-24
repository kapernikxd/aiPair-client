import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import AiAgentCard from "./AiAgentCard";


export default function AiAgentsTimeline({ items }: { items: AiBotDTO[] }) {
    return (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">AI Agents list</h2>
            <p className="mt-2 text-sm text-white/70">Here are the AI ​​agents you have created.</p>
            <div className="mt-6 space-y-4">
                {items.slice(0, 3).map((aiAgent) => (
                    <AiAgentCard key={aiAgent.name} aiAgent={aiAgent} />
                ))}
            </div>
        </section>
    );
}