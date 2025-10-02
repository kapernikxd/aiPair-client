import { GalleryItem } from "@/helpers/types/agent-create";

const BLOB_URL_PREFIX = "blob:";

export function revokeIfNeeded(url?: string | null) {
  if (!url || !url.startsWith(BLOB_URL_PREFIX)) {
    return;
  }

  URL.revokeObjectURL(url);
}

export function revokeGallery(items: GalleryItem[]) {
  items.forEach((item) => revokeIfNeeded(item.preview));
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unexpected reader result"));
    };

    reader.onerror = () => {
      reject(reader.error ?? new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

export async function createImagePreview(file: File): Promise<string> {
  if (typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
    try {
      return URL.createObjectURL(file);
    } catch (error) {
      console.warn("Falling back to FileReader for preview", error);
    }
  }

  return readFileAsDataUrl(file);
}
