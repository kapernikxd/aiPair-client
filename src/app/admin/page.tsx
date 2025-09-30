'use client';

import React, { useCallback, useEffect, useMemo, useState } from "react";

import AppShell from "@/components/AppShell";
import CardRailOneRow from "@/components/ui/CardRailOneRow";
import CardRailTwoRows from "@/components/ui/CardRailTwoRows";
import { Spacer } from "@/components/ui/Spacer";
import { AiBotMainPageBot } from "@/helpers/types";
import { BASE_URL } from "@/helpers/http";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { GetProfile, useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/localization/TranslationProvider";

const FALLBACK_IMAGE = "/img/noProfile.jpg";

const buildImageUrl = (path?: string) => {
  if (!path) {
    return undefined;
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("/")) {
    return path;
  }

  const normalizedPath = path.startsWith("images/") ? path : `images/${path}`;
  return `${BASE_URL}${normalizedPath}`;
};

const getCardItems = (
  bots: AiBotMainPageBot[],
  getAiProfile: GetProfile,
  onChatNow?: (botId: string) => void,
  chatLoadingBotId?: string | null,
  translate?: ReturnType<typeof useTranslations>['t'],
) =>
  bots.map((bot) => {
    const previewImage = bot.details?.photos?.[0] ?? bot.avatarFile;
    const src = buildImageUrl(previewImage) ?? FALLBACK_IMAGE;
    const avatarSrc = buildImageUrl(bot.avatarFile) ?? FALLBACK_IMAGE;
    const fullName = [bot.name, bot.lastname].filter(Boolean).join(" ").trim();

    return {
      id: bot.id,
      src,
      avatarSrc,
      title: fullName || bot.username || translate?.('common.aiAgent', 'AI Agent') || 'AI Agent',
      views: bot.profession || bot.username,
      hoverText: bot.userBio || bot.details?.intro,
      href: getAiProfile(bot.id),
      onChatNow: onChatNow ? () => onChatNow(bot.id) : undefined,
      isChatLoading: chatLoadingBotId === bot.id,
    };
  });

const EMPTY_STATE_KEY = "admin.emptyBots";

export default function Landing() {
  const { aiBotStore, chatStore, uiStore } = useRootStore();
  const { getAiProfile, routes } = useAuthRoutes();
  const router = useRouter();
  const { t, locale } = useTranslations();

  const bots = useStoreData(aiBotStore, (store) => store.mainPageBots);
  const isLoading = useStoreData(aiBotStore, (store) => store.isLoadingMainPageBots);
  const error = useStoreData(aiBotStore, (store) => store.mainPageBotsError);
  const [chatLoadingBotId, setChatLoadingBotId] = useState<string | null>(null);

  useEffect(() => {
    if (aiBotStore.mainPageBots.length === 0) {
      void aiBotStore.fetchMainPageBots();
    }
  }, [aiBotStore]);

  const groupedBots = useMemo(() => {
    const result = new Map<string, AiBotMainPageBot[]>();

    bots.forEach((bot) => {
      const categories = bot.details?.categories?.length ? bot.details.categories : [t('admin.categories.none', 'Uncategorized')];
      categories.forEach((category) => {
        const normalizedCategory = category.trim() || t('admin.categories.none', 'Uncategorized');
        const existing = result.get(normalizedCategory) ?? [];
        existing.push(bot);
        result.set(normalizedCategory, existing);
      });
    });

    return Array.from(result.entries()).sort((a, b) => a[0].localeCompare(b[0], locale));
  }, [bots, locale, t]);

  const hasBots = groupedBots.length > 0;

  const handleChatNow = useCallback(
    async (botId: string) => {
      if (!botId || chatLoadingBotId === botId) {
        return;
      }

      setChatLoadingBotId(botId);

      try {
        const response = await chatStore.messageById(botId);
        const chatId = response?._id ?? response?.data?._id;

          if (chatId) {
            router.push(`${routes.adminChat}?chatId=${encodeURIComponent(chatId)}`);
          } else {
            uiStore.showSnackbar(t('landing.errors.chat', 'Failed to open chat. Please try again.'), "error");
          }
        } catch (error) {
          console.error("Failed to open chat with AI bot:", error);
          uiStore.showSnackbar(t('landing.errors.chat', 'Failed to open chat. Please try again.'), "error");
        } finally {
          setChatLoadingBotId((current) => (current === botId ? null : current));
        }
      },
      [chatLoadingBotId, chatStore, router, routes.adminChat, t, uiStore],
  );

  return (
    <AppShell>
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto p-2 md:p-9">
          <Spacer size={8} />

          {isLoading && (
            <div className="px-3 text-sm text-white/70 md:px-0">{t('admin.loadingBots', 'Loading bots…')}</div>
          )}

          {error && (
            <div className="px-3 text-sm text-red-400 md:px-0">{error}</div>
          )}

          {!isLoading && !error && !hasBots && (
            <div className="px-3 text-sm text-white/70 md:px-0">{t(EMPTY_STATE_KEY, 'No bots available yet.')}</div>
          )}

          {!isLoading && !error &&
            groupedBots.map(([category, categoryBots], index) => {
              const cardItems = getCardItems(categoryBots, getAiProfile, handleChatNow, chatLoadingBotId, t);
              const spacing = index === groupedBots.length - 1 ? 40 : 90;

              if (cardItems.length > 8) {
                return (
                  <React.Fragment key={category}>
                    <CardRailTwoRows title={category} items={cardItems} className="mx-auto max-w-[1400px]" />
                    <Spacer size={spacing} />
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={category}>
                  <CardRailOneRow title={category} items={cardItems} />
                  <Spacer size={spacing} />
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </AppShell>
  );
}
