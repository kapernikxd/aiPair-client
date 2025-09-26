import Link from "next/link";
import ChatAvatar from "./ChatAvatar";
import { ChatDTO, UserDTO } from "@/helpers/types";
import { getSmartTime } from "@/helpers/utils/date";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";

export default function ChatListItem({
  chat,
  href,
  onSelect,
  currentUserId,
}: {
  chat: ChatDTO;
  href: string;
  onSelect?: (chat: ChatDTO) => void;
  currentUserId: string;
}) {
  type ChatParticipant = Pick<UserDTO, "_id" | "name" | "lastname" | "avatarFile">;

  const rawParticipants = (chat.users as unknown as Array<ChatParticipant | string>) ?? [];
  const participants = rawParticipants.filter(
    (user): user is ChatParticipant => typeof user === "object" && user !== null && "_id" in user
  );
  const opponent = !chat.isGroupChat
    ? participants.find((user) => user && user._id !== currentUserId)
    : undefined;

  const chatName = opponent
    ? getUserFullName(opponent)
    : chat.chatName ?? chat.bot?.name ?? "Untitled chat";
  const lastMessage = chat.latestMessage;
  const lastMessageContent = lastMessage?.content;
  const timestamp = chat.latestMessage?.createdAt
    ? getSmartTime(chat.latestMessage.createdAt)
    : null;
  const senderId = lastMessage?.sender?._id;
  const senderUser = senderId
    ? participants.find((user) => user && user._id === senderId)
    : undefined;
  const isMyMessage = senderId === currentUserId;
  const senderLabel = lastMessage
    ? isMyMessage
      ? "Я"
      : senderUser
      ? getUserFullName(senderUser)
      : chat.bot?.name ?? "Собеседник"
    : "";

  const messageBody = lastMessageContent?.trim()
    ? lastMessageContent
    : lastMessage?.images?.length
    ? "Отправлено фото"
    : lastMessage?.attachments?.length
    ? "Отправлен файл"
    : "Нет сообщений";

  const preview = lastMessage
    ? senderLabel
      ? `${senderLabel}: ${messageBody}`
      : messageBody
    : messageBody;

  const avatarUrl = opponent ? getUserAvatar(opponent) : undefined;
  const avatarAlt = opponent ? getUserFullName(opponent) : chatName;

  return (
    <li>
      <Link
        href={href}
        className="group flex w-full items-center gap-4 py-2 transition hover:bg-white/10"
        onClick={() => onSelect?.(chat)}
      >
        <ChatAvatar name={chatName} avatarUrl={avatarUrl} avatarAlt={avatarAlt} />
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
