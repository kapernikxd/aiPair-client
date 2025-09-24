"use client";


import AppShell from "@/components/AppShell";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";


import GradientBackdrop from "@/components/user/GradientBackdrop";
import HeaderBar from "@/components/user/HeaderBar";
import UserHero from "@/components/user/UserHero";
import SectionHeader from "@/components/user/SectionHeader";
import TalkieGrid from "@/components/user/TalkieGrid";


import { useRootStore, useStoreData } from "@/stores/StoreProvider";


export default function UserProfilePage() {
  const { routes } = useAuthRoutes();
  const { profileStore } = useRootStore();
  const userProfile = useStoreData(profileStore, (store) => store.userProfile);


  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <HeaderBar />
            <UserHero
              name={userProfile.name}
              intro={userProfile.intro}
              location={userProfile.location}
              avatar={userProfile.avatar}
              badges={userProfile.badges}
              messageHref={routes.adminChat}
            />
          </header>

          <section className="mt-12 space-y-6">
            <SectionHeader title="Talkie List" subtitle="Where the stories stay safe and the signal stays clear." actionLabel="View archive" />
            <TalkieGrid items={userProfile.talkies} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}