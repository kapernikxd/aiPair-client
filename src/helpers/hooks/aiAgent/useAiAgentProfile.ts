import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useBreakpoint } from "@/helpers/hooks/useBreakpoint";
import { useCopyLink } from "@/helpers/hooks/useCopyLink";
import { getUserFullName } from "@/helpers/utils/user";
import { useTranslations } from "@/localization/TranslationProvider";
import { Highlight } from "@/helpers/types/ai-agent";


export type ActiveTab = "info" | "gallery";

export function useAiAgentProfile(aiBotId?: string) {
  const { routes, getProfile } = useAuthRoutes();
  const { aiBotStore, authStore, chatStore } = useRootStore();
  const router = useRouter();
  const pathname = usePathname();
  const { isMdUp } = useBreakpoint();
  const { t } = useTranslations();
  const copyLink = useCopyLink();

  // Stores
  const aiBot = useStoreData(aiBotStore, (s) => s.selectAiBot);
  const isLoading = useStoreData(aiBotStore, (s) => s.isAiUserLoading);
  const botDetails = useStoreData(aiBotStore, (s) => s.botDetails);
  const botPhotos = useStoreData(aiBotStore, (s) => s.botPhotos);
  const botDetailsLoading = useStoreData(aiBotStore, (s) => s.photosLoading);
  const myBots = useStoreData(aiBotStore, (s) => s.myBots);
  const isAuthenticated = useStoreData(authStore, (s) => s.isAuthenticated);

  // Local state
  const [activeTab, setActiveTab] = useState<ActiveTab>("info");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Initial data
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

  // Derived
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
    if (!isCreator) setIsEditOpen(false);
  }, [isCreator]);

  // Handlers
  const onBack = useCallback(() => router.back(), [router]);

  const handleToggleFollow = useCallback(async () => {
    if (!aiBotProfileId || disableFollowAction) return;
    setIsFollowUpdating(true);
    try {
      await aiBotStore.followAiBot(aiBotProfileId);
    } finally {
      setIsFollowUpdating(false);
    }
  }, [aiBotStore, aiBotProfileId, disableFollowAction]);

  const handleStartChat = useCallback(async () => {
    if (!aiBotProfileId || isChatLoading) return;
    setIsChatLoading(true);
    try {
      const response = await chatStore.messageById(aiBotProfileId);
      const chatId = response?._id ?? response?.data?._id;
      if (chatId) {
        const encodedId = encodeURIComponent(chatId);
        router.push(`${routes.adminChat}?chatId=${encodedId}`);
      }
    } catch (e) {
      console.error("Failed to start chat with AI agent:", e);
    } finally {
      setIsChatLoading(false);
    }
  }, [aiBotProfileId, chatStore, isChatLoading, router, routes.adminChat]);

  const handleAiAgentDeleted = useCallback(() => {
    router.push(routes.discover);
  }, [router, routes.discover]);

  const handleShare = useCallback(() => {
    if (!pathname) return;
    void copyLink(pathname);
  }, [copyLink, pathname]);

  const closeEditDialog = useCallback(() => setIsEditOpen(false), []);

  return {
    // stores + data
    aiBot, isLoading, botDetails, botPhotos, botDetailsLoading,
    // ui state
    activeTab, setActiveTab,
    isEditOpen, setIsEditOpen, closeEditDialog,
    isFollowUpdating, isChatLoading,
    // perms/flags
    canEdit, isCreator, isFollowing, disableFollowAction,
    // computed
    highlights, chatHref, aiBotProfileId,
    // env
    isMdUp, t,
    // handlers
    onBack, handleShare, handleToggleFollow, handleStartChat, handleAiAgentDeleted,
  } as const;
}