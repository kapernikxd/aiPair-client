// components/chats/ChatsView.tsx
"use client";

import PageHeader from "@/components/chats/PageHeader";
import ChatList from "@/components/chats/ChatList";
import { AuthRouteKey } from "@/helpers/hooks/useAuthRoutes";
import { ChatListItem } from "@/stores/ChatStore";

type Props = {
  chats: ChatListItem[];
  isLoadingChats: boolean;
  currentUserId: string;
  routeFor: (key: AuthRouteKey) => string;
  onSelect: (chat: { _id: string }) => void;
  getChatHref: (chat: { _id: string }) => string;
};

export default function ChatsView({
  chats,
  isLoadingChats,
  currentUserId,
  routeFor,
  onSelect,
  getChatHref,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20 pt-4 md:px-8 md:pb-16 md:pt-8">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <PageHeader />
        <ChatList
          chats={chats}
          routeFor={routeFor}
          onSelect={onSelect}
          isLoading={isLoadingChats}
          getChatHref={getChatHref}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
