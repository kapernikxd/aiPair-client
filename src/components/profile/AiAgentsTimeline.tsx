import HoverSwapCard from "@/components/AiCard";
import { getUserAvatar } from "@/helpers/utils/user";
import type { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import type { UserDTO } from "@/helpers/types";

type TimelineAgent = AiBotDTO | UserDTO;

type AiAgentsTimelineProps = {
  items: TimelineAgent[];
  title: string;
  description: string;
  emptyMessage?: string;
  isLoading?: boolean;
};

const formatFollowers = (count?: number) =>
  typeof count === "number" ? count.toLocaleString("ru-RU") : undefined;

const getCoverImage = (agent: TimelineAgent) => {
  if ("photos" in agent && Array.isArray(agent.photos) && agent.photos.length > 0) {
    return agent.photos[0];
  }

  return getUserAvatar(agent);
};

const getHoverDescription = (agent: TimelineAgent) => {
  if ("intro" in agent && agent.intro) {
    return agent.intro;
  }

  return agent.userBio ?? agent.aiPrompt ?? undefined;
};

export default function AiAgentsTimeline({
  items,
  title,
  description,
  emptyMessage,
  isLoading = false,
}: AiAgentsTimelineProps) {
  const hasItems = items.length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/70">{description}</p>
      </div>

      <div className="mt-6">
        {isLoading && !hasItems ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
            Загружаем подборку AI-агентов…
          </p>
        ) : hasItems ? (
          <div className="grid grid-cols-2 place-items-center gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {items.map((aiAgent) => (
              <HoverSwapCard
                key={aiAgent._id ?? aiAgent.name}
                src={getCoverImage(aiAgent)}
                avatarSrc={getUserAvatar(aiAgent)}
                title={aiAgent.name}
                views={formatFollowers(aiAgent.followers)}
                hoverText={getHoverDescription(aiAgent)}
                href={`/profile/ai-agent/${encodeURIComponent(aiAgent._id)}`}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
            {emptyMessage ?? "No AI agents to display yet."}
          </p>
        )}

        {isLoading && hasItems && (
          <p className="mt-4 text-center text-xs text-white/50">Обновляем список…</p>
        )}
      </div>
    </section>
  );
}
