import Image from "next/image";
import { ChatThread } from "../../helpers/types/chats";

export default function ChatAvatar({
  name,
  avatar,
}: {
  name: string;
  avatar?: ChatThread["avatar"];
}) {
  if (avatar?.src) {
    return (
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
        <Image
          src={avatar.src}
          alt={avatar.alt ?? name}
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
