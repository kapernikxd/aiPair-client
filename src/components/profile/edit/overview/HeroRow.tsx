"use client";

import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";

type Props = {
  userName?: string;
  avatarUrl?: string | null; // URL из бэка (если уже загружен)
  onAvatarSelect?: (file: File) => void;
  onAvatarRemove?: () => void;
  canRemoveAvatar?: boolean;
  description?: string;
};

const MAX_TARGET_LONG_SIDE = 1600; // px
const JPEG_QUALITY = 0.85;

// Разрешённые растровые форматы (SVG исключаем для аватаров)
const RASTER_EXTS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "heic",
  "heif",
  "bmp",
  "tif",
  "tiff",
];

function getFileExtLower(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i + 1).toLowerCase();
}

function isLikelyImage(file: File): boolean {
  // 1) Надёжнее всего по MIME
  if (file.type && file.type.startsWith("image/")) return true;
  // 2) Фоллбек по расширению (на iOS иногда type=="")
  const ext = getFileExtLower(file.name);
  return RASTER_EXTS.includes(ext);
}

/** Быстрый декодер (если поддерживается браузером) */
async function readAsImageBitmap(file: File): Promise<ImageBitmap> {
  return await createImageBitmap(file);
}

/** Канвас + ресайз с высоким качеством */
function imageToCanvas(img: HTMLImageElement | ImageBitmap) {
  let width: number;
  let height: number;

  if (img instanceof HTMLImageElement) {
    width = img.naturalWidth;
    height = img.naturalHeight;
  } else {
    width = img.width;
    height = img.height;
  }

  const maxSide = Math.max(width, height);
  const scale = maxSide > MAX_TARGET_LONG_SIDE ? MAX_TARGET_LONG_SIDE / maxSide : 1;
  const targetW = Math.round(width * scale);
  const targetH = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(img as CanvasImageSource, 0, 0, width, height, 0, 0, targetW, targetH);

  return canvas;
}

/** Фоллбек-декод через <img> для почти всех форматов, включая HEIC в Safari */
async function fileToHtmlImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = document.createElement("img") as HTMLImageElement;
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = url;
  });
  return img;
}

/**
 * Нормализация входного файла:
 * - декодируем (ImageBitmap или <img>)
 * - уменьшаем до разумного размера
 * - конвертируем в JPEG (image/jpeg)
 */
async function normalizeImageToJpeg(file: File): Promise<File> {
  try {
    const bitmap = await readAsImageBitmap(file);
    const canvas = imageToCanvas(bitmap);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", JPEG_QUALITY)
    );
    return new File([blob], replaceExt(file.name, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    const img = await fileToHtmlImage(file);
    const canvas = imageToCanvas(img);
    const blob: Blob = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", JPEG_QUALITY)
    );
    return new File([blob], replaceExt(file.name, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }
}

function replaceExt(name: string, ext: string) {
  const i = name.lastIndexOf(".");
  if (i === -1) return name + ext;
  return name.slice(0, i) + ext;
}

export default function HeroRow({
  userName,
  avatarUrl,
  onAvatarSelect,
  onAvatarRemove,
  canRemoveAvatar,
  description = "Update your personal details to help others know you better.",
}: Props) {
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
                  alt="Profile avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={previewUrl}
                  alt="Profile avatar preview"
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
              {busy ? "Loading..." : "Choose file"}
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
              {busy ? "Loading..." : "Take a photo"}
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
                Remove photo
              </button>
            )}

            {error && <div className="text-xs text-red-400">{error}</div>}
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-neutral-300 sm:mt-2 sm:text-left">
        {description}
      </p>
    </div>
  );
}
