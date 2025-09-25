"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

import AppShell from "@/components/AppShell";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";

import GradientBackdrop from "@/components/user/GradientBackdrop";
import HeaderBar from "@/components/user/HeaderBar";
import UserHero from "@/components/user/UserHero";
import SectionHeader from "@/components/user/SectionHeader";
import TalkieGrid from "@/components/user/TalkieGrid";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const { routes } = useAuthRoutes();
  const { profileStore } = useRootStore();

  const profile = useStoreData(profileStore, (store) => store.profile);
  const templateProfile = useStoreData(profileStore, (store) => store.getProfileInitial);
  const isLoadingProfile = useStoreData(profileStore, (store) => store.isLoadingProfile);

  const profileId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    if (!profileId) return;

    void profileStore.fetchProfileById(profileId);

    return () => {
      profileStore.clearViewedProfile();
    };
  }, [profileId, profileStore]);

  const heroData = useMemo(() => {
    const hasProfile = Boolean(profile?._id);
    const source = hasProfile ? profile : undefined;

    return {
      name: hasProfile ? getUserFullName(profile) : templateProfile.name,
      intro: source?.userBio ?? templateProfile.intro,
      location: source?.city?.name ?? templateProfile.location,
      avatar: hasProfile ? getUserAvatar(profile) : templateProfile.avatar,
      badges: templateProfile.badges,
    };
  }, [profile, templateProfile]);

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <HeaderBar />
            <UserHero
              name={heroData.name}
              intro={heroData.intro}
              location={heroData.location}
              avatar={heroData.avatar}
              badges={heroData.badges}
              messageHref={routes.adminChat}
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