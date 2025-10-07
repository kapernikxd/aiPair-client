"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";

import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/ai-agent/GradientBackdrop";
import HeaderCard from "@/components/ai-agent/HeaderCard";
import StatChips from "@/components/ai-agent/StatChips";
import { PrimaryCTAs } from "@/components/ai-agent/ActionButtons";
import Introduction from "@/components/ai-agent/Introduction";
import SignatureMoves from "@/components/ai-agent/SignatureMoves";
import HighlightsSidebar from "@/components/ai-agent/HighlightsSidebar";
import BotGallery from "@/components/ai-agent/BotGallery";
import { Button } from "@/components/ui/Button";
import EditAiAgentDialog from "@/components/ai-agent/edit/EditAiAgentDialog";
import MoreActionsMenu from "@/components/MoreActionsMenu";

import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { getUserFullName } from "@/helpers/utils/user";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import type { Highlight } from "@/helpers/types/ai-agent";
import SessionVibe from "@/components/ai-agent/SessionVibe";
import { useBreakpoint } from "@/helpers/hooks/useBreakpoint";
import { useCopyLink } from "@/helpers/hooks/useCopyLink";
import { useTranslations } from "@/localization/TranslationProvider";


interface ClientAiAgentProfilePageProps {
  aiBotId?: string;
}

export default function ClientAiAgentProfilePage({ aiBotId }: ClientAiAgentProfilePageProps) {
  const { routes, getProfile } = useAuthRoutes();
  const { aiBotStore, authStore, chatStore } = useRootStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isMdUp } = useBreakpoint(); // md (≥768px) и выше
  const discoverRoute = routes.discover;
  const { t } = useTranslations();
  const copyLink = useCopyLink();

  const aiBot = useStoreData(aiBotStore, (store) => store.selectAiBot);
  const isLoading = useStoreData(aiBotStore, (store) => store.isAiUserLoading);
  const botDetails = useStoreData(aiBotStore, (store) => store.botDetails);
  const botPhotos = useStoreData(aiBotStore, (store) => store.botPhotos);
  const botDetailsLoading = useStoreData(aiBotStore, (store) => store.photosLoading);
  const myBots = useStoreData(aiBotStore, (store) => store.myBots);
  const isAuthenticated = useStoreData(authStore, (store) => store.isAuthenticated);
  const [activeTab, setActiveTab] = useState<"info" | "gallery">("info");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (!aiBotId) return;

    aiBotStore.clearSelectedAiBot();
    aiBotStore.clearBotDetails();

    void aiBotStore.fetchAiBotById(aiBotId);
    void aiBotStore.fetchBotDetails(aiBotId);

    return () => {
      aiBotStore.clearSelectedAiBot();
      aiBotStore.clearBotDetails();
    };
  }, [aiBotId, aiBotStore]);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (myBots.length) return;

    void aiBotStore.fetchMyAiBots();
  }, [isAuthenticated, myBots.length, aiBotStore]);
  const highlights = useMemo<Highlight[]>(() => {
    if (!aiBot) return [];

    const creator = aiBot.createdBy;
    const creatorName = creator ? getUserFullName(creator) : "";
    const creatorHref = creator?._id ? getProfile(creator._id) : undefined;

    return [
      {
        title: t("admin.profile.aiAgent.highlights.creatorInfo", "Creator Info"),
        lines: [
          {
            label: t("admin.profile.aiAgent.highlights.creator", "Creator"),
            value: creatorName,
            href: creatorHref,
          },
          {
            label: t("admin.profile.aiAgent.highlights.created", "Created"),
            value: `${aiBot.createdAt}`,
          },
        ],
      },
    ];
  }, [aiBot, getProfile, t]);

  const chatHref = routes.adminChat;
  const aiBotProfileId = aiBot?._id;
  const isFollowing = botDetails?.isFollowing ?? aiBot?.isFollowing ?? false;
  const disableFollowAction = !isAuthenticated || !aiBotProfileId;

  const isCreator = useMemo(() => {
    if (!aiBot) return false;
    return myBots.some((bot) => bot._id === aiBot._id);
  }, [aiBot, myBots]);
  const canEdit = Boolean(aiBot) && isCreator;

  useEffect(() => {
    if (!isCreator) {
      setIsEditOpen(false);
    }
  }, [isCreator]);

  const closeEditDialog = () => setIsEditOpen(false);

  const handleToggleFollow = useCallback(async () => {
    if (!aiBotProfileId || disableFollowAction) {
      return;
    }

    setIsFollowUpdating(true);
    try {
      await aiBotStore.followAiBot(aiBotProfileId);
    } finally {
      setIsFollowUpdating(false);
    }
  }, [aiBotStore, aiBotProfileId, disableFollowAction]);

  const handleStartChat = useCallback(async () => {
    if (!aiBotProfileId || isChatLoading) {
      return;
    }

    setIsChatLoading(true);
    try {
      const response = await chatStore.messageById(aiBotProfileId);
      const chatId = response?._id ?? response?.data?._id;
      if (chatId) {
        const encodedId = encodeURIComponent(chatId);
        router.push(`${routes.adminChat}?chatId=${encodedId}`);
      }
    } catch (error) {
      console.error("Failed to start chat with AI agent:", error);
    } finally {
      setIsChatLoading(false);
    }
  }, [aiBotProfileId, chatStore, isChatLoading, router, routes.adminChat]);

  const handleAiAgentDeleted = useCallback(() => {
    router.push(discoverRoute);
  }, [router, discoverRoute]);

  const handleShare = useCallback(() => {
    if (!pathname) return;
    void copyLink(pathname);
  }, [copyLink, pathname]);

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        {canEdit && aiBot && (
          <EditAiAgentDialog open={isEditOpen} aiAgent={aiBot} onClose={closeEditDialog} />
        )}

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-32 md:pb-20 pt-4 md:pt-14">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {isMdUp && (
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="frostedIcon"
                  aria-label={t("admin.profile.aiAgent.backAria", "Go back")}
                >
                  <ArrowLeft className="size-5" />
                </Button>
              )}
              <Button
                type="button"
                onClick={handleShare}
                variant="frostedIcon"
                aria-label={t("admin.profile.aiAgent.shareAria", "Share agent")}
              >
                <Share2 className="size-5" />
              </Button>
              <MoreActionsMenu
                mode="aiAgent"
                reportTargetId={aiBotProfileId}
                aiAgentId={aiBotProfileId}
                canDeleteAiAgent={isCreator}
                onAiAgentDeleted={handleAiAgentDeleted}
              />
            </div>
            {canEdit && (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  variant="solidWhitePill"
                >
                  {t("admin.profile.aiAgent.editButton", "Edit AI Agent")}
                </Button>
              </div>
            )}
          </div>

          {!aiBot ? (
            <div className="rounded-3xl border border-white/10 bg-neutral-900/70 p-8 text-center text-sm text-white/70">
              {isLoading
                ? t("admin.profile.aiAgent.loading", "Loading agent profile…")
                : t(
                    "admin.profile.aiAgent.unavailable",
                    "This agent is unavailable or no longer exists.",
                  )}
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-1 md:p-8 backdrop-blur">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                  <HeaderCard user={aiBot} />
                </div>
                {botDetails?.categories && <StatChips items={botDetails.categories} />}
                <PrimaryCTAs
                  chatHref={chatHref}
                  isFollowing={isFollowing}
                  isBusy={isFollowUpdating}
                  disableFollowAction={disableFollowAction}
                  onToggleFollow={handleToggleFollow}
                  onStartChat={handleStartChat}
                  isChatLoading={isChatLoading}
                />
              </div>

              <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
                <div className="rounded-3xl border border-white/10 bg-neutral-900/60 p-1 md:p-8">
                  <div className="inline-flex rounded-full bg-white/5 p-1 text-sm font-medium text-white/70 p-2 md:p-0" >
                    <button
                      type="button"
                      onClick={() => setActiveTab("info")}
                    className={`rounded-full px-4 py-2 transition ${activeTab === "info"
                        ? "bg-white text-neutral-900 shadow"
                        : "hover:text-white"
                        }`}
                  >
                      {t("admin.profile.aiAgent.tabs.info", "Information")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("gallery")}
                      className={`rounded-full px-4 py-2 transition ${activeTab === "gallery"
                        ? "bg-white text-neutral-900 shadow"
                        : "hover:text-white"
                        }`}
                  >
                      {t("admin.profile.aiAgent.tabs.gallery", "Gallery")}
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {activeTab === "info" ? (
                      <>
                        {botDetails?.aiPrompt && <Introduction text={botDetails.aiPrompt} />}
                        {botDetails && <SessionVibe description={botDetails.intro} />}
                        {botDetails?.usefulness && <SignatureMoves items={botDetails.usefulness} />}
                        <HighlightsSidebar highlights={highlights} />
                      </>
                    ) : (
                      <BotGallery photos={botPhotos} isLoading={botDetailsLoading} />
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
