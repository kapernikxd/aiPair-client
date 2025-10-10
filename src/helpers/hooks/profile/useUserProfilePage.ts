// hooks/useUserProfilePage.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";
import { useTranslations } from "@/localization/TranslationProvider";

export function useUserProfilePage(profileId?: string) {
  const { profileStore, aiBotStore } = useRootStore();
  const { goToMyProfile } = useAuthRoutes();
  const { t } = useTranslations();

  // store state
  const profile = useStoreData(profileStore, (s) => s.profile);
  const genderLabels = useStoreData(profileStore, (s) => s.genderLabels);
  const myProfile = useStoreData(profileStore, (s) => s.myProfile);
  const myProfileId = myProfile?._id ?? null;
  const isLoadingProfile = useStoreData(profileStore, (s) => s.isLoadingProfile);
  const userAiBots = useStoreData(aiBotStore, (s) => s.userAiBots);
  const isLoadingAiBot = useStoreData(aiBotStore, (s) => s.isAiUserLoading);

  const isFollowing = profile?.isFollowing;
  const profileUserId = profile?._id;

  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  // redirect if viewing own profile
  useEffect(() => {
    if (!profileId) return;
    if (myProfileId && myProfileId === profileId) {
      goToMyProfile();
    }
  }, [goToMyProfile, myProfileId, profileId]);

  // fetch viewed profile + bots
  useEffect(() => {
    if (!profileId) return;
    if (myProfileId && myProfileId === profileId) return;

    void profileStore.fetchProfileById(profileId);
    void aiBotStore.fetchAiBotsByUserId(profileId);

    return () => {
      profileStore.clearViewedProfile();
      aiBotStore.clearSelectedAiBot();
      aiBotStore.clearUserAiBots();
    };
  }, [profileId, profileStore, aiBotStore, myProfileId]);

  const handleToggleFollow = useCallback(async () => {
    if (!profileUserId) return;
    setIsUpdatingFollow(true);
    try {
      await profileStore.followProfile(profileUserId);
    } finally {
      setIsUpdatingFollow(false);
    }
  }, [profileStore, profileUserId]);

  const genderLabel = useMemo(
    () =>
      profile?.gender
        ? genderLabels[profile.gender] ?? profile.gender
        : t("admin.profile.common.genderUnknown", "Not specified"),
    [profile?.gender, genderLabels, t]
  );

  const isViewingOwnProfile = Boolean(profileUserId && myProfileId === profileUserId);

  return {
    // data
    profile,
    genderLabel,
    userAiBots,
    // flags
    isLoadingAiBot,
    isLoadingProfile,
    isFollowing,
    isUpdatingFollow,
    isViewingOwnProfile,
    profileUserId,
    // i18n
    t,
    // handlers
    handleToggleFollow,
  } as const;
}
