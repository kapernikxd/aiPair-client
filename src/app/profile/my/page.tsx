"use client";

import AppShell from "@/components/AppShell";
import EditProfileDialog from "@/components/profile/edit/EditProfileDialog";


import GradientBackdrop from "@/components/profile/GradientBackdrop";
import HeaderActions from "@/components/profile/HeaderActions";
import ProfileCard from "@/components/profile/ProfileCard";
import BadgesRow from "@/components/profile/BadgesRow";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";
import Milestones from "@/components/profile/Milestones";
import CommunityStats from "@/components/profile/CommunityStats";
import MoreTalkies from "@/components/profile/MoreTalkies";


import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useEffect } from "react";


export default function MyProfilePage() {
  const { profileStore, uiStore, aiBotStore } = useRootStore();
  const profile = useStoreData(profileStore, (store) => store.myProfile);
  const aiAgents = useStoreData(aiBotStore, (store) => store.myBots);

  const badges = useStoreData(profileStore, (store) => store.badges);
  const talkies = useStoreData(profileStore, (store) => store.talkies);
  const milestones = useStoreData(profileStore, (store) => store.milestones);
  const isDialogOpen = useStoreData(uiStore, (store) => store.isEditProfileDialogOpen);
  const moreTalkies = talkies.slice(3);

  useEffect(() => {
    void profileStore.fetchMyProfile();
    void aiBotStore.fetchMyAiBots();
  }, [profileStore]);


  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <EditProfileDialog
          open={isDialogOpen}
          profile={profile}
          onClose={() => uiStore.closeEditProfileDialog()}
          onSave={(updated) => console.log(updated)}
        />

        <GradientBackdrop />

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <HeaderActions onEdit={() => uiStore.openEditProfileDialog()} />
            <ProfileCard profile={profile} genderLabel={'Male'} />
          </header>

          <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <AiAgentsTimeline items={aiAgents} />
            </div>

            <aside className="space-y-6">
              <CommunityStats />
            </aside>
          </section>
        </div>
      </div>
    </AppShell>
  );
}