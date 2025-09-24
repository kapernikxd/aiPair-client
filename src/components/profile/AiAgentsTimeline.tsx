import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import AiAgentCard from "./AiAgentCard";

type AiAgentsTimelineProps = {
  items: AiBotDTO[];
  title: string;
  description: string;
  emptyMessage?: string;
};

export default function AiAgentsTimeline({ items, title, description, emptyMessage }: AiAgentsTimelineProps) {
  const hasItems = items.length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-white/70">{description}</p>
      <div className="mt-6 space-y-4">
        {hasItems ? (
          items.map((aiAgent) => <AiAgentCard key={aiAgent._id ?? aiAgent.name} aiAgent={aiAgent} />)
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
            {emptyMessage ?? "No AI agents to display yet."}
          </p>
        )}
      </div>
    </section>
  );
}
