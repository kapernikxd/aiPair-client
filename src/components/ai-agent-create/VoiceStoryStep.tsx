"use client";

import { FormState } from "../../helpers/types/agent-create";


export default function VoiceStoryStep({
  form,
  onChange,
}: {
  form: Pick<FormState, "prompt" | "description" | "intro">;
  onChange: (field: keyof FormState, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Shape how it thinks</h2>
        <p className="mt-2 text-sm text-white/70">
          Describe the tone, goals, and behaviour. These details guide the conversations the agent will have.
        </p>
      </div>

      <div className="space-y-6">
        <label className="flex flex-col gap-2 text-sm text-white/70">
          System prompt
          <textarea
            value={form.prompt}
            onChange={(e) => onChange("prompt", e.target.value)}
            rows={5}
            placeholder="You are a strategic confidant who helps people reframe their challenges with empathy..."
            className="min-h-[140px] rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-white/70">
          Description
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            placeholder="Summarise the agent in a few evocative sentences that will appear on the profile."
            className="rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-white/70">
          Intro message
          <textarea
            value={form.intro}
            onChange={(e) => onChange("intro", e.target.value)}
            rows={3}
            placeholder="How does the first hello sound? Set the scene in one paragraph."
            className="rounded-3xl border border-white/10 bg-neutral-900/80 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
