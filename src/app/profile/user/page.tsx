"use client";


import AppShell from "@/components/AppShell";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";


import GradientBackdrop from "@/components/user/GradientBackdrop";
import HeaderBar from "@/components/user/HeaderBar";
import UserHero from "@/components/user/UserHero";
import SectionHeader from "@/components/user/SectionHeader";
import TalkieGrid from "@/components/user/TalkieGrid";


import { badges, talkies } from "@/helpers/data/user";


export default function UserProfilePage() {
  const { routes } = useAuthRoutes();


  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />


        <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14">
          <header className="space-y-8">
            <HeaderBar />
            <UserHero
              name="Keyser Soze"
              intro="One of my favorite movies is the “Usual Suspects” (1995) from where I picked up the name Keyser Soze."
              location="Somewhere in the shadows"
              avatar="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80"
              badges={badges}
              messageHref={routes.adminChat}
            />
          </header>


          <section className="mt-12 space-y-6">
            <SectionHeader title="Talkie List" subtitle="Where the stories stay safe and the signal stays clear." actionLabel="View archive" />
            <TalkieGrid items={talkies} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}