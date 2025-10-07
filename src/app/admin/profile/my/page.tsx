"use client";

import AppShell from "@/components/AppShell";
import EditProfileDialog from "@/components/profile/edit/EditProfileDialog";
import GradientBackdrop from "@/components/profile/GradientBackdrop";
import HeaderActions from "@/components/profile/HeaderActions";
import ProfileCard from "@/components/profile/ProfileCard";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";

import { useEffect, useMemo, useState } from "react";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { useTranslations } from "@/localization/TranslationProvider";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";


export default function MyProfilePage() {
  const { profileStore, uiStore, aiBotStore } = useRootStore();
  const profile = useStoreData(profileStore, (store) => store.myProfile);
  const genderLabels = useStoreData(profileStore, (store) => store.genderLabels);
  const aiAgents = useStoreData(aiBotStore, (store) => store.myBots);
  const subscribedAiAgents = useStoreData(aiBotStore, (store) => store.subscribedBots);

  const isDialogOpen = useStoreData(uiStore, (store) => store.isEditProfileDialogOpen);

  const [activeFilter, setActiveFilter] = useState<"my" | "subscribed">("my");
  const { t } = useTranslations();
  const { getProfile } = useAuthRoutes();

  const shareHref = profile?._id ? getProfile(profile._id) : undefined;

  useEffect(() => {
    void profileStore.fetchMyProfile();
    void aiBotStore.fetchMyAiBots();
    void aiBotStore.fetchSubscribedAiBots();
  }, [profileStore, aiBotStore]);

  const filters = useMemo(
    () => [
      { value: "my" as const, label: t("admin.profile.my.filters.my", "My AI Agents") },
      {
        value: "subscribed" as const,
        label: t("admin.profile.my.filters.subscribed", "Subscribed AI Agents"),
      },
    ],
    [t],
  );

  const timelineCopy =
    activeFilter === "my"
      ? {
          title: t("admin.profile.my.timeline.my.title", "My AI Agents"),
          description: t(
            "admin.profile.my.timeline.my.description",
            "Here are the AI agents you have created.",
          ),
          empty: t(
            "admin.profile.my.timeline.my.empty",
            "You haven’t created any AI agents yet.",
          ),
        }
      : {
          title: t("admin.profile.my.timeline.subscribed.title", "Subscribed AI Agents"),
          description: t(
            "admin.profile.my.timeline.subscribed.description",
            "AI agents you follow will appear here.",
          ),
          empty: t(
            "admin.profile.my.timeline.subscribed.empty",
            "You aren’t subscribed to any AI agents yet.",
          ),
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

        <div className="mx-auto w-full max-w-5xl px-4 pb-32 md:pb-20 pt-4 md:pt-14">
          <header className="space-y-8">
            <HeaderActions
              onEdit={() => uiStore.openEditProfileDialog()}
              shareHref={shareHref}
            />
            <ProfileCard
              profile={profile}
              genderLabel={
                profile?.gender
                  ? genderLabels[profile.gender] ?? profile.gender
                  : t("admin.profile.common.genderUnknown", "Not specified")
              }
              isCurrentUser
            />
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
              <section className="rounded-3xl border border-white/10 bg-white/5 p-1 md:p-6 backdrop-blur">
                <div className="p-3 md:p-0">
                  <h2 className="text-lg font-semibold text-white">
                    {t("admin.profile.my.sidebar.title", "Filter AI Agents")}
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    {t(
                      "admin.profile.my.sidebar.description",
                      "Choose whether to see your own creations or the agents you’re subscribed to.",
                    )}
                  </p>
                </div>
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