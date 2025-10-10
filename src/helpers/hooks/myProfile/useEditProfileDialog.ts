// hooks/useEditProfileDialog.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { getUserAvatar } from "@/helpers/utils/user";
import type { MyProfileDTO } from "@/helpers/types";
import type { UpdateProfileProps } from "@/helpers/types/profile";

export function useEditProfileDialog(open: boolean, profile: MyProfileDTO, onClose: () => void, onSave?: (p: MyProfileDTO) => void) {
  const { profileStore } = useRootStore();
  const genderOptions = useStoreData(profileStore, (s) => s.genderOptions);
  const professionOptions = useStoreData(profileStore, (s) => s.professionOptions);

  const [formState, setFormState] = useState<MyProfileDTO>(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [shouldRemoveAvatar, setShouldRemoveAvatar] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempUrl, setTempUrl] = useState<string | null>(null);

  const hasInitialAvatar = useMemo(() => Boolean(profile?.avatarFile), [profile?.avatarFile]);

  // sync incoming profile on open
  useEffect(() => {
    if (!open) return;

    setFormState({ ...profile });
    setAvatarFile(null);
    setShouldRemoveAvatar(false);

    const avatar = profile?.avatarFile ? getUserAvatar(profile) : null;
    setAvatarPreview(avatar);

    setTempUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, [open, profile]);

  // cleanup created preview URL
  useEffect(() => {
    return () => {
      if (tempUrl) URL.revokeObjectURL(tempUrl);
    };
  }, [tempUrl]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleAvatarSelect = useCallback((file: File) => {
    if (tempUrl) URL.revokeObjectURL(tempUrl);
    const objectUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(objectUrl);
    setShouldRemoveAvatar(false);
    setTempUrl(objectUrl);
  }, [tempUrl]);

  const handleAvatarRemove = useCallback(() => {
    if (tempUrl) {
      URL.revokeObjectURL(tempUrl);
      setTempUrl(null);
    }

    if (avatarFile) {
      const avatar = profile?.avatarFile ? getUserAvatar(profile) : null;
      setAvatarPreview(avatar);
      setAvatarFile(null);
      setShouldRemoveAvatar(false);
      return;
    }

    setAvatarFile(null);
    setAvatarPreview(null);
    setShouldRemoveAvatar(Boolean(profile?.avatarFile));
  }, [avatarFile, profile, tempUrl]);

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(async (e) => {
    e.preventDefault();

    const payload: UpdateProfileProps = {
      name: formState.name?.trim() || undefined,
      lastname: formState.lastname?.trim() || undefined,
      username: formState.username?.trim() || undefined,
      userBio: formState.userBio || undefined,
      gender: formState.gender ? (formState.gender as UpdateProfileProps["gender"]) : undefined,
      profession: formState.profession || undefined,
      phone: formState.phone || undefined,
    };

    // отправляем только изменённые поля
    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => {
        if (value === undefined || value === "") return false;
        const originalValue = profile?.[key as keyof MyProfileDTO];
        return value !== originalValue;
      })
    ) as UpdateProfileProps;

    setIsSubmitting(true);
    try {
      if (Object.keys(filteredPayload).length > 0) {
        await profileStore.updateProfile(filteredPayload);
      }

      if (avatarFile) {
        const formData = new FormData();
        formData.append("file", avatarFile);
        await profileStore.uploadProfilePhoto(formData);
      } else if (shouldRemoveAvatar && profile?.avatarFile) {
        await profileStore.deleteProfilePhoto(profile.avatarFile);
      }

      await profileStore.fetchMyProfile();
      onSave?.(profileStore.myProfile);
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formState, profile, profileStore, avatarFile, shouldRemoveAvatar, onSave, onClose]);

  return {
    // стор-данные
    genderOptions,
    professionOptions,

    // локальный стейт
    formState, setFormState,
    avatarFile, avatarPreview, shouldRemoveAvatar, isSubmitting, hasInitialAvatar,

    // хендлеры
    handleAvatarSelect,
    handleAvatarRemove,
    handleSubmit,
  } as const;
}
