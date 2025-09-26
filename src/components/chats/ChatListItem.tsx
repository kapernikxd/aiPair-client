import Link from "next/link";
import ChatAvatar from "./ChatAvatar";
import { ChatDTO } from "@/helpers/types";
import { getSmartTime } from "@/helpers/utils/date";

export default function ChatListItem({
  chat,
  href,
  onSelect,
}: {
  chat: ChatDTO;
  href: string;
  onSelect?: (chat: ChatDTO) => void;
}) {
  const chatName = chat.chatName ?? chat.bot?.name ?? "Untitled chat";
  const lastMessage = chat.latestMessage;
  const lastMessageContent = lastMessage?.content;
  const timestamp = chat.latestMessage?.createdAt
    ? getSmartTime(chat.latestMessage.createdAt)
    : null;
  const preview = lastMessageContent?.trim()
    ? lastMessageContent
    : lastMessage?.images?.length
    ? "Sent a photo"
    : lastMessage?.attachments?.length
    ? "Sent an attachment"
    : "No messages yet";

  return (
    <li>
      <Link
        href={href}
        className="group flex w-full items-center gap-4 py-2 transition hover:bg-white/10"
        onClick={() => onSelect?.(chat)}
      >
        <ChatAvatar name={chatName} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate text-[15px] font-semibold leading-tight">{chatName}</p>
            {timestamp ? (
              <span className="shrink-0 text-xs font-medium text-white/50">{timestamp}</span>
            ) : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-white/60">{preview}</p>
        </div>
      </Link>
    </li>
  );
}
