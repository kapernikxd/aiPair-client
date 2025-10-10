// components/profile/edit/EditProfileDialogView.tsx
"use client";

import ModalShell from "./overview/ModalShell";
import DialogHeader from "./overview/DialogHeader";
import HeroRow from "./overview/HeroRow";
import NameField from "./overview/NameField";
import GenderGroup from "./overview/GenderGroup";
import IntroField from "./overview/IntroField";
import ProfessionField from "./overview/ProfessionField";
import Notice from "./overview/Notice";
import FormActions from "./overview/FormActions";
import LastNameField from "./overview/LastNameField";
import type { MyProfileDTO } from "@/helpers/types";

type ViewProps = {
  open: boolean;
  onClose: () => void;

  // state
  formState: MyProfileDTO;
  setFormState: React.Dispatch<React.SetStateAction<MyProfileDTO>>;
  avatarFile: File | null;
  avatarPreview: string | null;
  hasInitialAvatar: boolean;
  isSubmitting: boolean;

  // data
  genderOptions: { value: string; label: string }[];
  professionOptions: string[];

  // handlers
  handleAvatarSelect: (file: File) => void;
  handleAvatarRemove: () => void;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
};

export default function EditProfileDialogView(props: ViewProps) {
  const {
    open, onClose,
    formState, setFormState,
    avatarFile, avatarPreview, hasInitialAvatar,
    isSubmitting,
    genderOptions, professionOptions,
    handleAvatarSelect, handleAvatarRemove, handleSubmit,
  } = props;

  const canRemoveAvatar =
    Boolean(avatarPreview) || Boolean(avatarFile) || hasInitialAvatar;

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
            canRemoveAvatar={canRemoveAvatar}
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
            value={formState.profession || ""}
            onChange={(val) => setFormState((s) => ({ ...s, profession: val }))}
            placeholder={professionOptions[0] || ""}
          />

          <Notice />
          <FormActions onCancel={onClose} isSubmitting={isSubmitting} />
        </div>
      </form>
    </ModalShell>
  );
}
