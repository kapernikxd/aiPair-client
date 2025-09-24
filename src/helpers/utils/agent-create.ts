import { GalleryItem } from "@/helpers/types/agent-create";


export function revokeIfNeeded(url?: string | null) {
  if (url) URL.revokeObjectURL(url);
}

export function revokeGallery(items: GalleryItem[]) {
  items.forEach((i) => URL.revokeObjectURL(i.preview));
}
