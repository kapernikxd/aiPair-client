// components/profile/edit/EditProfileDialog.tsx
"use client";

import type { MyProfileDTO } from "@/types";
import EditProfileDialogView from "./EditProfileDialogView";
import { useEditProfileDialog } from "@/helpers/hooks/myProfile/useEditProfileDialog";

type Props = {
  open: boolean;
  profile: MyProfileDTO;
  onClose: () => void;
  onSave?: (profile: MyProfileDTO) => void;
};

export default function EditProfileDialog({ open, profile, onClose, onSave }: Props) {
  const vm = useEditProfileDialog(open, profile, onClose, onSave);

  return (
    <EditProfileDialogView
      open={open}
      onClose={onClose}
      // state
      formState={vm.formState}
      setFormState={vm.setFormState}
      avatarFile={vm.avatarFile}
      avatarPreview={vm.avatarPreview}
      hasInitialAvatar={vm.hasInitialAvatar}
      isSubmitting={vm.isSubmitting}
      // data
      genderOptions={vm.genderOptions}
      professionOptions={vm.professionOptions}
      // handlers
      handleAvatarSelect={vm.handleAvatarSelect}
      handleAvatarRemove={vm.handleAvatarRemove}
      handleSubmit={vm.handleSubmit}
    />
  );
}
