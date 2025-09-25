import Image from "next/image";

interface BotGalleryProps {
  photos: string[];
  isLoading: boolean;
}

export default function BotGallery({ photos, isLoading }: BotGalleryProps) {
  const hasPhotos = photos.length > 0;

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
            <div
              key={`${photo}-${index}`}
              className="relative h-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              <Image
                src={photo}
                alt="Agent gallery image"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 300px"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/60">No gallery images yet.</p>
      )}
    </section>
  );
}
