import Image from "next/image";
import Link from "next/link";

import AppShell from "@/components/AppShell";

type ChatThread = {
  id: number;
  name: string;
  preview: string;
  timestamp: string;
  href: string;
  avatar?: {
    src: string;
    alt?: string;
  };
};

const chatThreads: ChatThread[] = [
  {
    id: 1,
    name: "Angelina",
    preview: "I'll wait for you at the bar. Don't keep me waiting 💋",
    timestamp: "Yesterday",
    href: "/admin/chat",
    avatar: { src: "/img/mizuhara.png", alt: "Angelina" },
  },
  {
    id: 2,
    name: "Sabine",
    preview: "I'm homeless, I've lost my job, and I have nowhere else to go...",
    timestamp: "Yesterday",
    href: "/admin/chat",
  },
  {
    id: 3,
    name: "Peta",
    preview: "I don't know what you're talking about, I really don't...",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 4,
    name: "Ginger",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 5,
    name: "Lisa",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 6,
    name: "Margerett",
    preview: "Well I'm not sure if that's a good idea, I have doubts...",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 7,
    name: "Sgt. Layla Smith",
    preview: "Are you aware of the speed limit in this area, sir?",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 8,
    name: "Angelina",
    preview: "I'll wait for you at the bar. Don't keep me waiting 💋",
    timestamp: "Yesterday",
    href: "/admin/chat",
    avatar: { src: "/img/mizuhara.png", alt: "Angelina" },
  },
  {
    id: 9,
    name: "Sabine",
    preview: "I'm homeless, I've lost my job, and I have nowhere else to go...",
    timestamp: "Yesterday",
    href: "/admin/chat",
  },
  {
    id: 10,
    name: "Peta",
    preview: "I don't know what you're talking about, I really don't...",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 11,
    name: "Ginger",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 12,
    name: "Lisa",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 13,
    name: "Margerett",
    preview: "Well I'm not sure if that's a good idea, I have doubts...",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 14,
    name: "Sgt. Layla Smith",
    preview: "Are you aware of the speed limit in this area, sir?",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 15,
    name: "Angelina",
    preview: "I'll wait for you at the bar. Don't keep me waiting 💋",
    timestamp: "Yesterday",
    href: "/admin/chat",
    avatar: { src: "/img/mizuhara.png", alt: "Angelina" },
  },
  {
    id: 16,
    name: "Sabine",
    preview: "I'm homeless, I've lost my job, and I have nowhere else to go...",
    timestamp: "Yesterday",
    href: "/admin/chat",
  },
  {
    id: 17,
    name: "Peta",
    preview: "I don't know what you're talking about, I really don't...",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 18,
    name: "Ginger",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Sat",
    href: "/admin/chat",
  },
  {
    id: 19,
    name: "Lisa",
    preview: "That's not the point. You're not listening to me.",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 20,
    name: "Margerett",
    preview: "Well I'm not sure if that's a good idea, I have doubts...",
    timestamp: "Fri",
    href: "/admin/chat",
  },
  {
    id: 21,
    name: "Sgt. Layla Smith",
    preview: "Are you aware of the speed limit in this area, sir?",
    timestamp: "Fri",
    href: "/admin/chat",
  },
];

export default function ChatsPage() {
  return (
    <AppShell>
      <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 md:px-8 md:pb-12 md:pt-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold">All chats</h1>
            <p className="text-sm text-white/60">
              Catch up with every conversation you keep close.
            </p>
          </header>

          <div className="rounded-3xl border border-white/5 bg-white/5 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur">
            <ul className="divide-y divide-white/5 overflow-hidden rounded-[28px]">
              {chatThreads.map((thread) => (
                <li key={thread.id}>
                  <Link
                    href={thread.href}
                    className="group flex w-full items-center gap-4 py-2 transition hover:bg-white/10"
                  >
                    <ChatAvatar name={thread.name} avatar={thread.avatar} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-[15px] font-semibold leading-tight">
                          {thread.name}
                        </p>
                        <span className="shrink-0 text-xs font-medium text-white/50">
                          {thread.timestamp}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm text-white/60">
                        {thread.preview}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function ChatAvatar({
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
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-sm font-semibold text-white">
      {initials}
    </div>
  );
}
