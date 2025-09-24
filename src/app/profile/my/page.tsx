"use client";


import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import EditProfileDialog from "@/components/profile/edit/EditProfileDialog";


import GradientBackdrop from "@/components/profile/GradientBackdrop";
import HeaderActions from "@/components/profile/HeaderActions";
import ProfileCard from "@/components/profile/ProfileCard";
import BadgesRow from "@/components/profile/BadgesRow";
import TalkieTimeline from "@/components/profile/TalkieTimeline";
import Milestones from "@/components/profile/Milestones";
import CommunityStats from "@/components/profile/CommunityStats";
import MoreTalkies from "@/components/profile/MoreTalkies";


import { badges, talkies, milestones, initialProfile, genderLabels } from "@/helpers/data/profile";


export default function MyProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const genderLabel = useMemo(() => genderLabels[profile.gender] ?? profile.gender, [profile.gender]);


  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <EditProfileDialog open={isDialogOpen} profile={profile} onClose={() => setIsDialogOpen(false)} onSave={setProfile} />


        <GradientBackdrop />


        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <HeaderActions onEdit={() => setIsDialogOpen(true)} />
            <ProfileCard profile={profile} genderLabel={genderLabel} />
            <BadgesRow badges={badges} />
          </header>


          <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <TalkieTimeline items={talkies} />
              <Milestones items={milestones} />
            </div>


            <aside className="space-y-6">
              <CommunityStats />
              <MoreTalkies items={talkies.slice(3)} />
            </aside>
          </section>
        </div>
      </div>
    </AppShell>
  );
}