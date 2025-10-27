// components/ai-agent/edit/EditAiAgentDialog.tsx
"use client";

import ModalShell from "@/components/profile/edit/overview/ModalShell";
import DialogHeader from "@/components/profile/edit/overview/DialogHeader";
import FormActions from "@/components/profile/edit/overview/FormActions";

import EditAiAgentDialogView from "@/components/ai-agent/edit/EditAiAgentDialogView";
import { useEditAiAgentDialog } from "@/helpers/hooks/aiAgent/useEditAiAgentDialog";
import { AiBotDTO } from "@/types";

interface Props {
  open: boolean;
  aiAgent: AiBotDTO | null;
  onClose: () => void;
}

export default function EditAiAgentDialog({ open, aiAgent, onClose }: Props) {
  const vm = useEditAiAgentDialog(open, aiAgent, onClose);

  return (
    <ModalShell open={open} onBackdrop={onClose}>
      <form onSubmit={vm.handleSubmit}>
        <DialogHeader onClose={onClose} />

        <EditAiAgentDialogView
          // state
          formState={vm.formState}
          setFormState={vm.setFormState}
          usefulnessInput={vm.usefulnessInput}
          setUsefulnessInput={vm.setUsefulnessInput}
          avatarFile={vm.avatarFile}
          avatarPreview={vm.avatarPreview}
          isSubmitting={vm.isSubmitting}
          // store-derived ui
          botPhotos={vm.botPhotos}
          photosUpdating={vm.photosUpdating}
          maxGalleryItems={vm.maxGalleryItems}
          // computed
          charCounters={vm.charCounters}
          selectedCategories={vm.selectedCategories}
          remainingGallerySlots={vm.remainingGallerySlots}
          canUploadPhotos={vm.canUploadPhotos}
          // handlers
          handleAvatarSelect={vm.handleAvatarSelect}
          handleAvatarRemove={vm.handleAvatarRemove}
          toggleCategory={vm.toggleCategory}
          handleAddUsefulness={vm.handleAddUsefulness}
          handleRemoveUsefulness={vm.handleRemoveUsefulness}
          handleUsefulnessKeyDown={vm.handleUsefulnessKeyDown}
          handleGalleryUpload={vm.handleGalleryUpload}
          handleRemovePhoto={vm.handleRemovePhoto}
        />

        <div className="md:m-4">
          <FormActions onCancel={onClose} isSubmitting={vm.isSubmitting} />
        </div>
      </form>
    </ModalShell>
  );
}
