// hooks/useMyProfilePage.ts
"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useTranslations } from "@/localization/TranslationProvider";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";

type FilterValue = "my" | "subscribed";

export function useMyProfilePage() {
  const { profileStore, uiStore, aiBotStore } = useRootStore();
  const profile = useStoreData(profileStore, (s) => s.myProfile);
  const genderLabels = useStoreData(profileStore, (s) => s.genderLabels);
  const aiAgents = useStoreData(aiBotStore, (s) => s.myBots);
  const subscribedAiAgents = useStoreData(aiBotStore, (s) => s.subscribedBots);
  const isDialogOpen = useStoreData(uiStore, (s) => s.isEditProfileDialogOpen);

  const [activeFilter, setActiveFilter] = useState<FilterValue>("my");
  const { t: rawT } = useTranslations();
  const { getProfile } = useAuthRoutes();

  // адаптер, если где-то t ожидается с опциональным вторым аргументом
  const t = useCallback((key: string, fallback: string) => rawT(key, fallback), [rawT]);

  const shareHref = profile?._id ? getProfile(profile._id) : undefined;

  useEffect(() => {
    void profileStore.fetchMyProfile();
    void aiBotStore.fetchMyAiBots();
    void aiBotStore.fetchSubscribedAiBots();
  }, [profileStore, aiBotStore]);

  const filters = useMemo(
    () => [
      { value: "my" as const, label: t("admin.profile.my.filters.my", "My AI Agents") },
      { value: "subscribed" as const, label: t("admin.profile.my.filters.subscribed", "Subscribed AI Agents") },
    ],
    [t],
  );

  const timelineCopy =
    activeFilter === "my"
      ? {
          title: t("admin.profile.my.timeline.my.title", "My AI Agents"),
          description: t("admin.profile.my.timeline.my.description", "Here are the AI agents you have created."),
          empty: t("admin.profile.my.timeline.my.empty", "You haven’t created any AI agents yet."),
        }
      : {
          title: t("admin.profile.my.timeline.subscribed.title", "Subscribed AI Agents"),
          description: t("admin.profile.my.timeline.subscribed.description", "AI agents you follow will appear here."),
          empty: t("admin.profile.my.timeline.subscribed.empty", "You aren’t subscribed to any AI agents yet."),
        };

  const filteredAiAgents = activeFilter === "my" ? aiAgents : subscribedAiAgents;

  const openEdit = useCallback(() => uiStore.openEditProfileDialog(), [uiStore]);
  const closeEdit = useCallback(() => uiStore.closeEditProfileDialog(), [uiStore]);

  return {
    // data
    profile,
    genderLabels,
    shareHref,
    filteredAiAgents,

    // ui state
    isDialogOpen,
    activeFilter,
    setActiveFilter,

    // computed
    filters,
    timelineCopy,

    // handlers
    openEdit,
    closeEdit,

    // i18n
    t,
  } as const;
}
