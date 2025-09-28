'use client';

import HoverSwapCard from '@/components/AiCard';
import { getUserAvatar } from '@/helpers/utils/user';
import type { AiBotDTO } from '@/helpers/types/dtos/AiBotDto';
import type { UserDTO } from '@/helpers/types';
import React from 'react';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';

type TimelineAgent = AiBotDTO | UserDTO;

type AiAgentsTimelineProps = {
  items: TimelineAgent[];
  title: string;
  description: string;
  emptyMessage?: string;
  isLoading?: boolean;
};

// Универсально вытягиваем URL из строки или объекта
const toUrl = (val: any): string | undefined => {
  if (!val) return undefined;
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val.url || val.src || val.path || val.location || undefined;
  }
  return undefined;
};

const formatFollowers = (count?: number) =>
  typeof count === 'number' ? count.toLocaleString('ru-RU') : undefined;

const getCoverImage = (agent: TimelineAgent): string | undefined => {
  if ('photos' in agent && Array.isArray(agent.photos) && agent.photos.length > 0) {
    return toUrl(agent.photos[0]);
  }
  return toUrl(getUserAvatar(agent));
};

const getAvatarImage = (agent: TimelineAgent): string | undefined => {
  return toUrl(getUserAvatar(agent));
};

const getHoverDescription = (agent: TimelineAgent): string | undefined => {
  if ('intro' in agent && agent.intro) return agent.intro;
  // userBio для людей, aiPrompt — для ботов (если есть)
  return (agent as any).userBio ?? (agent as any).aiPrompt ?? undefined;
};

export default function AiAgentsTimeline({
  items,
  title,
  description,
  emptyMessage,
  isLoading = false,
}: AiAgentsTimelineProps) {
  const hasItems = items.length > 0;
  const { getAiProfile } = useAuthRoutes(); 

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-1 md:p-6 backdrop-blur">
      <div className="space-y-2 p-3 md:p-0">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-sm text-white/70">{description}</p>
      </div>

      <div className="mt-6">
        {isLoading && !hasItems ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
            Загружаем подборку AI-агентов…
          </p>
        ) : hasItems ? (
          <div className="grid grid-cols-2 gap-2 md:gap-6 items-stretch md:grid-cols-3">
            {items.map((aiAgent) => (
              <HoverSwapCard
                key={(aiAgent as any)._id ?? aiAgent.name}
                src={getCoverImage(aiAgent)}
                avatarSrc={getAvatarImage(aiAgent)}
                title={aiAgent.name}
                views={formatFollowers((aiAgent as any).followers)}
                hoverText={getHoverDescription(aiAgent)}
                href={
                  (aiAgent as any)._id
                    ? getAiProfile(encodeURIComponent((aiAgent as any)._id))
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-white/15 bg-transparent px-4 py-8 text-center text-sm text-white/60">
            {emptyMessage ?? 'No AI agents to display yet.'}
          </p>
        )}

        {isLoading && hasItems && (
          <p className="mt-4 text-center text-xs text-white/50">Обновляем список…</p>
        )}
      </div>
    </section>
  );
}
