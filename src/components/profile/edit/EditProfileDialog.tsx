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
import { useRootStore, useStoreData } from "@/stores/StoreProvider";
import { MyProfileDTO } from "@/helpers/types";
import LastNameField from "./overview/LastNameField";


type Props = {
  open: boolean;
  profile: MyProfileDTO;
  onClose: () => void;
  onSave: (profile: MyProfileDTO) => void;
};

export default function EditProfileDialog({ open, profile, onClose, onSave }: Props) {
  const [formState, setFormState] = useState<MyProfileDTO>(profile);
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
          <HeroRow userName={formState.username || 'userName'} />

          <NameField
            value={formState.name}
            onChange={(val) => setFormState((s) => ({ ...s, userName: val }))}
          />

          <LastNameField
            value={formState.lastname}
            onChange={(val) => setFormState((s) => ({ ...s, userName: val }))}
          />

          <GenderGroup
            value={'male'}
            onChange={(val) => setFormState((s) => ({ ...s, gender: val }))}
            options={genderOptions}
          />

          <IntroField
            value={formState.userBio}
            onChange={(val) => setFormState((s) => ({ ...s, intro: val }))}
          />

          <RelationshipField
            value={'test'}
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
