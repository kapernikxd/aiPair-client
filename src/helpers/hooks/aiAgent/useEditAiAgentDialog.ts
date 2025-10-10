// hooks/useEditAiAgentDialog.ts
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { ChangeEventHandler, FormEventHandler, KeyboardEvent } from "react";

import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import type { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { getUserAvatar } from "@/helpers/utils/user";
import type { AiBotUpdatePayload } from "@/services/profile/ProfileService";

export type FormState = {
  name: string;
  lastname: string;
  profession: string;
  userBio: string;
  aiPrompt: string;
  intro: string;
  categories: string[];
  usefulness: string[];
};

export const INITIAL_FORM: FormState = {
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

export function useEditAiAgentDialog(open: boolean, aiAgent: AiBotDTO | null) {
  const { aiBotStore } = useRootStore();

  // store data
  const botDetails = useStoreData(aiBotStore, (s) => s.botDetails);
  const botPhotos = useStoreData(aiBotStore, (s) => s.botPhotos);
  const photosUpdating = useStoreData(aiBotStore, (s) => s.photosUpdating);
  const maxGalleryItems = aiBotStore.maxGalleryItems;

  // local state
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [usefulnessInput, setUsefulnessInput] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tempUrlRef = useRef<string | null>(null);
  const initialAvatarRef = useRef<string | null>(null);

  // init form on open/aiAgent change
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

  // revoke temp URL on unmount
  useEffect(() => {
    return () => {
      if (tempUrlRef.current) URL.revokeObjectURL(tempUrlRef.current);
    };
  }, []);

  // avatar
  const handleAvatarSelect = useCallback((file: File) => {
    if (tempUrlRef.current) URL.revokeObjectURL(tempUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    tempUrlRef.current = objectUrl;
    setAvatarFile(file);
    setAvatarPreview(objectUrl);
  }, []);

  const handleAvatarRemove = useCallback(() => {
    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current);
      tempUrlRef.current = null;
    }
    setAvatarFile(null);
    setAvatarPreview(initialAvatarRef.current);
  }, []);

  // categories
  const toggleCategory = useCallback((category: string) => {
    setFormState((prev) => {
      const key = normalized(category);
      const exists = prev.categories.some((item) => normalized(item) === key);
      const nextCategories = exists
        ? prev.categories.filter((item) => normalized(item) !== key)
        : [...prev.categories, category];
      return { ...prev, categories: nextCategories };
    });
  }, []);

  // usefulness
  const handleAddUsefulness = useCallback(() => {
    const value = usefulnessInput.trim();
    if (!value) return;
    setFormState((prev) => {
      const exists = prev.usefulness.some((item) => normalized(item) === normalized(value));
      return exists ? prev : { ...prev, usefulness: [...prev.usefulness, value] };
    });
    setUsefulnessInput("");
  }, [usefulnessInput]);

  const handleRemoveUsefulness = useCallback((value: string) => {
    setFormState((prev) => ({
      ...prev,
      usefulness: prev.usefulness.filter((item) => item !== value),
    }));
  }, []);

  const handleUsefulnessKeyDown = useCallback((event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddUsefulness();
    }
  }, [handleAddUsefulness]);

  // gallery
  const remainingGallerySlots = Math.max(0, maxGalleryItems - botPhotos.length);
  const canUploadPhotos = remainingGallerySlots > 0 && !photosUpdating;

  const handleGalleryUpload: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    if (!aiAgent) return;
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const remaining = Math.max(0, maxGalleryItems - botPhotos.length);
    if (remaining === 0) return;

    const allowed = files.slice(0, remaining);
    const formData = new FormData();
    allowed.forEach((file) => formData.append("photos", file, file.name));

    void aiBotStore.addBotPhotos(aiAgent._id, formData);
    event.currentTarget.value = "";
  }, [aiAgent, aiBotStore, botPhotos.length, maxGalleryItems]);

  const handleRemovePhoto = useCallback((url: string) => {
    if (!aiAgent) return;
    void aiBotStore.deleteBotPhotos(aiAgent._id, [url]);
  }, [aiAgent, aiBotStore]);

  // submit
  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(async (event) => {
    event.preventDefault();
    if (!aiAgent) return;

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

    if (normalizedName !== (aiAgent.name ?? "")) payload.name = normalizedName;
    if (normalizedLastName !== (aiAgent.lastname ?? "")) payload.lastname = normalizedLastName;
    if (normalizedProfession !== (aiAgent.profession ?? "")) payload.profession = normalizedProfession;
    if (normalizedBio !== (aiAgent.userBio ?? "")) payload.userBio = normalizedBio;
    if (normalizedPrompt !== currentPrompt) payload.aiPrompt = normalizedPrompt;
    if (normalizedIntro !== currentIntro) {
      payload.intro = normalizedIntro;
      payload.introMessage = normalizedIntro;
    }
    if (!arraysEqual(formState.categories, currentCategories)) payload.categories = formState.categories;
    if (!arraysEqual(formState.usefulness, currentUsefulness)) payload.usefulness = formState.usefulness;

    const hasTextUpdates = Object.keys(payload).length > 0;
    if (!hasTextUpdates && !hasAvatarUpdate) return;

    setIsSubmitting(true);
    try {
      await aiBotStore.updateBot(aiAgent._id, payload, avatarFile ?? undefined);
    } catch (e) {
      console.error("Failed to update AI agent", e);
    } finally {
      setIsSubmitting(false);
    }
  }, [aiAgent, avatarFile, formState, botDetails, aiBotStore]);

  // computed for view
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

  return {
    // store-derived
    botDetails,
    botPhotos,
    photosUpdating,
    maxGalleryItems,

    // local state
    formState, setFormState,
    usefulnessInput, setUsefulnessInput,
    avatarFile, avatarPreview, isSubmitting,

    // computed
    charCounters, selectedCategories,
    remainingGallerySlots, canUploadPhotos,

    // handlers
    handleAvatarSelect,
    handleAvatarRemove,
    toggleCategory,
    handleAddUsefulness,
    handleRemoveUsefulness,
    handleUsefulnessKeyDown,
    handleGalleryUpload,
    handleRemovePhoto,
    handleSubmit,
  } as const;
}
