import CardRailOneRow from "@/components/ui/CardRailOneRow";
import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import AiAgentCard from "./AiAgentCard";

type AiAgentsTimelineProps = {
  items: AiBotDTO[];
  title: string;
  description: string;
  emptyMessage?: string;
};

export default function AiAgentsTimeline({ items, title, description, emptyMessage }: AiAgentsTimelineProps) {
  const resolvedEmptyMessage = emptyMessage ?? "No AI agents to display yet.";

  return (
    <CardRailOneRow<AiBotDTO>
      items={items}
      title={title}
      description={description}
      titleAdornment={null}
      emptyMessage={
        <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
          {resolvedEmptyMessage}
        </p>
      }
      className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
      contentClassName="mt-6"
      cardWidth={320}
      gap={20}
      gridClassName="p-0"
      itemClassName="h-full"
      renderItem={(aiAgent) => <AiAgentCard aiAgent={aiAgent} />}
      getItemKey={(aiAgent) => aiAgent._id ?? aiAgent.name}
    />
  );
}
