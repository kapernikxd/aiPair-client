"use client";

import AppShell from "@/components/AppShell";
import EditProfileDialog from "@/components/profile/edit/EditProfileDialog";
import GradientBackdrop from "@/components/profile/GradientBackdrop";
import HeaderActions from "@/components/profile/HeaderActions";
import ProfileCard from "@/components/profile/ProfileCard";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useEffect, useState } from "react";


export default function MyProfilePage() {
  const { profileStore, uiStore, aiBotStore } = useRootStore();
  const profile = useStoreData(profileStore, (store) => store.myProfile);
  const aiAgents = useStoreData(aiBotStore, (store) => store.myBots);
  const subscribedAiAgents = useStoreData(aiBotStore, (store) => store.subscribedBots);

  const isDialogOpen = useStoreData(uiStore, (store) => store.isEditProfileDialogOpen);

  const [activeFilter, setActiveFilter] = useState<"my" | "subscribed">("my");

  useEffect(() => {
    void profileStore.fetchMyProfile();
    void aiBotStore.fetchMyAiBots();
    void aiBotStore.fetchSubscribedAiBots();
  }, [profileStore, aiBotStore]);

  const filters = [
    { value: "my" as const, label: "My AI Agents" },
    { value: "subscribed" as const, label: "Subscribed AI Agents" },
  ];

  const timelineCopy =
    activeFilter === "my"
      ? {
          title: "My AI Agents",
          description: "Here are the AI agents you have created.",
          empty: "You haven't created any AI agents yet.",
        }
      : {
          title: "Subscribed AI Agents",
          description: "AI agents you follow will appear here.",
          empty: "You aren't subscribed to any AI agents yet.",
        };

  const filteredAiAgents = activeFilter === "my" ? aiAgents : subscribedAiAgents;


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
              <AiAgentsTimeline
                items={filteredAiAgents}
                title={timelineCopy.title}
                description={timelineCopy.description}
                emptyMessage={timelineCopy.empty}
              />
            </div>

            <aside className="space-y-6">
              <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <h2 className="text-lg font-semibold text-white">Filter AI Agents</h2>
                <p className="mt-2 text-sm text-white/70">
                  Choose whether to see your own creations or the agents you're subscribed to.
                </p>
                <div className="mt-4 grid gap-3">
                  {filters.map((filter) => {
                    const isActive = activeFilter === filter.value;
                    return (
                      <button
                        key={filter.value}
                        type="button"
                        onClick={() => setActiveFilter(filter.value)}
                        className={`w-full rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                          isActive
                            ? "bg-white text-neutral-900 shadow-[0_0_0_1px_rgba(255,255,255,0.35)]"
                            : "bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {filter.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>
          </section>
        </div>
      </div>
    </AppShell>
  );
}