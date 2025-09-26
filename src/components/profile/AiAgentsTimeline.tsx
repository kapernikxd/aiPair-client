import HoverSwapCard from "@/components/AiCard";
import { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { mapAiBotsToHoverSwapCards } from "@/helpers/utils/aiBot";
import { ReactNode } from "react";

type AiAgentsTimelineProps = {
  items: AiBotDTO[];
  title: string;
  description: string;
  emptyMessage?: ReactNode;
};

export default function AiAgentsTimeline({ items, title, description, emptyMessage }: AiAgentsTimelineProps) {
  const resolvedEmptyMessage = emptyMessage ?? "No AI agents to display yet.";
  const cardItems = mapAiBotsToHoverSwapCards(items);

  const renderMessage = (message: ReactNode) =>
    typeof message === "string" ? (
      <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
        {message}
      </p>
    ) : (
      message
    );

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/70">{description}</p>
      </div>

      <div className="mt-6">
        {cardItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
            {cardItems.map((item) => (
              <div key={item.id} className="flex justify-center sm:justify-start">
                <HoverSwapCard
                  src={item.src}
                  avatarSrc={item.avatarSrc}
                  title={item.title}
                  views={item.views}
                  hoverText={item.hoverText}
                  href={item.href}
                />
              </div>
            ))}
          </div>
        ) : (
          renderMessage(resolvedEmptyMessage)
        )}
      </div>
    </section>
  );
}
