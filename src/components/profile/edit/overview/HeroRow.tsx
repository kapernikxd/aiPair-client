"use client";

import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";

import { isLikelyImage, normalizeImageToJpeg } from "@/helpers/utils/image";
import { useTranslations } from "@/localization/TranslationProvider";

type Props = {
  userName?: string;
  avatarUrl?: string | null; // URL из бэка (если уже загружен)
  onAvatarSelect?: (file: File) => void;
  onAvatarRemove?: () => void;
  canRemoveAvatar?: boolean;
  description?: string;
};

export default function HeroRow({
  userName,
  avatarUrl,
  onAvatarSelect,
  onAvatarRemove,
  canRemoveAvatar,
  description,
}: Props) {
  const { t } = useTranslations();
  const fallbackDescription = t(
    "admin.profile.edit.hero.description",
    "Update your personal details to help others know you better.",
  );
  const heroDescription = description ?? fallbackDescription;
  const loadingLabel = t("common.loading", "Loading…");
  const chooseFileLabel = t("admin.profile.edit.hero.chooseFile", "Choose file");
  const takePhotoLabel = t("admin.profile.edit.hero.takePhoto", "Take a photo");
  const removePhotoLabel = t("admin.profile.edit.hero.removePhoto", "Remove photo");
  const previewAlt = t("admin.profile.edit.hero.previewAlt", "Profile avatar preview");
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const inputCameraRef = useRef<HTMLInputElement | null>(null);

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processSelectedFile = async (file: File) => {
    // Валидация, что это картинка
    if (!isLikelyImage(file)) {
      setError("Пожалуйста, выберите файл изображения (jpeg, png, webp, heic...).");
      return;
    }

    // Локальная превью (blob:)
    const tempUrl = URL.createObjectURL(file);
    setLocalPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return tempUrl;
    });

    // Нормализация и прокид наверх
    const normalized = await normalizeImageToJpeg(file);
    if (onAvatarSelect) onAvatarSelect(normalized);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setBusy(true);
      await processSelectedFile(file);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error(String(e));
      console.error(err);
      setError("Не удалось обработать изображение. Попробуйте другое фото.");
    } finally {
      setBusy(false);
      // Очистить value, чтобы можно было выбрать тот же файл
      if (inputFileRef.current) inputFileRef.current.value = "";
      if (inputCameraRef.current) inputCameraRef.current.value = "";
    }
  };

  const previewUrl = localPreview || avatarUrl || null;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="relative">
          <div className="relative left-[26px] flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-orange-400 to-red-500 text-2xl font-semibold">
            {previewUrl ? (
              previewUrl.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt={previewAlt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt={previewAlt}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              )
            ) : (
              (userName || "?").charAt(0)
            )}
          </div>

          {/* Кнопки выбора файла/камеры */}
          <div className="mt-2 grid gap-2 sm:grid-cols-1">
            {/* Обычный файловый диалог (без accept) */}
            <label
              htmlFor="avatarFileInput"
              className="block w-full cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-white/80 transition hover:bg-white/10"
            >
              {busy ? loadingLabel : chooseFileLabel}
            </label>
            <input
              id="avatarFileInput"
              ref={inputFileRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Камера */}
            <label
              htmlFor="avatarCameraInput"
              className="block w-full cursor-pointer rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-center text-xs font-medium uppercase tracking-wide text-white/80 transition hover:bg-white/10"
            >
              {busy ? loadingLabel : takePhotoLabel}
            </label>
            <input
              id="avatarCameraInput"
              ref={inputCameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Удалить фото */}
            {onAvatarRemove && canRemoveAvatar && (
              <button
                type="button"
                onClick={() => {
                  setLocalPreview((prev) => {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });
                  onAvatarRemove();
                }}
                className="w-full rounded-2xl border border-transparent bg-white/0 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white/60 transition hover:text-white"
              >
                {removePhotoLabel}
              </button>
            )}

            {error && <div className="text-xs text-red-400">{error}</div>}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-300 sm:mt-2 sm:text-left">
        {heroDescription}
      </p>
    </div>
  );
}
