import Image from "next/image";
export default function ChatAvatar({
  name,
  avatarUrl,
  avatarAlt,
}: {
  name: string;
  avatarUrl?: string;
  avatarAlt?: string;
}) {
  if (avatarUrl) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
        <Image
          src={avatarUrl}
          alt={avatarAlt ?? name}
          fill
          sizes="48px"
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white">
      {initials}
    </div>
  );
}
