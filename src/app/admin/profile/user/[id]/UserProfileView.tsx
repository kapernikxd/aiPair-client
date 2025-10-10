// components/user/UserProfileView.tsx
"use client";

import HeaderBar from "@/components/user/HeaderBar";
import AiAgentsTimeline from "@/components/profile/AiAgentsTimeline";
import ProfileCard from "@/components/profile/ProfileCard";
import { AiBotDTO, ProfileDTO } from "@/helpers/types";

type Props = {
  // data
  profile: ProfileDTO;
  genderLabel: string;
  userAiBots: AiBotDTO[];

  // flags
  isLoadingAiBot: boolean;
  isLoadingProfile: boolean;
  isFollowing?: boolean;
  isUpdatingFollow: boolean;
  isViewingOwnProfile: boolean;
  profileUserId?: string;

  // i18n
  t: (key: string, fallback: string) => string;

  // handlers
  handleToggleFollow: () => Promise<void>;
};

export default function UserProfileView({
  profile,
  genderLabel,
  userAiBots,
  isLoadingAiBot,
  isLoadingProfile,
  isFollowing,
  isUpdatingFollow,
  isViewingOwnProfile,
  profileUserId,
  handleToggleFollow,
  t,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-32 md:pb-20 pt-4 md:pt-14">
      <header className="space-y-8">
        <HeaderBar
          isFollowing={isFollowing}
          isBusy={isUpdatingFollow}
          onToggleFollow={handleToggleFollow}
          disableFollowAction={!profileUserId}
          isCurrentUser={isViewingOwnProfile}
          profileId={profileUserId}
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
          title={t("admin.profile.user.timeline.title", "AI Companions")}
          description={t(
            "admin.profile.user.timeline.description",
            "Персональные напарники, созданные этим пользователем.",
          )}
          emptyMessage={t(
            "admin.profile.user.timeline.empty",
            "Пока что здесь пусто — добавьте своего первого AI-бота, чтобы показать его миру.",
          )}
        />
        {isLoadingProfile && (
          <p className="text-sm text-white/60">
            {t("admin.profile.user.loading", "Loading profile…")}
          </p>
        )}
      </section>
    </div>
  );
}
