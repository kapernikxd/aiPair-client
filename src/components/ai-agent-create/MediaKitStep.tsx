/* eslint-disable @next/next/no-img-element */
"use client";

import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GalleryItem } from "../../helpers/types/agent-create";
import { useTranslations } from "@/localization/TranslationProvider";
import { useImageUploader } from "@/helpers/hooks/useImageUploader";

export default function MediaKitStep({
  gallery,
  maxItems,
  onAdd,
  onRemove,
}: {
  gallery: GalleryItem[];
  maxItems: number;
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}) {
  const { t } = useTranslations();
  const remainingSlots = Math.max(0, maxItems - gallery.length);
  const canUpload = remainingSlots > 0;
  const { getRootProps, getInputProps, isDragActive } = useImageUploader({
    onFiles: onAdd,
    multiple: true,
    maxFiles: remainingSlots,
    enableCameraCapture: true,
    disableClick: !canUpload,
  });
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("admin.create.media.title", "Curate the vibe")}
        </h2>
        <p className="mt-2 text-sm text-white/70">
          {t(
            "admin.create.media.subtitle",
            "Add reference images, scenes, or moodboard shots to help the audience visualise your agent.",
          )}
        </p>
      </div>

      <div
        {...getRootProps({
          className: `relative rounded-3xl border border-dashed bg-neutral-900/60 p-6 text-center text-sm text-white/70 ${
            canUpload ? "cursor-pointer" : "pointer-events-none opacity-60"
          } ${isDragActive ? "border-violet-400/60 bg-violet-500/10" : "border-white/15"}`,
        })}
      >
        <div className="relative flex flex-col items-center justify-center gap-3">
          <ImagePlus className="size-6 text-violet-300" />
          <span className="font-medium text-white">
            {t("admin.create.media.upload", "Upload gallery")}
          </span>
          <span className="text-xs text-white/60">
            {t(
              "admin.create.media.uploadHint",
              "Drop multiple images or pick from your library",
            )}
          </span>
        </div>
        <input
          {...getInputProps({
            className: "absolute inset-0 h-full w-full cursor-pointer opacity-0",
            disabled: !canUpload,
          })}
        />
      </div>

      {gallery.length >= maxItems && (
        <p className="text-xs text-white/60">
          {t(
            "admin.create.media.limitReached",
            "You’ve reached the {max}-image limit. Remove an image if you want to add a new one.",
          ).replace("{max}", String(maxItems))}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {gallery.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-white/10">
            <img
              src={item.preview}
              alt={t("admin.create.media.assetAlt", "Gallery asset")}
              className="h-40 w-full object-cover"
            />
            <div className="absolute right-3 top-3">
              <Button
                type="button"
                onClick={() => onRemove(item.id)}
                variant="galleryClose"
                aria-label={t("admin.create.media.removeImage", "Remove image")}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}
        {!gallery.length && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left text-sm text-white/60">
            <p>
              {t(
                "admin.create.media.empty",
                "Once you add images, they will appear here with quick remove controls.",
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
