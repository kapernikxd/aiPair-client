'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import AppShell from '@/components/AppShell';

import GradientBackdrop from '@/components/ai-agent-create/GradientBackdrop';
import Stepper from '@/components/ai-agent-create/Stepper';
import IdentityStep from '@/components/ai-agent-create/IdentityStep';
import FocusStep from '@/components/ai-agent-create/FocusStep';
import VoiceStoryStep from '@/components/ai-agent-create/VoiceStoryStep';
import MediaKitStep from '@/components/ai-agent-create/MediaKitStep';
import PreviewSidebar from '@/components/ai-agent-create/PreviewSidebar';
import ActionBar from '@/components/ai-agent-create/ActionBar';

import { FormState } from '@/helpers/types/agent-create';
import { useRootStore, useStoreData } from '@/stores/StoreProvider';
import { useAuthRoutes } from '@/helpers/hooks/useAuthRoutes';
import { useTranslations } from '@/localization/TranslationProvider';


export default function CreateAiAgentPage() {
  const { aiBotStore } = useRootStore();
  const { getAiProfile } = useAuthRoutes();
  const { t } = useTranslations();
  const step = useStoreData(aiBotStore, (store) => store.step);
  const form = useStoreData(aiBotStore, (store) => store.form);
  const avatarPreview = useStoreData(aiBotStore, (store) => store.avatarPreview);
  const gallery = useStoreData(aiBotStore, (store) => store.gallery);
  const completed = useStoreData(aiBotStore, (store) => store.completed);
  const currentStepComplete = useStoreData(aiBotStore, (store) => store.currentStepComplete);
  const isSubmitting = useStoreData(aiBotStore, (store) => store.isSubmitting);
  const creationError = useStoreData(aiBotStore, (store) => store.creationError);
  const createdBot = useStoreData(aiBotStore, (store) => store.createdBot);
  const steps = aiBotStore.steps;
  const maxGalleryItems = aiBotStore.maxGalleryItems;

  const translatedSteps = useMemo(() => {
    const stepKeys = ["identity", "focus", "voice", "media"] as const;
    return steps.map((currentStep, index) => {
      const key = stepKeys[index] ?? `step${index}`;
      return {
        ...currentStep,
        title: t(`admin.create.steps.${key}.title`, currentStep.title),
        description: t(`admin.create.steps.${key}.description`, currentStep.description),
      };
    });
  }, [steps, t]);

  useEffect(() => () => aiBotStore.dispose(), [aiBotStore]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    void aiBotStore.setAvatar(file);
    event.currentTarget.value = '';
  };

  const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    void aiBotStore.addGalleryItems(files);
    event.currentTarget.value = '';
  };

  const removeGalleryItem = (id: string) => {
    aiBotStore.removeGalleryItem(id);
  };

  const resetFlow = () => {
    aiBotStore.resetFlow();
  };

  const handleChange = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    aiBotStore.setFormField(field, value);
  };

  const goNext = () => {
    if (step === steps.length - 1) {
      void aiBotStore.submitCreation();
      return;
    }
    aiBotStore.goNext();
  };

  const goPrev = () => {
    aiBotStore.goPrev();
  };

  return (
    <AppShell>
      <div className="relative min-h-screen overflow-y-auto bg-neutral-950 text-white">
        <GradientBackdrop />

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 lg:flex-row lg:gap-12 pb-32 md:pb-20 pt-4 md:pt-14">
          <div className="flex w-full flex-col gap-6 lg:w-[60%]">
            <header className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/70">
                <Sparkles className="size-3.5 text-violet-300" />
                {t('admin.create.badge', 'Build your agent')}
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {t('admin.create.title', 'Create a new aiAgent')}
              </h1>
              <p className="max-w-2xl text-sm text-white/70">
                {t(
                  'admin.create.subtitle',
                  'Craft the personality, story, and visuals your companion will carry into every conversation. Move through each stage to launch a polished profile.',
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
                      'admin.create.success.message',
                      'Your AI agent is live! You can revisit any step or publish when you’re set.',
                    )}
                  </span>
                </div>
                {createdBot && (
                  <Link
                    href={getAiProfile(createdBot._id)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-100 underline hover:text-emerald-50"
                  >
                    {t('admin.create.success.viewProfile', 'View profile')}
                  </Link>
                )}
              </div>
            )}

            <Stepper steps={translatedSteps} current={step} />

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
