// components/ai-agent/edit/EditAiAgentDialogView.tsx
"use client";

import type { KeyboardEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import HeroRow from "@/components/profile/edit/overview/HeroRow";
import { Button } from "@/components/ui/Button";
import { Spacer } from "@/components/ui/Spacer";
import { categoryOptions } from "@/helpers/data/agent-create";
import { EditAiAgentFormState } from "@/helpers/hooks/aiAgent/useEditAiAgentDialog";

const fieldLabelClasses =
  "flex items-center justify-between text-xs font-medium uppercase tracking-wide text-neutral-400";
const inputClasses =
  "w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none";

type ViewProps = {
  // form state
  formState: {
    name: string; lastname: string; profession: string; userBio: string;
    aiPrompt: string; intro: string; categories: string[]; usefulness: string[];
  };
  setFormState: React.Dispatch<React.SetStateAction<EditAiAgentFormState>>;

  usefulnessInput: string;
  setUsefulnessInput: (v: string) => void;

  avatarFile: File | null;
  avatarPreview: string | null;
  isSubmitting: boolean;

  // store-derived ui
  botPhotos: string[];
  photosUpdating: boolean;
  maxGalleryItems: number;

  // computed
  charCounters: { name: string; lastname: string; profession: string; userBio: string };
  selectedCategories: Set<string>;
  remainingGallerySlots: number;
  canUploadPhotos: boolean;

  // handlers
  handleAvatarSelect: (file: File) => void;
  handleAvatarRemove: () => void;
  toggleCategory: (category: string) => void;
  handleAddUsefulness: () => void;
  handleRemoveUsefulness: (value: string) => void;
  handleUsefulnessKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  handleGalleryUpload: React.ChangeEventHandler<HTMLInputElement>;
  handleRemovePhoto: (url: string) => void;
};

export default function EditAiAgentDialogView(props: ViewProps) {
  const {
    formState, setFormState,
    usefulnessInput, setUsefulnessInput,
    avatarFile, avatarPreview,
    botPhotos, photosUpdating, maxGalleryItems,
    charCounters, selectedCategories, remainingGallerySlots, canUploadPhotos,
    handleAvatarSelect, handleAvatarRemove,
    toggleCategory, handleAddUsefulness, handleRemoveUsefulness,
    handleUsefulnessKeyDown, handleGalleryUpload, handleRemovePhoto,
  } = props;

  return (
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Identity</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <div className={fieldLabelClasses}>
              <span>Agent Name</span>
              <span>{charCounters.name}/24</span>
            </div>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value.slice(0, 24) }))}
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
              onChange={(e) => setFormState((p) => ({ ...p, lastname: e.target.value.slice(0, 24) }))}
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
            onChange={(e) => setFormState((p) => ({ ...p, profession: e.target.value.slice(0, 24) }))}
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
            onChange={(e) => setFormState((p) => ({ ...p, userBio: e.target.value.slice(0, 160) }))}
            placeholder="Describe your agent’s personality, mission, or mood."
            maxLength={160}
            rows={4}
            className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Focus</h3>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Categories</span>
            <span className="text-xs uppercase tracking-wide text-white/50">Pick multiple</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const key = category.trim().toLowerCase();
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
              onChange={(e) => props.setUsefulnessInput(e.target.value)}
              onKeyDown={handleUsefulnessKeyDown}
              placeholder="Например: Быстрые брейнштормы"
              className="flex-1 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-violet-400 focus:outline-none"
            />
            <Button type="button" variant="primaryTight" onClick={handleAddUsefulness} disabled={!usefulnessInput.trim()}>
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
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Voice &amp; Story</h3>

        <label className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">System prompt</span>
          <textarea
            value={formState.aiPrompt}
            onChange={(e) => setFormState((p) => ({ ...p, aiPrompt: e.target.value }))}
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
            onChange={(e) => setFormState((p) => ({ ...p, intro: e.target.value }))}
            rows={3}
            placeholder="How does the first hello sound? Set the scene in one paragraph."
            className="rounded-3xl w-full border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:border-white/40 focus:outline-none"
          />
        </label>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">Media kit</h3>

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
          {photosUpdating && <p className="mt-4 text-xs text-white/50">Processing gallery updates…</p>}
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
    </div>
  );
}
