"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface BotGalleryProps {
  photos: string[];
  isLoading: boolean;
}

export default function BotGallery({ photos, isLoading }: BotGalleryProps) {
  const hasPhotos = photos.length > 0;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openPhoto = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      const nextIndex = (current - 1 + photos.length) % photos.length;
      return nextIndex;
    });
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      const nextIndex = (current + 1) % photos.length;
      return nextIndex;
    });
  }, [photos.length]);

  const hasMultiplePhotos = useMemo(() => photos.length > 1, [photos.length]);

  useEffect(() => {
    if (activeIndex === null) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
      }

      if (!hasMultiplePhotos) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex, closeViewer, hasMultiplePhotos, showNext, showPrev]);

  const activePhoto = useMemo(() => {
    if (activeIndex === null) return undefined;
    return photos[activeIndex];
  }, [activeIndex, photos]);

  return (
    <section>
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white/60">
        Gallery
      </h3>
      {isLoading && !hasPhotos ? (
        <p className="mt-3 text-sm text-white/60">Loading gallery…</p>
      ) : hasPhotos ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {photos.map((photo, index) => (
            <button
              key={`${photo}-${index}`}
              type="button"
              onClick={() => openPhoto(index)}
              className="group relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <Image
                src={photo}
                alt="Agent gallery image"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 300px"
              />
              <span className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/60">No gallery images yet.</p>
      )}

      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Agent gallery preview"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 px-4 py-10"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeViewer();
            }
          }}
        >
          <div className="flex w-full max-w-4xl flex-col items-center gap-4">
            <button
              type="button"
              onClick={closeViewer}
              className="self-end rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close gallery preview"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex w-full flex-1 items-center justify-center">
              {hasMultiplePhotos && (
                <button
                  type="button"
                  onClick={showPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Show previous image"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}

              <div className="relative h-full max-h-[75vh] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40">
                <Image
                  src={activePhoto}
                  alt="Agent gallery image enlarged"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>

              {hasMultiplePhotos && (
                <button
                  type="button"
                  onClick={showNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/10 p-3 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Show next image"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>

            {hasMultiplePhotos && (
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span>{(activeIndex ?? 0) + 1}</span>
                <span className="text-white/40">/</span>
                <span>{photos.length}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
