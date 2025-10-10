// components/ai-agent-create/CreateAiAgentView.tsx
"use client";

import Link from "next/link";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

import GradientBackdrop from "@/components/ai-agent-create/GradientBackdrop";
import Stepper from "@/components/ai-agent-create/Stepper";
import IdentityStep from "@/components/ai-agent-create/IdentityStep";
import FocusStep from "@/components/ai-agent-create/FocusStep";
import VoiceStoryStep from "@/components/ai-agent-create/VoiceStoryStep";
import MediaKitStep from "@/components/ai-agent-create/MediaKitStep";
import PreviewSidebar from "@/components/ai-agent-create/PreviewSidebar";
import ActionBar from "@/components/ai-agent-create/ActionBar";
import type { ChangeEvent } from "react";
import type { CreateAiAgentFormState, GalleryItem } from "@/helpers/types/agent-create";

type Props = {
  // data/state
  step: number;
  form: CreateAiAgentFormState;
  avatarPreview: string | null;
  gallery: GalleryItem[];
  completed: boolean;
  currentStepComplete: boolean;
  isSubmitting: boolean;
  creationError: string | null;
  createdBot: { _id: string } | null;
  steps: { title: string; description: string }[];
  maxGalleryItems: number;

  // utils
  getAiProfile: (id: string) => string;
  t: (key: string, fallback: string) => string;

  // handlers
  handleAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleGalleryChange: (e: ChangeEvent<HTMLInputElement>) => void;
  removeGalleryItem: (id: string) => void;
  resetFlow: () => void;
  handleChange: <K extends keyof CreateAiAgentFormState>(field: K, value: CreateAiAgentFormState[K]) => void;
  goNext: () => void;
  goPrev: () => void;
};

export default function CreateAiAgentView({
  step, form, avatarPreview, gallery, completed, currentStepComplete, isSubmitting,
  creationError, createdBot, steps, maxGalleryItems,
  getAiProfile, t,
  handleAvatarChange, handleGalleryChange, removeGalleryItem, resetFlow, handleChange, goNext, goPrev,
}: Props) {
  return (
    <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
      <GradientBackdrop />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 lg:flex-row lg:gap-12 pb-32 md:pb-20 pt-4 md:pt-14">
        <div className="flex w-full flex-col gap-6 lg:w-[60%]">
          <header className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70">
              <Sparkles className="size-3.5 text-violet-300" />
              {t("admin.create.badge", "Build your agent")}
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {t("admin.create.title", "Create a new aiAgent")}
            </h1>
            <p className="max-w-2xl text-sm text-white/70">
              {t(
                "admin.create.subtitle",
                "Craft the personality, story, and visuals your companion will carry into every conversation. Move through each stage to launch a polished profile.",
              )}
            </p>
          </header>

          {creationError && (
            <div className="flex items-center gap-3 rounded-3xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <AlertCircle className="size-5" />
              <span>{creationError}</span>
            </div>
          )}

          {completed && (
            <div className="flex flex-col gap-2 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5" />
                <span>
                  {t(
                    "admin.create.success.message",
                    "Your AI agent is live! You can revisit any step or publish when you’re set.",
                  )}
                </span>
              </div>
              {createdBot && (
                <Link
                  href={getAiProfile(createdBot._id)}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 underline hover:text-emerald-50"
                >
                  {t("admin.create.success.viewProfile", "View profile")}
                </Link>
              )}
            </div>
          )}

          <Stepper steps={steps} current={step} />

          <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-[0_30px_80px_-50px_rgba(79,70,229,0.6)]">
            {step === 0 && (
              <IdentityStep
                form={{ firstName: form.firstName, lastName: form.lastName, profession: form.profession }}
                avatarPreview={avatarPreview}
                onAvatarChange={handleAvatarChange}
                onChange={handleChange}
              />
            )}

            {step === 1 && (
              <FocusStep form={{ categories: form.categories, usefulness: form.usefulness }} onChange={handleChange} />
            )}

            {step === 2 && (
              <VoiceStoryStep
                form={{ prompt: form.prompt, description: form.description, intro: form.intro }}
                onChange={handleChange}
              />
            )}

            {step === 3 && (
              <MediaKitStep
                gallery={gallery}
                maxItems={maxGalleryItems}
                onAdd={handleGalleryChange}
                onRemove={removeGalleryItem}
              />
            )}
          </div>

          <ActionBar
            canBack={step > 0}
            canNext={currentStepComplete}
            onBack={goPrev}
            onReset={resetFlow}
            onNext={goNext}
            isFinal={step === steps.length - 1}
            isLoading={isSubmitting}
          />
        </div>

        <PreviewSidebar form={form} avatarPreview={avatarPreview} gallery={gallery} maxItems={maxGalleryItems} />
      </div>
    </div>
  );
}
