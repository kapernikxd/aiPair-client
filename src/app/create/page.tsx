'use client';

import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import AppShell from '@/components/AppShell';
import { CheckCircle2, Sparkles } from 'lucide-react';

import GradientBackdrop from '@/components/ai-agent-create/GradientBackdrop';
import Stepper from '@/components/ai-agent-create/Stepper';
import IdentityStep from '@/components/ai-agent-create/IdentityStep';
import VoiceStoryStep from '@/components/ai-agent-create/VoiceStoryStep';
import MediaKitStep from '@/components/ai-agent-create/MediaKitStep';
import PreviewSidebar from '@/components/ai-agent-create/PreviewSidebar';
import ActionBar from '@/components/ai-agent-create/ActionBar';

import { FormState, GalleryItem } from '@/helpers/types/agent-create';
import { MAX_GALLERY_ITEMS, steps } from '@/helpers/data/agent-create';
import { revokeGallery, revokeIfNeeded } from '@/helpers/utils/agent-create';


export default function CreateAiAgentPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    prompt: '',
    description: '',
    intro: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(false);
  }, [step]);

  useEffect(() => {
    return () => {
      revokeIfNeeded(avatarPreview);
      revokeGallery(gallery);
    };
  }, [avatarPreview, gallery]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatar(file);
    setAvatarPreview((prev) => {
      revokeIfNeeded(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setGallery((prev) => {
      const remaining = Math.max(0, MAX_GALLERY_ITEMS - prev.length);
      const allowed = files.slice(0, remaining);
      const mapped = allowed.map((file, index) => ({
        id: `${file.name}-${Date.now()}-${index}`,
        preview: URL.createObjectURL(file),
        file,
      }));
      return [...prev, ...mapped];
    });
    event.currentTarget.value = '';
  };

  const removeGalleryItem = (id: string) => {
    setGallery((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const resetFlow = () => {
    setForm({ firstName: '', lastName: '', prompt: '', description: '', intro: '' });
    setAvatar(null);
    revokeGallery(gallery);
    setGallery([]);
    setAvatarPreview((prev) => {
      revokeIfNeeded(prev);
      return null;
    });
    setStep(0);
    setCompleted(false);
  };

  const handleChange = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const currentStepComplete = useMemo(() => {
    if (step === 0) return Boolean(form.firstName.trim() && form.lastName.trim() && (avatar || avatarPreview));
    if (step === 1) return Boolean(form.prompt.trim() && form.description.trim() && form.intro.trim());
    return gallery.length > 0;
  }, [step, form, avatar, avatarPreview, gallery]);

  const goNext = () => {
    if (!currentStepComplete) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
    else setCompleted(true);
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

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
                <span>Your draft is ready! Feel free to revisit any step or publish when you're set.</span>
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
                  maxItems={MAX_GALLERY_ITEMS}
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
            maxItems={MAX_GALLERY_ITEMS}
          />
        </div>
      </div>
    </AppShell>
  );
}
