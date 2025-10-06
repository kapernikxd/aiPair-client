"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEventHandler, FormEventHandler, KeyboardEvent } from "react";
import { ImagePlus, X } from "lucide-react";

import ModalShell from "@/components/profile/edit/overview/ModalShell";
import DialogHeader from "@/components/profile/edit/overview/DialogHeader";
import HeroRow from "@/components/profile/edit/overview/HeroRow";
import FormActions from "@/components/profile/edit/overview/FormActions";
import { Button } from "@/components/ui/Button";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import type { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { getUserAvatar } from "@/helpers/utils/user";
import type { AiBotUpdatePayload } from "@/services/profile/ProfileService";
import { categoryOptions } from "@/helpers/data/agent-create";
import { Spacer } from "@/components/ui/Spacer";

const fieldLabelClasses =
  "flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400";
const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none";

interface Props {
  open: boolean;
  aiAgent: AiBotDTO | null;
  onClose: () => void;
}

interface FormState {
  name: string;
  lastname: string;
  profession: string;
  userBio: string;
  aiPrompt: string;
  intro: string;
  categories: string[];
  usefulness: string[];
}

const INITIAL_FORM: FormState = {
  name: "",
  lastname: "",
  profession: "",
  userBio: "",
  aiPrompt: "",
  intro: "",
  categories: [],
  usefulness: [],
};

const normalized = (value: string) => value.trim().toLowerCase();
const arraysEqual = (a: string[], b: string[]) =>
  a.length === b.length && a.every((item, index) => item === b[index]);

export default function EditAiAgentDialog({ open, aiAgent, onClose }: Props) {
  const { aiBotStore } = useRootStore();

  const botDetails = useStoreData(aiBotStore, (store) => store.botDetails);
  const botPhotos = useStoreData(aiBotStore, (store) => store.botPhotos);
  const photosUpdating = useStoreData(aiBotStore, (store) => store.photosUpdating);

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [usefulnessInput, setUsefulnessInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tempUrlRef = useRef<string | null>(null);
  const initialAvatarRef = useRef<string | null>(null);

  const maxGalleryItems = aiBotStore.maxGalleryItems;

  useEffect(() => {
    if (!open || !aiAgent) return;

    const nextFormState: FormState = {
      name: aiAgent.name ?? "",
      lastname: aiAgent.lastname ?? "",
      profession: aiAgent.profession ?? "",
      userBio: aiAgent.userBio ?? "",
      aiPrompt: botDetails?.aiPrompt ?? aiAgent.aiPrompt ?? "",
      intro: botDetails?.intro ?? aiAgent.intro ?? "",
      categories: botDetails?.categories ?? aiAgent.categories ?? [],
      usefulness: botDetails?.usefulness ?? aiAgent.usefulness ?? [],
    };

    setFormState(nextFormState);
    setUsefulnessInput("");
    setAvatarFile(null);

    const avatar = aiAgent.avatarFile ? getUserAvatar(aiAgent) : null;
    initialAvatarRef.current = avatar;
    setAvatarPreview(avatar);

    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current);
      tempUrlRef.current = null;
    }
  }, [open, aiAgent, botDetails]);

  useEffect(() => {
    return () => {
      if (tempUrlRef.current) {
        URL.revokeObjectURL(tempUrlRef.current);
      }
    };
  }, []);

  const handleAvatarSelect = (file: File) => {
    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current);
    }

    const objectUrl = URL.createObjectURL(file);
    tempUrlRef.current = objectUrl;

    setAvatarFile(file);
    setAvatarPreview(objectUrl);
  };

  const handleAvatarRemove = () => {
    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current);
      tempUrlRef.current = null;
    }

    setAvatarFile(null);
    setAvatarPreview(initialAvatarRef.current);
  };

  const toggleCategory = (category: string) => {
    setFormState((prev) => {
      const key = normalized(category);
      const exists = prev.categories.some((item) => normalized(item) === key);
      const nextCategories = exists
        ? prev.categories.filter((item) => normalized(item) !== key)
        : [...prev.categories, category];
      return { ...prev, categories: nextCategories };
    });
  };

  const handleAddUsefulness = () => {
    const value = usefulnessInput.trim();
    if (!value) return;

    setFormState((prev) => {
      const exists = prev.usefulness.some((item) => normalized(item) === normalized(value));
      if (exists) {
        return prev;
      }
      return { ...prev, usefulness: [...prev.usefulness, value] };
    });
    setUsefulnessInput("");
  };

  const handleRemoveUsefulness = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      usefulness: prev.usefulness.filter((item) => item !== value),
    }));
  };

  const handleUsefulnessKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddUsefulness();
    }
  };

  const handleGalleryUpload: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!aiAgent) return;

    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const remaining = Math.max(0, maxGalleryItems - botPhotos.length);
    if (remaining === 0) return;

    const allowed = files.slice(0, remaining);
    const formData = new FormData();
    allowed.forEach((file) => {
      formData.append("photos", file, file.name);
    });

    void aiBotStore.addBotPhotos(aiAgent._id, formData);
    event.currentTarget.value = "";
  };

  const handleRemovePhoto = (url: string) => {
    if (!aiAgent) return;
    void aiBotStore.deleteBotPhotos(aiAgent._id, [url]);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!aiAgent) {
      onClose();
      return;
    }

    const hasAvatarUpdate = Boolean(avatarFile);

    const payload: AiBotUpdatePayload = {};
    const normalizedName = formState.name.trim();
    const normalizedLastName = formState.lastname.trim();
    const normalizedProfession = formState.profession.trim();
    const normalizedBio = formState.userBio.trim();
    const normalizedPrompt = formState.aiPrompt.trim();
    const normalizedIntro = formState.intro.trim();
    const currentPrompt = botDetails?.aiPrompt ?? aiAgent.aiPrompt ?? "";
    const currentIntro = botDetails?.intro ?? aiAgent.intro ?? "";
    const currentCategories = botDetails?.categories ?? aiAgent.categories ?? [];
    const currentUsefulness = botDetails?.usefulness ?? aiAgent.usefulness ?? [];

    if (normalizedName !== (aiAgent.name ?? "")) {
      payload.name = normalizedName;
    }

    if (normalizedLastName !== (aiAgent.lastname ?? "")) {
      payload.lastname = normalizedLastName;
    }

    if (normalizedProfession !== (aiAgent.profession ?? "")) {
      payload.profession = normalizedProfession;
    }

    if (normalizedBio !== (aiAgent.userBio ?? "")) {
      payload.userBio = normalizedBio;
    }

    if (normalizedPrompt !== currentPrompt) {
      payload.aiPrompt = normalizedPrompt;
    }

    if (normalizedIntro !== currentIntro) {
      payload.intro = normalizedIntro;
      payload.introMessage = normalizedIntro;
    }

    if (!arraysEqual(formState.categories, currentCategories)) {
      payload.categories = formState.categories;
    }

    if (!arraysEqual(formState.usefulness, currentUsefulness)) {
      payload.usefulness = formState.usefulness;
    }

    const hasTextUpdates = Object.keys(payload).length > 0;

    if (!hasTextUpdates && !hasAvatarUpdate) {
      onClose();
      return;
    }

    setIsSubmitting(true);
    try {
      await aiBotStore.updateBot(aiAgent._id, payload, avatarFile ?? undefined);
      onClose();
    } catch (error) {
      console.error("Failed to update AI agent", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCounters = useMemo(
    () => ({
      name: formState.name.length.toString().padStart(2, "0"),
      lastname: formState.lastname.length.toString().padStart(2, "0"),
      profession: formState.profession.length.toString().padStart(2, "0"),
      userBio: formState.userBio.length.toString().padStart(3, "0"),
    }),
    [formState]
  );

  const selectedCategories = useMemo(
    () => new Set(formState.categories.map((item) => normalized(item))),
    [formState.categories]
  );

  const remainingGallerySlots = Math.max(0, maxGalleryItems - botPhotos.length);
  const canUploadPhotos = remainingGallerySlots > 0 && !photosUpdating;

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader onClose={onClose} />

        <div className="space-y-8 px-1 md:px-6 pb-6 sm:pb-8">
          <HeroRow
            userName={formState.name || "agent"}
            avatarUrl={avatarPreview}
            onAvatarSelect={handleAvatarSelect}
            onAvatarRemove={handleAvatarRemove}
            canRemoveAvatar={Boolean(avatarFile)}
            description="Refresh your AI agent with updated visuals, identity, and vibe."
          />

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Identity
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <div className={fieldLabelClasses}>
                  <span>Agent Name</span>
                  <span>{charCounters.name}/24</span>
                </div>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, name: event.target.value.slice(0, 24) }))
                  }
                  placeholder="Enter how people will call your agent"
                  maxLength={24}
                  required
                  className={inputClasses}
                />
              </label>

              <label className="space-y-2">
                <div className={fieldLabelClasses}>
                  <span>Agent Surname</span>
                  <span>{charCounters.lastname}/24</span>
                </div>
                <input
                  type="text"
                  value={formState.lastname}
                  onChange={(event) =>
                    setFormState((prev) => ({ ...prev, lastname: event.target.value.slice(0, 24) }))
                  }
                  placeholder="Optional last name or identifier"
                  maxLength={24}
                  required
                  className={inputClasses}
                />
              </label>
            </div>

            <label className="space-y-2">
              <div className={fieldLabelClasses}>
                <span>Profession</span>
                <span>{charCounters.profession}/24</span>
              </div>
              <input
                type="text"
                value={formState.profession}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, profession: event.target.value.slice(0, 24) }))
                }
                placeholder="What role does your agent embody?"
                maxLength={24}
                required
                className={inputClasses}
              />
            </label>
            <Spacer />

            <label className="space-y-2">
              <div className={fieldLabelClasses}>
                <span>Profile Description</span>
                <span>{charCounters.userBio}/160</span>
              </div>
              <textarea
                value={formState.userBio}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, userBio: event.target.value.slice(0, 160) }))
                }
                placeholder="Describe your agent’s personality, mission, or mood."
                maxLength={160}
                rows={4}
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Focus
            </h3>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Categories</span>
                <span className="text-xs uppercase tracking-wide text-white/50">Pick multiple</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((category) => {
                  const key = normalized(category);
                  const isSelected = selectedCategories.has(key);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className={`rounded-2xl border px-4 py-2 text-xs font-medium transition ${
                        isSelected
                          ? "border-violet-400/60 bg-violet-500/20 text-violet-100"
                          : "border-white/15 bg-white/5 text-white/70 hover:border-violet-400/40 hover:bg-violet-500/10"
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
              {!formState.categories.length && (
                <p className="text-xs text-white/50">
                  Select at least one category to highlight the agent&rsquo;s domain.
                </p>
              )}
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">Usefulness</span>
                <span className="text-xs uppercase tracking-wide text-white/50">Add scenarios</span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={usefulnessInput}
                  onChange={(event) => setUsefulnessInput(event.target.value)}
                  onKeyDown={handleUsefulnessKeyDown}
                  placeholder="Например: Быстрые брейнштормы"
                  className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
                />
                <Button
                  type="button"
                  variant="primaryTight"
                  onClick={handleAddUsefulness}
                  disabled={!usefulnessInput.trim()}
                >
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formState.usefulness.length ? (
                  formState.usefulness.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveUsefulness(item)}
                        className="rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
                        aria-label={`Удалить ${item}`}
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-white/50">
                    Добавьте несколько примеров, чтобы подсказать пользователям сценарии использования.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Voice &amp; Story
            </h3>

            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">System prompt</span>
              <textarea
                value={formState.aiPrompt}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, aiPrompt: event.target.value }))
                }
                rows={5}
                placeholder="You are a strategic confidant who helps people reframe their challenges with empathy..."
                required
                className="min-h-[140px] w-full rounded-3xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">Intro message</span>
              <textarea
                value={formState.intro}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, intro: event.target.value }))
                }
                rows={3}
                placeholder="How does the first hello sound? Set the scene in one paragraph."
                className="rounded-3xl w-full border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
              />
            </label>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Media kit
            </h3>

            <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-6 text-center text-sm text-white/70">
              <label
                className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 ${!canUploadPhotos ? "pointer-events-none opacity-50" : ""}`}
              >
                <ImagePlus className="size-6 text-violet-300" />
                <span className="font-medium text-white">Upload gallery</span>
                <span className="text-xs text-white/60">Drop multiple images or pick from your library</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  disabled={!canUploadPhotos}
                  onChange={handleGalleryUpload}
                />
              </label>
              {!canUploadPhotos && remainingGallerySlots === 0 && (
                <p className="mt-4 text-xs text-white/50">
                  You&rsquo;ve reached the {maxGalleryItems}-image limit. Remove an image to upload new ones.
                </p>
              )}
              {photosUpdating && (
                <p className="mt-4 text-xs text-white/50">Processing gallery updates…</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {botPhotos.map((url) => (
                <div key={url} className="group relative overflow-hidden rounded-3xl border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Gallery asset" className="h-40 w-full object-cover" />
                  <div className="absolute right-3 top-3">
                    <Button
                      type="button"
                      onClick={() => handleRemovePhoto(url)}
                      variant="galleryClose"
                      aria-label="Remove image"
                      disabled={photosUpdating}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!botPhotos.length && (
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/60">
                  <p>Add reference images, scenes, or moodboard shots to help visualise your agent.</p>
                </div>
              )}
            </div>
          </section>

          <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
        </div>
      </form>
    </ModalShell>
  );
}
