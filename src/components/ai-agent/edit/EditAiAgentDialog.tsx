"use client";

import { FormEventHandler, useEffect, useMemo, useRef, useState } from "react";

import ModalShell from "@/components/profile/edit/overview/ModalShell";
import DialogHeader from "@/components/profile/edit/overview/DialogHeader";
import HeroRow from "@/components/profile/edit/overview/HeroRow";
import FormActions from "@/components/profile/edit/overview/FormActions";

import { useRootStore } from "@/stores/StoreProvider";
import type { AiBotDTO } from "@/helpers/types/dtos/AiBotDto";
import { getUserAvatar } from "@/helpers/utils/user";
import type { AiBotUpdatePayload } from "@/services/profile/ProfileService";

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
}

const INITIAL_FORM: FormState = {
  name: "",
  lastname: "",
  profession: "",
  userBio: "",
};

export default function EditAiAgentDialog({ open, aiAgent, onClose }: Props) {
  const { aiBotStore } = useRootStore();

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tempUrlRef = useRef<string | null>(null);
  const initialAvatarRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !aiAgent) return;

    const nextFormState: FormState = {
      name: aiAgent.name ?? "",
      lastname: aiAgent.lastname ?? "",
      profession: aiAgent.profession ?? "",
      userBio: aiAgent.userBio ?? "",
    };

    setFormState(nextFormState);
    setAvatarFile(null);

    const avatar = aiAgent.avatarFile ? getUserAvatar(aiAgent) : null;
    initialAvatarRef.current = avatar;
    setAvatarPreview(avatar);

    if (tempUrlRef.current) {
      URL.revokeObjectURL(tempUrlRef.current);
      tempUrlRef.current = null;
    }
  }, [open, aiAgent]);

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

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader onClose={onClose} />

        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
          <HeroRow
            userName={formState.name || "agent"}
            avatarUrl={avatarPreview}
            onAvatarSelect={handleAvatarSelect}
            onAvatarRemove={handleAvatarRemove}
            canRemoveAvatar={Boolean(avatarFile)}
            description="Refresh your AI agent with updated visuals and a sharper identity."
          />

          <label className="block space-y-2">
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
              className={inputClasses}
            />
          </label>

          <label className="block space-y-2">
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
              className={inputClasses}
            />
          </label>

          <label className="block space-y-2">
            <div className={fieldLabelClasses}>
              <span>Expertise</span>
              <span>{charCounters.profession}/32</span>
            </div>
            <input
              type="text"
              value={formState.profession}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, profession: event.target.value.slice(0, 32) }))
              }
              placeholder="What role or specialty defines this agent?"
              maxLength={32}
              className={inputClasses}
            />
          </label>

          <label className="block space-y-2">
            <div className={fieldLabelClasses}>
              <span>Introduction</span>
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

          <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
        </div>
      </form>
    </ModalShell>
  );
}
