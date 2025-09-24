import Link from "next/link";
import ChatAvatar from "./ChatAvatar";
import { ChatThread } from "../../helpers/types/chats";

export default function ChatListItem({
  thread,
  href,
}: {
  thread: ChatThread;
  href: string;
}) {
  return (
    <li>
      <Link href={href} className="group flex w-full items-center gap-4 py-2 transition hover:bg-white/10">
        <ChatAvatar name={thread.name} avatar={thread.avatar} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-[15px] font-semibold leading-tight">{thread.name}</p>
            <span className="shrink-0 text-xs font-medium text-white/50">{thread.timestamp}</span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{thread.preview}</p>
        </div>
      </Link>
    </li>
  );
}
