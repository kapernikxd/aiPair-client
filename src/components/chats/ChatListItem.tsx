import Link from "next/link";
import ChatAvatar from "./ChatAvatar";
import { ChatDTO, UserDTO } from "@/types";
import { getSmartTime } from "@/helpers/utils/date";
import { getUserAvatar, getUserFullName } from "@/helpers/utils/user";
import { useTranslations } from "@/localization/TranslationProvider";

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
  const { t } = useTranslations();
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
    : chat.chatName ?? chat.bot?.name ?? t("admin.chats.list.untitled", "Untitled chat");
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
      ? t("admin.chats.list.me", "Me")
      : senderUser
      ? getUserFullName(senderUser)
      : chat.bot?.name ?? t("admin.chats.list.other", "Participant")
    : "";

  const messageBody = lastMessageContent?.trim()
    ? lastMessageContent
    : lastMessage?.images?.length
    ? t("admin.chats.list.photo", "Sent a photo")
    : lastMessage?.attachments?.length
    ? t("admin.chats.list.file", "Sent a file")
    : t("admin.chats.list.noMessages", "No messages");

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
