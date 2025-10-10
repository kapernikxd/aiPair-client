// app/.../MyProfilePage.tsx
"use client";

import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/profile/GradientBackdrop";
import MyProfileView from "./MyProfileView";
import { useMyProfilePage } from "@/helpers/hooks/myProfile/useMyProfilePage";

export default function MyProfilePage() {
  const vm = useMyProfilePage();

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />
        <MyProfileView {...vm} />
      </div>
    </AppShell>
  );
}
