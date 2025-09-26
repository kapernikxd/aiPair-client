import { AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";
import { ReactNode } from "react";
import { ChatDTO } from "@/helpers/types";
import ChatListItem from "./ChatListItem";

export default function ChatList({
  chats,
  routeFor,
  onSelect,
  isLoading = false,
  emptyState,
  getChatHref,
}: {
  chats: ChatDTO[];
  routeFor: (routeKey: AuthRouteKey) => string;
  onSelect?: (chat: ChatDTO) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  getChatHref?: (chat: ChatDTO) => string;
}) {
  const renderSkeleton = () => (
    <ul className="divide-y divide-white/5 overflow-hidden rounded-[28px]">
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index} className="flex items-center gap-4 py-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-white/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
            <div className="h-3 w-3/4 animate-pulse rounded bg-white/5" />
          </div>
        </li>
      ))}
    </ul>
  );

  const fallbackHref = (chat: ChatDTO) => `${routeFor("adminChat")}?chatId=${chat._id}`;

  const listContent = () => {
    if (isLoading) {
      return renderSkeleton();
    }

    if (!chats.length) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-sm text-white/60">
          {emptyState ?? (
            <>
              <p>No chats yet.</p>
              <p className="text-xs text-white/40">Start a conversation to see it here.</p>
            </>
          )}
        </div>
      );
    }

    return (
      <ul className="divide-y divide-white/5 overflow-hidden rounded-[28px]">
        {chats.map((chat) => (
          <ChatListItem
            key={chat._id}
            chat={chat}
            href={getChatHref?.(chat) ?? fallbackHref(chat)}
            onSelect={onSelect}
          />
        ))}
      </ul>
    );
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 p-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      {listContent()}
    </div>
  );
}
