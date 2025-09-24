"use client";


import Link from "next/link";
import AppShell from "@/components/AppShell";
import { useAuthRoutes } from "@/helpers/hooks/useAuthRoutes";


import GradientBackdrop from "@/components/ai-agent/GradientBackdrop";
import HeaderCard from "@/components/ai-agent/HeaderCard";
import StatChips from "@/components/ai-agent/StatChips";
import { PrimaryCTAs } from "@/components/ai-agent/ActionButtons";
import Introduction from "@/components/ai-agent/Introduction";
import SignatureMoves from "@/components/ai-agent/SignatureMoves";
import OpeningsList from "@/components/ai-agent/OpeningsList";
import HighlightsSidebar from "@/components/ai-agent/HighlightsSidebar";


import { openings } from "@/helpers/data/ai-agent";
import { highlights } from "@/helpers/data/ai-agent";


export default function AiAgentProfilePage() {
  const { routes } = useAuthRoutes();

  return (
    <AppShell>
      <div className="relative min-h-screen bg-neutral-950 text-white overflow-y-auto">
        <GradientBackdrop />


        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-4 pb-16 pt-16">
          {/* Top card */}
          <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5/50 p-8 backdrop-blur">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <HeaderCard />
              <div className="flex items-center gap-3 self-start md:self-center">
                <Link href={routes.home} className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">Discover more</Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/10">Share</button>
              </div>
            </div>


            <StatChips />
            <PrimaryCTAs chatHref={routes.adminChat} />
          </div>


          {/* Main grid */}
          <section className="grid gap-6 md:grid-cols-[1.3fr,1fr]">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-neutral-900/60 p-8">
              <Introduction />
              <SignatureMoves />
              <OpeningsList openings={openings} />
            </div>


            <HighlightsSidebar highlights={highlights} />
          </section>
        </div>
      </div>
    </AppShell>
  );
}