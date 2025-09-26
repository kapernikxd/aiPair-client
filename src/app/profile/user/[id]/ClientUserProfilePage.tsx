"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppShell from "@/components/AppShell";

import GradientBackdrop from "@/components/user/GradientBackdrop";
import HeaderBar from "@/components/user/HeaderBar";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";
import ProfileCard from "@/components/profile/ProfileCard";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";

interface UserProfilePageProps {
  profileId?: string;
}

export default function UserProfilePage({ profileId }: UserProfilePageProps) {
  const { profileStore, aiBotStore } = useRootStore();
  const router = useRouter();

  const profile = useStoreData(profileStore, (store) => store.profile);
  const genderLabels = useStoreData(profileStore, (store) => store.genderLabels);
  const myProfile = useStoreData(profileStore, (store) => store.myProfile);
  const isLoadingProfile = useStoreData(profileStore, (store) => store.isLoadingProfile);
  const isFollowing = profile?.isFollowing;
  const profileUserId = profile?._id;

  const userAiBots = useStoreData(aiBotStore, (store) => store.userAiBots);
  const isLoadingAiBot = useStoreData(aiBotStore, (store) => store.isAiUserLoading);

  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    if (myProfile?._id && myProfile._id === profileId) {
      router.replace("/profile/my");
    }
  }, [myProfile?._id, profileId, router]);

  useEffect(() => {
    if (!profileId) return;

    if (myProfile?._id && myProfile._id === profileId) {
      return;
    }

    void profileStore.fetchProfileById(profileId);
    void aiBotStore.fetchAiBotsByUserId(profileId);

    return () => {
      profileStore.clearViewedProfile();
      aiBotStore.clearSelectedAiBot();
      aiBotStore.clearUserAiBots();
    };
  }, [profileId, profileStore, aiBotStore, myProfile?._id]);

  const handleToggleFollow = useCallback(async () => {
    if (!profileUserId) return;

    setIsUpdatingFollow(true);

    try {
      await profileStore.followProfile(profileUserId);
    } finally {
      setIsUpdatingFollow(false);
    }
  }, [profileStore, profileUserId]);

  const genderLabel = profile?.gender
    ? genderLabels[profile.gender] ?? profile.gender
    : "Not specified";
  const isViewingOwnProfile = Boolean(profileUserId && myProfile?._id === profileUserId);

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto w-full max-w-5xl px-4 pb-32 md:pb-20 pt-4 md:pt-14">
          <header className="space-y-8">
            <HeaderBar
              isFollowing={isFollowing}
              isBusy={isUpdatingFollow}
              onToggleFollow={handleToggleFollow}
              disableFollowAction={!profileUserId}
            />
            <ProfileCard
              profile={profile}
              genderLabel={genderLabel}
              isCurrentUser={isViewingOwnProfile}
            />
          </header>

          <section className="mt-12 space-y-6">
            <AiAgentsTimeline
              items={userAiBots}
              isLoading={isLoadingAiBot}
              title="AI Companions"
              description="Персональные напарники, созданные этим пользователем."
              emptyMessage="Пока что здесь пусто — добавьте своего первого AI-бота, чтобы показать его миру."
            />
            {isLoadingProfile && (
              <p className="text-sm text-white/60">Loading profile…</p>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
