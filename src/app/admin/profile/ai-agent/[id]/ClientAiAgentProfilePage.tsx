"use client";

import AppShell from "@/components/AppShell";
import GradientBackdrop from "@/components/ai-agent/GradientBackdrop";
import { AiAgentProfileView } from "./AiAgentProfileView";
import { useAiAgentProfile } from "@/helpers/hooks/useAiAgentProfile";

interface ClientAiAgentProfilePageProps { aiBotId?: string }

export default function ClientAiAgentProfilePage({ aiBotId }: ClientAiAgentProfilePageProps) {
  const vm = useAiAgentProfile(aiBotId);
  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />
        <AiAgentProfileView {...vm} />
      </div>
    </AppShell>
  );
}