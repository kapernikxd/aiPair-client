"use client";

import { FormEventHandler, useEffect, useMemo, useState } from "react";

import ModalShell from "./overview/ModalShell";
import DialogHeader from "./overview/DialogHeader";
import HeroRow from "./overview/HeroRow";
import NameField from "./overview/NameField";
import GenderGroup from "./overview/GenderGroup";
import IntroField from "./overview/IntroField";
import ProfessionField from "./overview/ProfessionField";
import Notice from "./overview/Notice";
import FormActions from "./overview/FormActions";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { MyProfileDTO } from "@/helpers/types";
import LastNameField from "./overview/LastNameField";
import { getUserAvatar } from "@/helpers/utils/user";
import { UpdateProfileProps } from "@/helpers/types/profile";

type Props = {
  open: boolean;
  profile: MyProfileDTO;
  onClose: () => void;
  onSave?: (profile: MyProfileDTO) => void;
};

export default function EditProfileDialog({ open, profile, onClose, onSave }: Props) {
  const { profileStore } = useRootStore();
  const genderOptions = useStoreData(profileStore, (store) => store.genderOptions);
  const professionOptions = useStoreData(profileStore, (store) => store.professionOptions);

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
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return null;
    });
  }, [open, profile]);

  // cleanup created preview URL
  useEffect(() => {
    return () => {
      if (tempUrl) {
        URL.revokeObjectURL(tempUrl);
      }
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

  const handleAvatarSelect = (file: File) => {
    if (tempUrl) {
      URL.revokeObjectURL(tempUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarFile(file);
    setAvatarPreview(objectUrl);
    setShouldRemoveAvatar(false);
    setTempUrl(objectUrl);
  };

  const handleAvatarRemove = () => {
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
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
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

    const filteredPayload = Object.fromEntries(
      Object.entries(payload).filter(([key, value]) => {
        if (value === undefined || value === "") {
          return false;
        }

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
  };

  const professionChoices = useMemo(() => {
    const baseOptions = [...professionOptions];
    if (formState.profession && !baseOptions.includes(formState.profession)) {
      baseOptions.push(formState.profession);
    }
    return baseOptions;
  }, [professionOptions, formState.profession]);

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader onClose={onClose} />

        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
          <HeroRow
            userName={formState.name || formState.username || "user"}
            avatarUrl={avatarPreview}
            onAvatarSelect={handleAvatarSelect}
            onAvatarRemove={handleAvatarRemove}
            canRemoveAvatar={Boolean(avatarPreview) || Boolean(avatarFile) || (hasInitialAvatar && !shouldRemoveAvatar)}
          />

          <NameField
            value={formState.name || ""}
            onChange={(val) => setFormState((s) => ({ ...s, name: val }))}
          />

          <LastNameField
            value={formState.lastname || ""}
            onChange={(val) => setFormState((s) => ({ ...s, lastname: val }))}
          />

          <GenderGroup
            value={formState.gender || ""}
            onChange={(val) => setFormState((s) => ({ ...s, gender: val }))}
            options={genderOptions}
          />

          <IntroField
            value={formState.userBio}
            onChange={(val) => setFormState((s) => ({ ...s, userBio: val }))}
          />

          <ProfessionField
            value={formState.profession || professionChoices[0] || ""}
            onChange={(val) => setFormState((s) => ({ ...s, profession: val }))}
            options={professionChoices}
          />

          <Notice />
          <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
        </div>
      </form>
    </ModalShell>
  );
}
