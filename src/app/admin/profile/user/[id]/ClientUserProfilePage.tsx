// app/.../UserProfilePage.tsx
"use client";

import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/user/GradientBackdrop";
import UserProfileView from "./UserProfileView";
import { useUserProfilePage } from "@/helpers/hooks/profile/useUserProfilePage";

interface UserProfilePageProps {
  profileId?: string;
}

export default function UserProfilePage({ profileId }: UserProfilePageProps) {
  const vm = useUserProfilePage(profileId);

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />
        <UserProfileView {...vm} />
      </div>
    </AppShell>
  );
}
