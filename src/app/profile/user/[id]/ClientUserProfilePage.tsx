"use client";

import { useCallback, useEffect, useState } from "react";

import AppShell from "@/components/AppShell";

import GradientBackdrop from "@/components/user/GradientBackdrop";
import HeaderBar from "@/components/user/HeaderBar";
import SectionHeader from "@/components/user/SectionHeader";
import TalkieGrid from "@/components/user/TalkieGrid";
import ProfileCard from "@/components/profile/ProfileCard";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";

interface UserProfilePageProps {
  profileId?: string;
}

export default function UserProfilePage({ profileId }: UserProfilePageProps) {
  const { profileStore } = useRootStore();

  const profile = useStoreData(profileStore, (store) => store.profile);
  const templateProfile = useStoreData(profileStore, (store) => store.getProfileInitial);
  const genderLabels = useStoreData(profileStore, (store) => store.genderLabels);
  const myProfile = useStoreData(profileStore, (store) => store.myProfile);
  const isLoadingProfile = useStoreData(profileStore, (store) => store.isLoadingProfile);
  const isFollowing = profile?.isFollowing;
  const profileUserId = profile?._id;

  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    void profileStore.fetchProfileById(profileId);

    return () => {
      profileStore.clearViewedProfile();
    };
  }, [profileId, profileStore]);

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

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
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
            <SectionHeader
              title="Talkie List"
              subtitle={"Where the stories stay safe and the signal stays clear."}
              actionLabel="View archive"
            />
            <TalkieGrid items={templateProfile.talkies} />
            {isLoadingProfile && <p className="text-sm text-white/60">Loading profile…</p>}
          </section>
        </div>
      </div>
    </AppShell>
  );
}
