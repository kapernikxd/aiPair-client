"use client";

import AppShell from "@/components/AppShell";
import CreateAiAgentView from "./CreateAiAgentView";
import { useCreateAiAgentPage } from "@/helpers/hooks/aiAgent/useCreateAiAgentPage";

export default function CreateAiAgentPage() {
  const vm = useCreateAiAgentPage();
  return (
    <AppShell>
      <CreateAiAgentView {...vm} />
    </AppShell>
  );
}