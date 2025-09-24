'use client';

import type { ChangeEvent } from 'react';
import { useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { CheckCircle2, Sparkles } from 'lucide-react';

import GradientBackdrop from '@/components/ai-agent-create/GradientBackdrop';
import Stepper from '@/components/ai-agent-create/Stepper';
import IdentityStep from '@/components/ai-agent-create/IdentityStep';
import VoiceStoryStep from '@/components/ai-agent-create/VoiceStoryStep';
import MediaKitStep from '@/components/ai-agent-create/MediaKitStep';
import PreviewSidebar from '@/components/ai-agent-create/PreviewSidebar';
import ActionBar from '@/components/ai-agent-create/ActionBar';

import { FormState } from '@/helpers/types/agent-create';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';


export default function CreateAiAgentPage() {
  const { aiBotStore } = useRootStore();
  const step = useStoreData(aiBotStore, (store) => store.step);
  const form = useStoreData(aiBotStore, (store) => store.form);
  const avatarPreview = useStoreData(aiBotStore, (store) => store.avatarPreview);
  const gallery = useStoreData(aiBotStore, (store) => store.gallery);
  const completed = useStoreData(aiBotStore, (store) => store.completed);
  const currentStepComplete = useStoreData(aiBotStore, (store) => store.currentStepComplete);
  const steps = aiBotStore.steps;
  const maxGalleryItems = aiBotStore.maxGalleryItems;

  useEffect(() => () => aiBotStore.dispose(), [aiBotStore]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    aiBotStore.setAvatar(file);
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    aiBotStore.addGalleryItems(files);
    event.currentTarget.value = '';
  };

  const removeGalleryItem = (id: string) => {
    aiBotStore.removeGalleryItem(id);
  };

  const resetFlow = () => {
    aiBotStore.resetFlow();
  };

  const handleChange = (field: keyof FormState, value: string) => {
    aiBotStore.setFormField(field, value);
  };

  const goNext = () => {
    aiBotStore.goNext();
  };

  const goPrev = () => {
    aiBotStore.goPrev();
  };

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-24 pt-12 lg:flex-row lg:gap-12">
          <div className="flex w-full flex-col gap-6 lg:w-[60%]">
            <header className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                <Sparkles className="size-3.5 text-violet-300" />
                Build your agent
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Create a new aiAgent</h1>
              <p className="max-w-2xl text-sm text-white/70">
                Craft the personality, story, and visuals your companion will carry into every conversation. Move through each stage to launch a polished profile.
              </p>
            </header>

            {completed && (
              <div className="flex items-center gap-3 rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="size-5" />
                <span>Your draft is ready! Feel free to revisit any step or publish when you&rsquo;re set.</span>
              </div>
            )}

            <Stepper steps={steps} current={step} />

            <div className="rounded-3xl border border-white/10 bg-neutral-900/80 p-6 shadow-[0_30px_80px_-50px_rgba(79,70,229,0.6)]">
              {step === 0 && (
                <IdentityStep
                  form={{ firstName: form.firstName, lastName: form.lastName }}
                  avatarPreview={avatarPreview}
                  onAvatarChange={handleAvatarChange}
                  onChange={handleChange}
                />
              )}

              {step === 1 && (
                <VoiceStoryStep
                  form={{ prompt: form.prompt, description: form.description, intro: form.intro }}
                  onChange={handleChange}
                />
              )}

              {step === 2 && (
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
            />
          </div>

          <PreviewSidebar
            form={form}
            avatarPreview={avatarPreview}
            gallery={gallery}
            maxItems={maxGalleryItems}
          />
        </div>
      </div>
    </AppShell>
  );
}
