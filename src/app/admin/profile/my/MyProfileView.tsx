// components/profile/MyProfileView.tsx
"use client";

import EditProfileDialog from "@/components/profile/edit/EditProfileDialog";
import HeaderActions from "@/components/profile/HeaderActions";
import ProfileCard from "@/components/profile/ProfileCard";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";
import { MyProfileDTO, UserDTO } from "@/helpers/types";

type Filter = { value: "my" | "subscribed"; label: string };

type Props = {
  // data
  profile: MyProfileDTO;
  genderLabels: Record<string, string>;
  shareHref?: string;
  filteredAiAgents: UserDTO[];

  // ui state
  isDialogOpen: boolean;
  activeFilter: "my" | "subscribed";
  setActiveFilter: (v: "my" | "subscribed") => void;

  // computed
  filters: Filter[];
  timelineCopy: { title: string; description: string; empty: string };

  // handlers
  openEdit: () => void;
  closeEdit: () => void;

  // i18n
  t: (key: string, fallback: string) => string;
};

export default function MyProfileView({
  profile,
  genderLabels,
  shareHref,
  filteredAiAgents,
  isDialogOpen,
  activeFilter,
  setActiveFilter,
  filters,
  timelineCopy,
  openEdit,
  closeEdit,
  t,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-32 md:pb-20 pt-4 md:pt-14">
      <EditProfileDialog
        open={isDialogOpen}
        profile={profile}
        onClose={closeEdit}
        onSave={(updated) => console.log(updated)}
      />

      <header className="space-y-8">
        <HeaderActions onEdit={openEdit} shareHref={shareHref} />
        <ProfileCard
          profile={profile}
          genderLabel={
            profile?.gender ? (genderLabels[profile.gender] ?? profile.gender)
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
  );
}
