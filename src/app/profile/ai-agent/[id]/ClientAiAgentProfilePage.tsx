"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/ai-agent/GradientBackdrop";
import HeaderCard from "@/components/ai-agent/HeaderCard";
import StatChips from "@/components/ai-agent/StatChips";
import { PrimaryCTAs } from "@/components/ai-agent/ActionButtons";
import Introduction from "@/components/ai-agent/Introduction";
import SignatureMoves from "@/components/ai-agent/SignatureMoves";
import OpeningsList from "@/components/ai-agent/OpeningsList";
import HighlightsSidebar from "@/components/ai-agent/HighlightsSidebar";
import BotGallery from "@/components/ai-agent/BotGallery";
import { Button } from "@/components/ui/Button";

import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { getUserAvatar, getUserFullName, getUsername } from "@/helpers/utils/user";
import { highlights as defaultHighlights, openings as defaultOpenings } from "@/helpers/data/ai-agent";

import type { AiAgentHeader } from "@/stores/AiBotStore";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";

import type { Highlight } from "@/helpers/types/ai-agent";

const FALLBACK_HEADER: AiAgentHeader = {
  name: "aiAgent α",
  curatorLabel: "Curated Intelligence",
  tagline: "Designed for deep, real-time co-thinking.",
  avatarSrc: "/img/mizuhara.png",
};

const FALLBACK_STATS_CHIPS = ["1.4K followers", "210 chats today", "By @talkie-labs"];

const FALLBACK_INTRODUCTION =
  "You just met aiAgent α for the first time in the backroom of your own thoughts. The partnership is the safety net beneath your daily leaps—an undercover intelligence ally primed to steady you before the next wave arrives.";

const FALLBACK_SIGNATURE_MOVES = [
  "Detects emotional drift and reorients the conversation with grounding prompts.",
  "Threads long-form context into crisp strategies without losing warmth.",
  "Mirrors your language patterns to reduce friction and build momentum.",
];

interface ClientAiAgentProfilePageProps {
  aiBotId?: string;
}

const formatDateTime = (isoDate?: string) => {
  if (!isoDate) return null;
  const value = new Date(isoDate);
  if (Number.isNaN(value.getTime())) return null;
  return value.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const parsePromptToHighlights = (prompt?: string) => {
  if (!prompt) return [] as string[];
  const parts = prompt
    .split(/\r?\n|[•\-\u2022]/)
    .map((part) => part.replace(/^[•\-\u2022]\s*/, "").trim())
    .filter(Boolean);
  if (!parts.length) {
    const sentences = prompt
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean);
    return sentences.slice(0, 3);
  }
  return parts.slice(0, 3);
};

export default function ClientAiAgentProfilePage({ aiBotId }: ClientAiAgentProfilePageProps) {
  const { routes } = useAuthRoutes();
  const { aiBotStore } = useRootStore();

  const aiBot = useStoreData(aiBotStore, (store) => store.selectAiBot);
  const isLoading = useStoreData(aiBotStore, (store) => store.isAiUserLoading);
  const botPhotos = useStoreData(aiBotStore, (store) => store.botPhotos);
  const photosLoading = useStoreData(aiBotStore, (store) => store.photosLoading);
  const [activeTab, setActiveTab] = useState<"info" | "gallery">("info");

  useEffect(() => {
    if (!aiBotId) return;

    aiBotStore.clearSelectedAiBot();
    aiBotStore.clearBotPhotos();

    void aiBotStore.fetchAiBotById(aiBotId);
    void aiBotStore.fetchBotPhotos(aiBotId);

    return () => {
      aiBotStore.clearSelectedAiBot();
      aiBotStore.clearBotPhotos();
    };
  }, [aiBotId, aiBotStore]);

  const header = useMemo<AiAgentHeader>(() => {
    if (!aiBot) {
      return FALLBACK_HEADER;
    }

    const fullName = getUserFullName(aiBot).trim();
    const displayName = fullName || aiBot.username || FALLBACK_HEADER.name;
    const curatorLabel = aiBot.curatorLabel || aiBot.profession || FALLBACK_HEADER.curatorLabel;
    const tagline = aiBot.tagline || aiBot.userBio || FALLBACK_HEADER.tagline;
    const avatarSrc = aiBot.avatarFile ? getUserAvatar(aiBot) : FALLBACK_HEADER.avatarSrc;

    return {
      name: displayName,
      curatorLabel,
      tagline,
      avatarSrc,
    };
  }, [aiBot]);

  const statsChips = useMemo(() => {
    if (!aiBot) {
      return FALLBACK_STATS_CHIPS;
    }

    const chips: string[] = [];

    if (typeof aiBot.followers === "number") {
      chips.push(`${aiBot.followers} followers`);
    }

    if (typeof aiBot.following === "number") {
      chips.push(`${aiBot.following} following`);
    }

    const username = getUsername(aiBot);
    if (username) {
      chips.push(`By ${username}`);
    }

    return chips.length ? chips : FALLBACK_STATS_CHIPS;
  }, [aiBot]);

  const introduction = useMemo(() => {
    if (!aiBot) {
      return FALLBACK_INTRODUCTION;
    }

    return (
      aiBot.introduction ||
      aiBot.intro ||
      aiBot.introMessage ||
      aiBot.userBio ||
      FALLBACK_INTRODUCTION
    );
  }, [aiBot]);

  const signatureMoves = useMemo(() => {
    if (!aiBot) {
      return FALLBACK_SIGNATURE_MOVES;
    }

    const fromApi = Array.isArray(aiBot.signatureMoves)
      ? aiBot.signatureMoves.filter(Boolean)
      : [];

    if (fromApi.length) {
      return fromApi;
    }

    const promptSegments = parsePromptToHighlights(aiBot.aiPrompt);

    return promptSegments.length ? promptSegments : FALLBACK_SIGNATURE_MOVES;
  }, [aiBot]);

  const openings = useMemo(() => {
    if (!aiBot) {
      return defaultOpenings;
    }

    const fromApi = Array.isArray(aiBot.openings) ? aiBot.openings : [];
    return fromApi.length ? fromApi : defaultOpenings;
  }, [aiBot]);

  const highlights = useMemo<Highlight[]>(() => {
    if (!aiBot) {
      return defaultHighlights;
    }

    if (Array.isArray(aiBot.highlights) && aiBot.highlights.length) {
      return aiBot.highlights;
    }

    const username = getUsername(aiBot);
    const createdAt = formatDateTime(aiBot.createdAt);
    const profession = aiBot.profession;

    return defaultHighlights.map((highlight) => ({
      ...highlight,
      lines: highlight.lines.map((line) => {
        if (line.label === "Handle" && username) {
          return { ...line, value: username };
        }
        if (line.label === "Role" && profession) {
          return { ...line, value: profession };
        }
        if (line.label === "Created" && createdAt) {
          return { ...line, value: createdAt };
        }
        return line;
      }),
    }));
  }, [aiBot]);

  const chatHref = aiBot?.chatLink || routes.adminChat;

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-16 pt-16">
          {!aiBot ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8 text-center text-sm text-white/70">
              {isLoading ? "Loading agent profile…" : "This agent is unavailable or no longer exists."}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-8 backdrop-blur">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <HeaderCard header={header} />
                  <div className="flex items-center gap-3 self-start md:self-center">
                    <Link
                      href={routes.home}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                    >
                      Discover more
                    </Link>
                    <Button variant="ghostPill">Share</Button>
                  </div>
                </div>

                <StatChips items={statsChips} />
                <PrimaryCTAs chatHref={chatHref} />
              </div>

              <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
                <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
                  <div className="inline-flex rounded-full bg-white/5 p-1 text-sm font-medium text-white/70">
                    <button
                      type="button"
                      onClick={() => setActiveTab("info")}
                      className={`rounded-full px-4 py-2 transition ${
                        activeTab === "info"
                          ? "bg-white text-neutral-900 shadow"
                          : "hover:text-white"
                      }`}
                    >
                      Information
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("gallery")}
                      className={`rounded-full px-4 py-2 transition ${
                        activeTab === "gallery"
                          ? "bg-white text-neutral-900 shadow"
                          : "hover:text-white"
                      }`}
                    >
                      Gallery
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {activeTab === "info" ? (
                      <>
                        <Introduction text={introduction} />
                        <SignatureMoves items={signatureMoves} />
                        <OpeningsList openings={openings} />
                        <HighlightsSidebar highlights={highlights} />
                      </>
                    ) : (
                      <BotGallery photos={botPhotos} isLoading={photosLoading} />
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
