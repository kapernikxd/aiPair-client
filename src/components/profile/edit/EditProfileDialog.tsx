"use client";

import { useEffect, useState } from "react";

import ModalShell from "./overview/ModalShell";
import DialogHeader from "./overview/DialogHeader";
import HeroRow from "./overview/HeroRow";
import NameField from "./overview/NameField";
import GenderGroup from "./overview/GenderGroup";
import IntroField from "./overview/IntroField";
import RelationshipField from "./overview/RelationshipField";
import Notice from "./overview/Notice";
import FormActions from "./overview/FormActions";
import { EditableProfile } from "@/helpers/types/profile";
import { useRootStore, useStoreData } from "@/stores/StoreProvider";


type Props = {
  open: boolean;
  profile: EditableProfile;
  onClose: () => void;
  onSave: (profile: EditableProfile) => void;
};

export default function EditProfileDialog({ open, profile, onClose, onSave }: Props) {
  const [formState, setFormState] = useState<EditableProfile>(profile);
  const { profileStore } = useRootStore();
  const genderOptions = useStoreData(profileStore, (store) => store.genderOptions);
  const relationshipOptions = useStoreData(profileStore, (store) => store.relationshipOptions);

  // sync incoming profile on open
  useEffect(() => {
    if (open) setFormState(profile);
  }, [open, profile]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSave(formState);
    onClose();
  };

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogHeader onClose={onClose} />

        <div className="space-y-6 px-6 pb-6 sm:px-8 sm:pb-8">
          <HeroRow userName={formState.userName} />

          <NameField
            value={formState.userName}
            onChange={(val) => setFormState((s) => ({ ...s, userName: val }))}
          />

          <GenderGroup
            value={formState.gender}
            onChange={(val) => setFormState((s) => ({ ...s, gender: val }))}
            options={genderOptions}
          />

          <IntroField
            value={formState.intro}
            onChange={(val) => setFormState((s) => ({ ...s, intro: val }))}
          />

          <RelationshipField
            value={formState.relationshipPreference}
            onChange={(val) => setFormState((s) => ({ ...s, relationshipPreference: val }))}
            options={relationshipOptions}
          />

          <Notice />
          <FormActions onCancel={onClose} />
        </div>
      </form>
    </ModalShell>
  );
}
